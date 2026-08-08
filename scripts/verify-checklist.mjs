/* One-off visual/behavioural check for the 21-Point Checklist section.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-checklist.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-checklist'
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
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle2' })

  const box = await page.evaluate(() => {
    const s = document.querySelector('.checklist')
    const r = s.getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height, still: s.classList.contains('checklist--still') }
  })

  const samples = []
  const steps = reduced ? [0] : [0, 0.12, 0.3, 0.5, 0.72, 0.95]
  for (const t of steps) {
    await page.evaluate((y) => window.scrollTo(0, y), box.top + t * (box.height - height))
    await new Promise((r) => setTimeout(r, 1200))
    const s = await page.evaluate(() => {
      const inEl = document.querySelector('.checklist__in')
      const rows = [...document.querySelectorAll('.checklist__row')]
      const active = rows.findIndex((r) => r.dataset.active === 'true')
      const cs = getComputedStyle(rows[Math.max(active, 0)])
      const track = document.querySelector('.checklist__track')
      return {
        cursor: inEl.style.getPropertyValue('--cursor'),
        active,
        activeTitle: active >= 0 ? rows[active].querySelector('h3').textContent : null,
        activeOpacity: cs.opacity,
        activeFilter: cs.filter,
        neighbourFilter: rows[active + 1] ? getComputedStyle(rows[active + 1]).filter : null,
        trackY: new DOMMatrix(getComputedStyle(track).transform).m42.toFixed(1),
        odometer: document.querySelector('.checklist__index')?.textContent ?? null,
        tally: document.querySelector('.checklist__tally')?.textContent ?? null,
        railW: document.querySelector('.checklist__railFill')?.getBoundingClientRect().width.toFixed(1),
        posterLoaded: (() => {
          const img = document.querySelector('.checklist__media img')
          return img ? `${img.naturalWidth}x${img.naturalHeight}` : 'none'
        })(),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })
    samples.push({ t, ...s })
  }

  await page.screenshot({ path: `${outDir}/${tag}.png` })
  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height), 'still', box.still)
  for (const s of samples) console.log(JSON.stringify(s))
  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
