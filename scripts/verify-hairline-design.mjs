/* "How We Design The World's Most Natural Hairline" — which is `Checklist`
 * with page-4 content. Also re-probes the other two checklist instances, since
 * making the component data-driven touched all of them.
 *   node scripts/verify-hairline-design.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/#'
const out = process.argv[2] ?? './.tmp-hldesign'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(route, nth, width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => errors.push('REQ FAIL ' + r.url()))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  const base = await page.evaluate((n) => {
    const sec = document.querySelectorAll('.checklist')[n]
    if (!sec) return { missing: true }
    const img = sec.querySelector('.checklist__media img')
    return {
      count: getComputedStyle(sec.querySelector('.checklist__in')).getPropertyValue('--checklist-count').trim(),
      still: sec.className.includes('--still'),
      rows: sec.querySelectorAll('.checklist__row').length,
      title: sec.querySelector('.checklist__title').textContent.replace(/\s+/g, ' ').trim(),
      titleId: sec.querySelector('.checklist__title').id,
      labelled: sec.getAttribute('aria-labelledby') === sec.querySelector('.checklist__title').id,
      lede: sec.querySelector('.checklist__lede').textContent.trim(),
      tally: sec.querySelector('.checklist__tally')?.textContent.replace(/\s+/g, ' ').trim(),
      poster: img ? new URL(img.src).pathname : null,
      playLabel: sec.querySelector('.checklist__play')?.textContent.trim(),
      mediaTag: sec.querySelector('.checklist__media').tagName,
      secH: Math.round(sec.getBoundingClientRect().height),
    }
  }, nth)

  if (base.missing) {
    console.log(tag.padEnd(22), 'SECTION MISSING')
    await page.close()
    return
  }

  // Walk the pin, fine enough for the point pitch.
  const seen = []
  for (let i = 0; i < 26; i++) {
    await page.evaluate(
      (n, first) => {
        const el = document.querySelectorAll('.checklist')[n]
        if (el && first) scrollTo(0, el.getBoundingClientRect().top + scrollY)
        scrollBy(0, innerHeight * 0.14)
      },
      nth,
      i === 0,
    )
    await new Promise((r) => setTimeout(r, 170))
    seen.push(
      await page.evaluate((n) => {
        const rows = [...document.querySelectorAll('.checklist')[n].querySelectorAll('.checklist__row')]
        return rows.findIndex((r) => r.dataset.active === 'true')
      }, nth),
    )
  }
  const distinct = [...new Set(seen.filter((x) => x >= 0))]
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  console.log(
    tag.padEnd(22),
    `count ${base.count}`.padEnd(10),
    `rows ${base.rows}`.padEnd(9),
    `tally ${base.tally}`.padEnd(14),
    base.still ? 'STATIC' : `focus states ${distinct.length}`.padEnd(16),
    `| ${base.mediaTag}`,
    '| overflow', overflow,
    '| errors', errors.length || 'none',
  )
  if (errors.length) console.log('    ', errors.slice(0, 2))
  await page.screenshot({ path: `${out}/cl-${tag}.png` })
  await page.close()
  return base
}

console.log('--- page 4: the new section ---')
const p4 = await run('/will-my-hairline-look-real', 0, 1440, 900, false, 'p4-desktop')
console.log('   title   :', JSON.stringify(p4.title))
console.log('   lede    :', JSON.stringify(p4.lede))
console.log('   titleId :', p4.titleId, '| labelled', p4.labelled)
console.log('   poster  :', p4.poster)
console.log('   play    :', JSON.stringify(p4.playLabel))
await run('/will-my-hairline-look-real', 0, 768, 1024, false, 'p4-tablet')
await run('/will-my-hairline-look-real', 0, 390, 844, false, 'p4-mobile')
await run('/will-my-hairline-look-real', 0, 1440, 900, true, 'p4-reduced')

console.log('\n--- the other two instances, must be unchanged ---')
const home = await run('/', 0, 1440, 900, false, 'home-desktop')
console.log('   title   :', JSON.stringify(home.title), '| titleId', home.titleId)
const p3 = await run('/hair-patch-vs-hair-system', 0, 1440, 900, false, 'page3-desktop')
console.log('   title   :', JSON.stringify(p3.title), '| titleId', p3.titleId)

await browser.close()
