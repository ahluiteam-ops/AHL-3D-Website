/* "If You Want To Use Your Natural Hair In The Front…" — the scroll-built card
 * stack. Also re-probes the homepage `Story`, since both now share
 * `ScrollStack`.
 *   node scripts/verify-natural-front.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/#'
const out = process.argv[2] ?? './.tmp-nfront'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(route, sel, width, height, reduced, tag, shot) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => errors.push('REQ FAIL ' + r.url()))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1600))

  const base = await page.evaluate((s) => {
    const sec = document.querySelector(s.sec)
    if (!sec) return { missing: true }
    const h = sec.querySelector('h2')
    const rows = [...sec.querySelectorAll(s.row)]
    return {
      still: sec.className.includes('--still'),
      title: h.textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === h.id,
      rows: rows.length,
      inners: sec.querySelectorAll(s.inner).length,
      secH: Math.round(sec.getBoundingClientRect().height),
      pin: getComputedStyle(sec.querySelector(s.pin)).position,
    }
  }, sel)

  if (base.missing) {
    console.log(tag.padEnd(14), 'SECTION MISSING')
    await page.close()
    return
  }

  await page.evaluate((s) => {
    const el = document.querySelector(s.sec)
    scrollTo(0, el.getBoundingClientRect().top + scrollY)
  }, sel)
  await new Promise((r) => setTimeout(r, 700))

  const opened = []
  for (let i = 0; i < 14; i++) {
    await page.evaluate(() => scrollBy(0, innerHeight * 0.26))
    await new Promise((r) => setTimeout(r, 240))
    opened.push(
      await page.evaluate(
        (s) =>
          [...document.querySelectorAll(s.row)].filter(
            (r) => Math.round(r.getBoundingClientRect().height) > 60,
          ).length,
        sel,
      ),
    )
    if (shot && i === 5) {
      await page.screenshot({ path: `${out}/${tag}-mid.png` })
    }
  }
  const climbs = opened.every((v, i) => i === 0 || v >= opened[i - 1])
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  console.log(
    tag.padEnd(14),
    `${width}x${height}`.padEnd(10),
    `rows ${base.rows}`.padEnd(9),
    `inners ${base.inners}`.padEnd(11),
    base.still ? 'STATIC' : `pin ${base.pin}`.padEnd(12),
    `open ${opened[0]}\u2192${opened[opened.length - 1]}`.padEnd(12),
    climbs ? 'monotonic' : 'NOT MONOTONIC',
    '| h', base.secH,
    '| ov', overflow,
    '| err', errors.length || 'none',
  )
  if (errors.length) console.log('     ', errors.slice(0, 2))
  if (shot) console.log('   title:', JSON.stringify(base.title), '| labelled', base.labelled)
  await page.close()
}

const NF = { sec: '.nfront', row: '.nfront__row', inner: '.nfront__rowIn', pin: '.nfront__pin' }
const ST = { sec: '.story', row: '.story__row', inner: '.story__rowIn', pin: '.story__pin' }

console.log('--- page 4: new section ---')
await run('/will-my-hairline-look-real', NF, 1440, 900, false, 'nfront-desktop', true)
await run('/will-my-hairline-look-real', NF, 1100, 900, false, 'nfront-laptop', false)
await run('/will-my-hairline-look-real', NF, 390, 844, false, 'nfront-mobile', false)
await run('/will-my-hairline-look-real', NF, 1440, 900, true, 'nfront-reduced', false)

console.log('\n--- homepage Story, must be unchanged ---')
await run('/', ST, 1440, 900, false, 'story-desktop', false)
await run('/', ST, 390, 844, false, 'story-mobile', false)

await browser.close()
