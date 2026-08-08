/* Check for "Frequently Asked Questions" — the tabbed glass accordion.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-faq.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-faq'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const rows = [...document.querySelectorAll('.faq__row')]
  const tabs = [...document.querySelectorAll('.faq__tab')]
  const round = (n) => Math.round(n)
  return {
    activeTab: tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
    tabLabels: tabs.map((t) => t.textContent.trim()),
    /* One answer open at a time, and `aria-expanded` has to agree with it. */
    open: rows.map((r) => r.dataset.open),
    expanded: rows.map((r) => r.querySelector('.faq__q').getAttribute('aria-expanded')),
    answerHeights: rows.map((r) =>
      round(r.querySelector('.faq__aIn').getBoundingClientRect().height),
    ),
    questions: rows.map((r) => r.querySelector('.faq__q > span').textContent.trim()),
    rowCount: rows.length,
    /* The tab panel must name the tab that controls it. */
    panelLabelledBy: document
      .querySelector('.faq__panel')
      .getAttribute('aria-labelledby'),
    glass: (() => {
      const s = getComputedStyle(rows[0])
      return [s.backgroundColor, s.backdropFilter || s.webkitBackdropFilter]
    })(),
    starColour: getComputedStyle(document.querySelector('.faq__stars')).color,
    ctaButton: document.querySelector('.faq__ctaBtn').textContent.trim(),
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
    const r = document.querySelector('.faq').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  await page.evaluate((y) => window.scrollTo(0, y), box.top - 40)
  await new Promise((r) => setTimeout(r, 1200))
  console.log('at rest', JSON.stringify(await page.evaluate(probe)))
  await page.screenshot({ path: `${outDir}/${tag}-consultation.png` })

  // Opening a second question must close the first.
  await page.evaluate(() => document.querySelectorAll('.faq__q')[3].click())
  await new Promise((r) => setTimeout(r, 900))
  console.log('open #4', JSON.stringify(await page.evaluate(probe)))

  // Clicking the open one closes it — nothing open is a legal state.
  await page.evaluate(() => document.querySelectorAll('.faq__q')[3].click())
  await new Promise((r) => setTimeout(r, 900))
  console.log('close #4', JSON.stringify(await page.evaluate(probe)))

  // Switch tabs: different questions, and this tab keeps its own open row.
  await page.evaluate(() => document.querySelectorAll('.faq__tab')[1].click())
  await new Promise((r) => setTimeout(r, 1100))
  console.log('tab 2', JSON.stringify(await page.evaluate(probe)))
  await page.screenshot({ path: `${outDir}/${tag}-hair-system.png` })

  await page.evaluate(() => document.querySelectorAll('.faq__tab')[0].click())
  await new Promise((r) => setTimeout(r, 1100))
  console.log('back to tab 1', JSON.stringify(await page.evaluate(probe)))

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
