/* One-off check for the "Some Of Our Clients…" pinned horizontal section.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-client-stories.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-voices'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

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
  await new Promise((r) => setTimeout(r, 900))

  const meta = await page.evaluate(() => {
    const s = document.querySelector('.voices')
    const track = document.querySelector('.voices__track')
    const r = s.getBoundingClientRect()
    return {
      pinned: s.classList.contains('is-pinned'),
      top: r.top + scrollY,
      height: Math.round(r.height),
      trackWidth: Math.round(track.scrollWidth),
      travel: Math.round(track.scrollWidth - innerWidth),
      posters: [...document.querySelectorAll('.voices__media img')].map(
        (i) => `${i.naturalWidth}x${i.naturalHeight}`,
      ),
      names: [...document.querySelectorAll('.voices__name')].map(
        (n) => n.textContent,
      ),
    }
  })

  const samples = []
  for (const t of [0, 0.5, 1]) {
    const y = meta.pinned
      ? meta.top + t * (meta.height - height)
      : meta.top + t * Math.max(0, meta.height - height)
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await new Promise((r) => setTimeout(r, 800))
    await page.screenshot({ path: `${outDir}/${tag}-${t}.png` })
    samples.push(
      await page.evaluate(() => {
        const track = document.querySelector('.voices__track')
        const last = document.querySelector('.voices__outro')
        return {
          trackX: new DOMMatrix(getComputedStyle(track).transform).m41.toFixed(1),
          lastPanelRight: Math.round(last.getBoundingClientRect().right),
          firstCardLeft: Math.round(
            document.querySelector('.voices__item').getBoundingClientRect().left,
          ),
          overflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          posters: [...document.querySelectorAll('.voices__media img')].map(
            (i) => `${i.naturalWidth}x${i.naturalHeight}`,
          ),
        }
      }),
    )
  }

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log(JSON.stringify(meta))
  for (const s of samples) console.log(JSON.stringify(s))
  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
