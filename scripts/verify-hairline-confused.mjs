/* Page 4's closing scrub block, which is `StillConfused` with its own headline.
 * Also re-probes page 2's instance, since the component was made data-driven.
 *   node scripts/verify-hairline-confused.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/#'
const out = process.argv[2] ?? './.tmp-hlconfused'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(route, width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1600))

  const base = await page.evaluate(() => {
    const sec = document.querySelector('.stillConfused')
    if (!sec) return { missing: true }
    const h = sec.querySelector('h2')
    const cta = sec.querySelector('a')
    return {
      static: sec.className.includes('is-static'),
      /* The words are separate spans spaced by a flex gap, so `textContent`
         is deliberately run-on; the heading carries an `aria-label` and that
         is what a screen reader announces. Assert the label. */
      title: h.getAttribute('aria-label'),
      rawText: h.textContent.replace(/\s+/g, ' ').trim(),
      titleId: h.id,
      labelled: sec.getAttribute('aria-labelledby') === h.id,
      words: sec.querySelectorAll('.stillConfused__word').length,
      eyebrow: sec.querySelector('.stillConfused__eyebrow').textContent.trim(),
      subtext: sec.querySelector('.stillConfused__subtext').textContent.replace(/\s+/g, ' ').trim(),
      cta: cta.textContent.trim(),
      href: cta.getAttribute('href'),
      ctaBox: [Math.round(cta.getBoundingClientRect().width), Math.round(cta.getBoundingClientRect().height)],
      capsule: !!sec.querySelector('.stillConfused__capsule'),
      secH: Math.round(sec.getBoundingClientRect().height),
    }
  })

  if (base.missing) {
    console.log(tag.padEnd(16), 'SECTION MISSING')
    await page.close()
    return
  }

  // Walk the scrub and watch the words light.
  await page.evaluate(() => {
    const el = document.querySelector('.stillConfused')
    scrollTo(0, el.getBoundingClientRect().top + scrollY)
  })
  await new Promise((r) => setTimeout(r, 500))
  const lit = []
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => scrollBy(0, innerHeight * 0.22))
    await new Promise((r) => setTimeout(r, 230))
    lit.push(
      await page.evaluate(() => {
        const ws = [...document.querySelectorAll('.stillConfused__word')]
        return ws.filter((w) => parseFloat(getComputedStyle(w).opacity) > 0.92).length
      }),
    )
  }
  const climbs = lit.every((v, i) => i === 0 || v >= lit[i - 1])
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  console.log(
    tag.padEnd(16),
    `${width}x${height}`.padEnd(10),
    `words ${base.words}`.padEnd(10),
    base.static ? 'STATIC' : `lit ${lit[0]}\u2192${lit[lit.length - 1]}`.padEnd(12),
    base.static ? '' : climbs ? 'monotonic' : 'NOT MONOTONIC',
    '| cta', base.ctaBox.join('x'),
    '| capsule', base.capsule,
    '| overflow', overflow,
    '| errors', errors.length || 'none',
  )
  if (errors.length) console.log('    ', errors.slice(0, 2))
  await page.screenshot({ path: `${out}/sc-${tag}.png` })
  await page.close()
  return base
}

console.log('--- page 4 ---')
const p4 = await run('/will-my-hairline-look-real', 1440, 900, false, 'p4-desktop')
console.log('   eyebrow :', JSON.stringify(p4.eyebrow))
console.log('   title   :', JSON.stringify(p4.title))
console.log('   titleId :', p4.titleId, '| labelled', p4.labelled)
console.log('   subtext :', JSON.stringify(p4.subtext))
console.log('   cta     :', JSON.stringify(p4.cta), '->', p4.href)
await run('/will-my-hairline-look-real', 768, 1024, false, 'p4-tablet')
await run('/will-my-hairline-look-real', 390, 844, false, 'p4-mobile')
await run('/will-my-hairline-look-real', 1440, 900, true, 'p4-reduced')

console.log('\n--- page 2, must be unchanged ---')
const p2 = await run('/stick-on-or-clip-on', 1440, 900, false, 'p2-desktop')
console.log('   title   :', JSON.stringify(p2.title), '| titleId', p2.titleId)

await browser.close()
