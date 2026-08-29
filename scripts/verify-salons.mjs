/* Check for "Walk Into Any Of Our Premium Salons" — the pinned horizontal rail.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-salons.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-salons'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.salons')
  const track = document.querySelector('.salons__track')
  const items = [...document.querySelectorAll('.salons__item')]
  const round = (n) => Math.round(n)
  const m = new DOMMatrix(getComputedStyle(track).transform)
  return {
    pinned: section.classList.contains('is-pinned'),
    /* The track's travel is the mechanism; `m41` is where it has got to. */
    trackX: round(m.m41),
    trackWidth: round(track.scrollWidth),
    cities: items.map((i) => i.querySelector('.salons__city').textContent.trim()),
    /* Every card's left edge, so the travel can be shown to move them. */
    cardLefts: items.map((i) => round(i.getBoundingClientRect().left)),
    cardSize: items[0]
      ? [round(items[0].getBoundingClientRect().width), round(items[0].getBoundingClientRect().height)]
      : null,
    loaded: [...document.querySelectorAll('.salons__media img')].map(
      (i) => `${i.naturalWidth}x${i.naturalHeight}`,
    ),
    /* Addresses must be the client's, and every card needs its own map link. */
    addressLengths: items.map((i) =>
      i.querySelector('.salons__address').textContent.trim().length,
    ),
    addressLines: items.map((i) => {
      const address = i.querySelector('.salons__address')
      const style = getComputedStyle(address)
      return Math.round(address.getBoundingClientRect().height / parseFloat(style.lineHeight))
    }),
    directions: [...document.querySelectorAll('.salons__direction')].map((a) => [
      a.textContent.trim(),
      a.getAttribute('target'),
      a.getAttribute('rel'),
      a.href.startsWith('https://maps.google.com/'),
    ]),
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
  await new Promise((r) => setTimeout(r, 900))

  const box = await page.evaluate(() => {
    const r = document.querySelector('.salons').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.5, 1] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1200))
    console.log(t, JSON.stringify(await page.evaluate(probe)))
    await page.screenshot({ path: `${outDir}/${tag}-${t}.png` })
  }

  // Past the end: the closing panel has to be on screen, not scrolled past.
  if (box.height > height) {
    const end = await page.evaluate(() => {
      const r = document.querySelector('.salons__outro').getBoundingClientRect()
      return [Math.round(r.left), Math.round(r.right), window.innerWidth]
    })
    console.log('closing panel [left, right, viewport]', JSON.stringify(end))
  }

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
