/* "Why Hair Patches Often Fail The Confidence Test" — structure, reveal,
 * contrast-critical colours, tap targets, fit.
 *   node scripts/verify-patchfail.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/hair-patch-vs-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-patchfail'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1300))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)

  const before = await page.evaluate(() => {
    const el = document.querySelector('.patchFail__in')
    return el ? el.getAttribute('data-shown') : 'MISSING'
  })

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.patchFail')
      if (el) scrollBy(0, el.getBoundingClientRect().top - 40)
    })
    await new Promise((r) => setTimeout(r, 240))
  }
  await new Promise((r) => setTimeout(r, 900))

  const m = await page.evaluate(() => {
    const sec = document.querySelector('.patchFail')
    const inner = document.querySelector('.patchFail__in')
    const cta = document.querySelector('.patchFail__cta').getBoundingClientRect()
    const fonts = [...document.querySelectorAll('.patchFail p, .patchFail h3')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
    return {
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      section: Math.round(sec.getBoundingClientRect().height),
      vh: innerHeight,
      shown: inner.getAttribute('data-shown'),
      opacity: +getComputedStyle(inner).opacity,
      title: document.querySelector('.patchFail__title').textContent.trim(),
      bolds: [...document.querySelectorAll('.patchFail__body strong')].map((b) => b.textContent),
      markColour: getComputedStyle(document.querySelector('.patchFail__mark')).color,
      cta: [Math.round(cta.width), Math.round(cta.height)],
      href: document.querySelector('.patchFail__cta').getAttribute('href'),
      minFont: Math.min(...fonts).toFixed(2),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  console.log('order         :', m.order.join(' > '))
  console.log('reveal        :', before, '->', m.shown, '| opacity', m.opacity)
  console.log('title         :', JSON.stringify(m.title))
  console.log('emphasis      :', m.bolds.map((b) => JSON.stringify(b)).join(', '))
  console.log('warning mark  :', m.markColour)
  console.log('section       :', m.section + 'px /', m.vh, m.section <= m.vh ? 'FITS' : 'over by ' + (m.section - m.vh))
  console.log('cta           :', m.cta.join('x'), m.cta[1] >= 44 ? 'OK' : 'UNDER 44', '|', m.href)
  console.log('min font      :', m.minFont + 'px', m.minFont >= 14 ? 'OK' : 'UNDER FLOOR')
  console.log('page overflow :', m.overflow)
  console.log('console errors:', errors.length ? errors.slice(0, 4) : 'none')

  await page.screenshot({ path: `${out}/patchfail-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
