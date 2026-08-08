/* Check for the "This Might Sound Like Your Story" stacking section.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-story.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-story'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.story')
  const rows = [...document.querySelectorAll('.story__row')]
  return {
    still: section.classList.contains('story--still'),
    titleTop: Math.round(
      document.querySelector('.story__title').getBoundingClientRect().top,
    ),
    heights: rows.map((r) => Math.round(r.getBoundingClientRect().height)),
    copyOpacity: rows.map((r) =>
      Number(getComputedStyle(r.querySelector('.story__rowIn')).opacity).toFixed(
        2,
      ),
    ),
    stackBottom: Math.round(
      rows[rows.length - 1].getBoundingClientRect().bottom,
    ),
    ctaVisible:
      document.querySelector('.story__ctaBtn').getBoundingClientRect().height >
      0,
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
    const r = document.querySelector('.story').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.2, 0.45, 0.7, 1, 0.3] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1200))
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
