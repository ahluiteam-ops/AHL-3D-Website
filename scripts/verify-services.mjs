/* Check for the "Explore Our Trusted Range Of Hair Services" accordion.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-services.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-services'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.services')
  const rows = [...document.querySelectorAll('.services__row')]
  const imgs = [...document.querySelectorAll('.services__media img')]
  const round = (n) => Math.round(n)
  return {
    still: section.classList.contains('services--still'),
    open: rows.map((i) => i.dataset.open),
    expanded: rows.map((i) =>
      i.querySelector('.services__head').getAttribute('aria-expanded'),
    ),
    /* The row's own height is the mechanism: open rows must stand clearly
       taller than closed ones, and every name must stay on the same line. */
    rowHeights: rows.map((i) => round(i.getBoundingClientRect().height)),
    nameTops: rows.map((i) =>
      round(
        i.querySelector('.services__name').getBoundingClientRect().top -
          i.getBoundingClientRect().top,
      ),
    ),
    bodyHeights: rows.map((i) =>
      round(i.querySelector('.services__bodyIn').getBoundingClientRect().height),
    ),
    bodyOpacity: rows.map((i) =>
      Number(getComputedStyle(i.querySelector('.services__bodyIn')).opacity).toFixed(2),
    ),
    imgLoaded: imgs.map((i) => `${i.naturalWidth}x${i.naturalHeight}`),
    mediaBoxes: [...document.querySelectorAll('.services__media')].map((m) => {
      const r = m.getBoundingClientRect()
      return [round(r.width), round(r.height)]
    }),
    headingIndent: (() => {
      const h = document.querySelector('.services__title').getBoundingClientRect()
      const n = document.querySelector('.services__name').getBoundingClientRect()
      return [round(h.left), round(n.left)]
    })(),
    ctaCount: document.querySelectorAll('.services__cta').length,
    overflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  }
}

async function run(width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('requestfailed', (r) => failed.push(r.url()))
  await page.setViewport({ width, height })
  if (reduced)
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 700))

  const box = await page.evaluate(() => {
    const r = document.querySelector('.services').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.5, 1, 0.5] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1400))
    console.log(t, JSON.stringify(await page.evaluate(probe)))
    await page.screenshot({ path: `${outDir}/${tag}-${t}.png` })
  }

  // The heads are real buttons: clicking the third must open the third.
  await page.evaluate(() => {
    document.querySelectorAll('.services__head')[2].click()
  })
  await new Promise((r) => setTimeout(r, 1600))
  console.log('after click #3', JSON.stringify(await page.evaluate(probe)))
  await page.screenshot({ path: `${outDir}/${tag}-click.png` })

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
