/* Check for "Before And After, In Their Own Words" — the CardStack deck.
 * Scroll opens the hand; clicking a card centres it. Both are checked here.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-deck.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-deck'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.deck')
  const cards = [...document.querySelectorAll('.cstack__card')]
  const imgs = [...document.querySelectorAll('.deck__art')]
  const round = (n) => Math.round(n)
  const angle = (el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform)
    return Number(((Math.atan2(m.b, m.a) * 180) / Math.PI).toFixed(1))
  }
  const activeEl = cards.find((c) => Math.abs(angle(c)) < 0.5)
  const stage = document.querySelector('.cstack__stage').getBoundingClientRect()
  return {
    still: section.classList.contains('deck--still'),
    mounted: cards.length,
    angles: cards.map(angle),
    /* The fan's painted width is what "open" means. */
    span: (() => {
      const rects = cards.map((c) => c.getBoundingClientRect())
      if (!rects.length) return 0
      return round(
        Math.max(...rects.map((r) => r.right)) - Math.min(...rects.map((r) => r.left)),
      )
    })(),
    /* The active card is the unturned one, and it must sit on the centre line. */
    activeSize: activeEl
      ? [
          round(activeEl.getBoundingClientRect().width),
          round(activeEl.getBoundingClientRect().height),
        ]
      : null,
    activeCentre: activeEl
      ? round(
          activeEl.getBoundingClientRect().left +
            activeEl.getBoundingClientRect().width / 2,
        )
      : null,
    activeAlt: activeEl ? activeEl.querySelector('img')?.alt.slice(0, 24) : null,
    /* Everything under the deck was removed on request. */
    dots: document.querySelectorAll('.cstack__dot').length,
    follow: document.querySelectorAll('.deck__follow').length,
    /* The fan must stay inside the section it belongs to. */
    lowestCardVsStage: (() => {
      const rects = cards.map((c) => c.getBoundingClientRect())
      if (!rects.length) return null
      return round(Math.max(...rects.map((r) => r.bottom)) - stage.bottom)
    })(),
    titleTop: round(document.querySelector('.deck__title').getBoundingClientRect().top),
    headToCard: (() => {
      const h = document.querySelector('.deck__title').getBoundingClientRect().bottom
      const rects = cards.map((c) => c.getBoundingClientRect())
      if (!rects.length) return null
      return round(Math.min(...rects.map((r) => r.top)) - h)
    })(),
    loaded: imgs.map((i) => `${i.naturalWidth}x${i.naturalHeight}`),
    altLengths: imgs.map((i) => i.alt.length),
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
    const r = document.querySelector('.deck').getBoundingClientRect()
    return { top: r.top + scrollY, height: r.height }
  })

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  console.log('section height', Math.round(box.height))

  const steps = box.height > height ? [0, 0.35, 0.7, 1] : [0]
  for (const t of steps) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top + t * Math.max(0, box.height - height),
    )
    await new Promise((r) => setTimeout(r, 1500))
    console.log(t, JSON.stringify(await page.evaluate(probe)))
    await page.screenshot({ path: `${outDir}/${tag}-${t}.png` })
  }

  // Clicking a card centres it — the half of the component that was kept.
  const before = await page.evaluate(probe)
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.cstack__card')]
    const outer = cards[0]
    outer.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await new Promise((r) => setTimeout(r, 1500))
  const after = await page.evaluate(probe)
  console.log('click outer card:', JSON.stringify({
    activeAltBefore: before.activeAlt,
    activeAltAfter: after.activeAlt,
    activeCentre: after.activeCentre,
  }))
  await page.screenshot({ path: `${outDir}/${tag}-click.png` })

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
