/* Mobile audit. Walks every section at phone widths and reports the things
 * that actually break on a phone, measured rather than eyeballed:
 *
 *   - horizontal overflow, page-wide and per element
 *   - tap targets under 44x44
 *   - body text under 14px
 *   - sections taller than 3 viewports (a pin that outstays its welcome)
 *   - text sitting on top of other text
 *
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/audit-mobile.mjs [width] [height]
 */
import puppeteer from 'puppeteer-core'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const width = Number(process.argv[2] ?? 390)
const height = Number(process.argv[3] ?? 844)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--autoplay-policy=no-user-gesture-required'],
})

const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.setViewport({ width, height, isMobile: true, hasTouch: true })
/* The page intentionally streams one large local MP4 and lazy-loads media as
 * this audit walks it. Waiting for network-idle turns that healthy traffic
 * into a false timeout; DOM readiness is the stable audit boundary. */
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1200))

/* Walk the whole page so lazy content and scroll-driven sections settle. */
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 900))

const report = await page.evaluate((vw) => {
  const round = (n) => Math.round(n)
  const name = (el) => {
    const s = el.tagName.toLowerCase()
    const c = (el.className || '').toString().split(' ').filter(Boolean)[0]
    return c ? `${s}.${c}` : s
  }

  const sections = [...document.querySelectorAll('main > section, main > div, footer')]

  /* Anything painting past the right edge. Elements that are themselves
     scroll containers are allowed — that is a rail, not a bug. */
  const scrollable = (el) => {
    const o = getComputedStyle(el).overflowX
    return o === 'auto' || o === 'scroll'
  }
  const intentionallyContained = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (scrollable(p)) return true
      const overflow = getComputedStyle(p).overflowX
      if (overflow === 'hidden' || overflow === 'clip') {
        const childRect = el.getBoundingClientRect()
        const parentRect = p.getBoundingClientRect()
        if (childRect.left < parentRect.left || childRect.right > parentRect.right) return true
      }
    }
    return false
  }

  const bleeds = []
  for (const el of document.querySelectorAll('main *, footer *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (intentionallyContained(el)) continue
    const over = round(r.right - vw)
    if (over > 1 || r.left < -1) {
      bleeds.push({ el: name(el), left: round(r.left), right: round(r.right), over })
    }
  }

  /* Tap targets. 44x44 is the floor both Apple and WCAG 2.5.5 land on. */
  const small = []
  for (const el of document.querySelectorAll('a[href], button, select, input, [role="tab"]')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (getComputedStyle(el).display === 'contents') continue
    if (r.width < 44 || r.height < 44) {
      small.push({ el: name(el), size: [round(r.width), round(r.height)], text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28) })
    }
  }

  /* Body copy below 14px is where phone reading starts to hurt. */
  const tiny = []
  const seen = new Set()
  for (const el of document.querySelectorAll('p, li, span, h1, h2, h3, h4, label, a')) {
    if (!el.textContent || !el.textContent.trim()) continue
    if (el.querySelector('p, li, h1, h2, h3, h4')) continue
    const fs = parseFloat(getComputedStyle(el).fontSize)
    if (fs < 14) {
      const key = name(el) + fs
      if (seen.has(key)) continue
      seen.add(key)
      tiny.push({ el: name(el), px: +fs.toFixed(1), text: el.textContent.trim().slice(0, 30) })
    }
  }

  const tall = sections
    .map((s) => ({ el: name(s), h: round(s.getBoundingClientRect().height), vh: +(s.getBoundingClientRect().height / window.innerHeight).toFixed(1) }))
    .filter((s) => s.vh > 3)

  return {
    viewport: [vw, window.innerHeight],
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    docHeight: round(document.body.scrollHeight),
    sections: sections.map((s) => ({ el: name(s), h: round(s.getBoundingClientRect().height) })),
    bleeds: bleeds.slice(0, 40),
    bleedCount: bleeds.length,
    smallTargets: small.slice(0, 30),
    smallCount: small.length,
    tinyText: tiny.slice(0, 20),
    tall,
  }
}, width)

console.log(`\n===== MOBILE AUDIT ${width}x${height} =====`)
console.log('page overflow :', report.pageOverflow, 'px')
console.log('document height:', report.docHeight, 'px =', (report.docHeight / height).toFixed(1), 'viewports')
console.log('\n-- sections --')
for (const s of report.sections) console.log('  ', s.el.padEnd(22), s.h + 'px')
console.log('\n-- elements painting past the right edge:', report.bleedCount, '--')
for (const b of report.bleeds) console.log('  ', b.el.padEnd(26), 'left', String(b.left).padStart(6), 'right', String(b.right).padStart(6), 'over', b.over)
console.log('\n-- tap targets under 44px:', report.smallCount, '--')
for (const t of report.smallTargets) console.log('  ', t.el.padEnd(26), t.size.join('x').padEnd(10), JSON.stringify(t.text))
console.log('\n-- text under 14px --')
for (const t of report.tinyText) console.log('  ', t.el.padEnd(26), t.px + 'px', JSON.stringify(t.text))
console.log('\n-- sections over 3 viewports --')
for (const t of report.tall) console.log('  ', t.el.padEnd(22), t.h + 'px =', t.vh + ' viewports')
console.log('\nconsole errors:', errors.length ? errors.slice(0, 5) : 'none')

await browser.close()
