/* Check for "Backed By Thousands Of Confident Men" — the dark proof panel.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-backed.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-backed'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const panel = document.querySelector('.backed__panel')
  const cards = [...document.querySelectorAll('.backed__card')]
  const round = (n) => Math.round(n)
  const ps = getComputedStyle(panel)
  return {
    shown: panel.dataset.shown,
    panelBox: [
      round(panel.getBoundingClientRect().width),
      round(panel.getBoundingClientRect().height),
    ],
    panelRadius: ps.borderTopLeftRadius,
    title: document.querySelector('.backed__title').textContent.trim(),
    /* Two glass cards, side by side above 760px and stacked below it. */
    cardCount: cards.length,
    cardTops: cards.map((c) => round(c.getBoundingClientRect().top)),
    cardBoxes: cards.map((c) => [
      round(c.getBoundingClientRect().width),
      round(c.getBoundingClientRect().height),
    ]),
    /* The qualifier has to sit near the figure it qualifies, not at the far
       end of a letterbox. */
    noteToValue: cards.map((c) => {
      const n = c.querySelector('.backed__note').getBoundingClientRect()
      const v = c.querySelector('.backed__value').getBoundingClientRect()
      return round(Math.hypot(n.left - v.left, n.top - v.top))
    }),
    valueFontSize: getComputedStyle(document.querySelector('.backed__value')).fontSize,
    innerWidth: round(document.querySelector('.backed__in').getBoundingClientRect().width),
    glass: (() => {
      const s = getComputedStyle(cards[0])
      return [s.backgroundColor, s.backdropFilter || s.webkitBackdropFilter]
    })(),
    values: [...document.querySelectorAll('.backed__value')].map((v) =>
      v.textContent.replace(/\s+/g, ' ').trim(),
    ),
    labels: [...document.querySelectorAll('.backed__label')].map((l) =>
      l.textContent.trim(),
    ),
    notes: [...document.querySelectorAll('.backed__note')].map((n) =>
      n.textContent.trim(),
    ),
    /* 4.9 must render as four whole stars and a half, never five whole ones —
       rounding a rating up is the one thing a rating must not do. */
    stars: [...document.querySelectorAll('.backed__stars svg')].map((s) =>
      s.getAttribute('class').includes('half') ? 'half' : 'full',
    ),
    starColour: getComputedStyle(document.querySelector('.backed__stars')).color,
    icons: [...document.querySelectorAll('.backed__icon')].map(
      (i) => `${i.alt}:${i.naturalWidth}x${i.naturalHeight}`,
    ),
    foot: document.querySelector('.backed__foot').textContent.trim(),
    /* The artwork's eyebrow pill is deliberately absent — one heading per
       section, per the visual system. */
    eyebrows: document.querySelectorAll('.backed__panel .pill, .backed__eyebrow')
      .length,
    overflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
}

async function run(width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => failed.push(r.url()))
  await page.setViewport({ width, height })
  if (reduced)
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 700))

  const box = await page.evaluate(() => {
    const r = document.querySelector('.backed').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  await page.evaluate(
    (y) => window.scrollTo(0, y),
    box.top - Math.max(0, (height - box.height) / 2),
  )
  await new Promise((r) => setTimeout(r, 1400))
  console.log('at rest', JSON.stringify(await page.evaluate(probe)))
  await page.screenshot({ path: `${outDir}/${tag}.png` })

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
