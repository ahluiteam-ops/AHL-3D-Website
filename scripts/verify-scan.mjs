/* Check for "Uses Advanced 3D Scan Technology" — the inline picture that grows
 * out of the headline. Run from inside the project tree so `puppeteer-core`
 * resolves.
 *   node scripts/verify-scan.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-scan'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.scan')
  const pin = document.querySelector('.scan__pin')
  const panel = document.querySelector('.scan__panel')
  const title = document.querySelector('.scan__title')
  const img = panel.querySelector('img')
  const round = (n) => Math.round(n)
  const p = pin.getBoundingClientRect()
  const b = panel.getBoundingClientRect()
  return {
    still: section.classList.contains('scan--still'),
    /* The panel grows from the slot's rect to the stage's. */
    panelBox: [round(b.left - p.left), round(b.top - p.top), round(b.width), round(b.height)],
    stage: [round(p.width), round(p.height)],
    coversStage: round(b.width) >= round(p.width) && round(b.height) >= round(p.height),
    radius: getComputedStyle(panel).borderTopLeftRadius,
    /* The type holds still and dims; it must not move. */
    titleTop: round(title.getBoundingClientRect().top),
    titleOpacity: Number(getComputedStyle(title).opacity).toFixed(2),
    /* The slot is never painted, but it must keep its place in the sentence. */
    slotBox: (() => {
      const s = document.querySelector('.scan__slot')
      if (!s) return null
      const r = s.getBoundingClientRect()
      return [round(r.width), round(r.height)]
    })(),
    lines: [...document.querySelectorAll('.scan__line')].map((l) =>
      l.textContent.trim(),
    ),
    loaded: `${img.naturalWidth}x${img.naturalHeight}`,
    altLength: img.alt.length,
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
  await new Promise((r) => setTimeout(r, 800))

  const box = await page.evaluate(() => {
    const r = document.querySelector('.scan').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.3, 0.6, 1] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1500))
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
