/* Check for the "World's Finest Thinnest Hair Systems" collection surfer.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-systems.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-systems'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.surf')
  const track = document.querySelector('.surf__track')

  /* Cards still to come are fully opaque; a card that has been surfed past is
     fading out. So the front card is the nearest — widest — of the opaque
     ones. A passing card can be wider still, which is why opacity gates this. */
  const cards = [...document.querySelectorAll('.surf__card')]
  const opaque = cards.filter((c) => Number(getComputedStyle(c).opacity) > 0.99)
  const front = opaque.length
    ? opaque.reduce((a, b) =>
        b.getBoundingClientRect().width > a.getBoundingClientRect().width
          ? b
          : a,
      )
    : null
  const widestDrawn = cards
    .filter((c) => Number(getComputedStyle(c).opacity) > 0.5)
    .reduce((a, b) => Math.max(a, b.getBoundingClientRect().width), 0)

  return {
    flat: section.classList.contains('surf--flat'),
    trackX: track
      ? new DOMMatrix(getComputedStyle(track).transform).m41.toFixed(1)
      : null,
    frontIndex: front ? front.querySelector('.surf__index').textContent : null,
    frontCentre: front
      ? (() => {
          const r = front.getBoundingClientRect()
          return [
            Math.round(r.left + r.width / 2),
            Math.round(r.top + r.height / 2),
          ]
        })()
      : null,
    frontWidth: front ? Math.round(front.getBoundingClientRect().width) : null,
    widestDrawn: Math.round(widestDrawn),
    titleLines: document.querySelectorAll('.surf__title span').length,
    loaded: [
      ...document.querySelectorAll('.surf__card img, .surf__railItem img'),
    ].filter((i) => i.naturalWidth > 0).length,
    imgs: document.querySelectorAll('.surf__card img, .surf__railItem img')
      .length,
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
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => failed.push(r.url()))
  await page.setViewport({ width, height })
  if (reduced)
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 700))

  const box = await page.evaluate(() => {
    const r = document.querySelector('.surf').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.25, 0.6, 1, 1.2, 0.4] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top +
        Math.min(1, t) * Math.max(0, box.height - height) +
        (t > 1 ? 400 : 0),
    )
    await new Promise((r) => setTimeout(r, 1100))
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
