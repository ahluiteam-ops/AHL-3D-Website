/* Check for "Why Thousands Of Men Choose American Hairline".
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-pillars.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-pillars'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.pillars')
  const cols = [...document.querySelectorAll('.pillars__col')]
  const round = (n) => Math.round(n)
  return {
    still: section.classList.contains('pillars--still'),
    /* The bays fill strictly left to right: these four must climb in turn. */
    copyOpacity: cols.map((c) =>
      Number(getComputedStyle(c.querySelector('.pillars__copy')).opacity).toFixed(2),
    ),
    iconOpacity: cols.map((c) =>
      Number(getComputedStyle(c.querySelector('.pillars__icon')).opacity).toFixed(2),
    ),
    /* The grid stands whatever the columns are doing, so the rules must never
       change with the scroll. */
    colLefts: cols.map((c) => round(c.getBoundingClientRect().left)),
    colRules: cols.map((c) => getComputedStyle(c).borderLeftWidth),
    gridTopRule: getComputedStyle(document.querySelector('.pillars__grid')).borderTopWidth,
    titleTop: round(document.querySelector('.pillars__title').getBoundingClientRect().top),
    strongCount: document.querySelectorAll('.pillars__copy strong').length,
    /* `**` must never survive into the rendered copy. */
    strayMarkers: [...document.querySelectorAll('.pillars__copy p')].filter((p) =>
      p.textContent.includes('**'),
    ).length,
    stageBg: getComputedStyle(section).backgroundColor,
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
    const r = document.querySelector('.pillars').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.25, 0.5, 0.75, 1] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1400))
    console.log(t, JSON.stringify(await page.evaluate(probe)))
    await page.screenshot({ path: `${outDir}/${tag}-${t}.png` })
  }

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
