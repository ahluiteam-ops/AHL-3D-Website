/* Check for the footer — outlined wordmark, looping marquee, link columns.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-footer.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-footer'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const foot = document.querySelector('.foot')
  const mark = document.querySelector('.foot__wordmark span')
  const marquee = document.querySelector('.foot__marquee')
  const tracks = [...document.querySelectorAll('.foot__marqueeTrack')]
  const round = (n) => Math.round(n)
  const ms = getComputedStyle(mark)
  const mq = getComputedStyle(marquee)
  const m = new DOMMatrix(mq.transform)
  return {
    /* Stroked, then filled in the footer's own ground on top. The fill is
       what hides Inter's overlapping contours in A and e; without it those two
       letters draw extra rectangles that no other letter has. */
    wordmark: [
      mark.textContent.trim(),
      ms.color,
      ms.webkitTextStrokeWidth || ms.getPropertyValue('-webkit-text-stroke-width'),
      ms.paintOrder,
      getComputedStyle(foot).backgroundColor,
    ],
    /* It has to be wider than the viewport — the crop is the effect. */
    wordmarkWidth: round(mark.getBoundingClientRect().width),
    viewport: window.innerWidth,
    /* Two identical copies; the second is hidden from the accessibility tree
       so the phrases are not announced twice. */
    trackCount: tracks.length,
    trackTexts: tracks.map((t) => t.textContent.replace(/\s+/g, ' ').trim().length),
    secondHidden: tracks[1]?.getAttribute('aria-hidden'),
    marqueeAnimation: [mq.animationName, mq.animationDuration, mq.animationPlayState],
    marqueeX: round(m.m41),
    phrases: [...tracks[0].querySelectorAll('li')].map((li) =>
      li.firstChild.textContent.trim(),
    ),
    columns: [...document.querySelectorAll('.foot__col h2')].map((h) =>
      h.textContent.trim(),
    ),
    linkCounts: [...document.querySelectorAll('.foot__col')].map(
      (c) => c.querySelectorAll('a').length,
    ),
    socials: [...document.querySelectorAll('.foot__socials a')].map((a) =>
      a.getAttribute('aria-label'),
    ),
    contact: [...document.querySelectorAll('.foot__col--contact a')].map(
      (a) => a.getAttribute('href'),
    ),
    logo: (() => {
      const i = document.querySelector('.foot__logo')
      return `${i.naturalWidth}x${i.naturalHeight}`
    })(),
    legal: document.querySelector('.foot__legal p').textContent.trim(),
    topButton: !!document.querySelector('.foot__top'),
    /* The wordmark overflows on purpose, so the page must not. */
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
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise((r) => setTimeout(r, 1400))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)
  const a = await page.evaluate(probe)
  console.log('at rest', JSON.stringify(a))
  await page.screenshot({ path: `${outDir}/${tag}.png` })

  // The loop is running (or, under reduced motion, deliberately is not).
  await new Promise((r) => setTimeout(r, 1600))
  const b = await page.evaluate(probe)
  console.log('marqueeX moved', a.marqueeX, '->', b.marqueeX)

  // Back to top has to actually go there.
  await page.evaluate(() => document.querySelector('.foot__top').click())
  await new Promise((r) => setTimeout(r, 1600))
  console.log('scrollY after top button', await page.evaluate(() => Math.round(scrollY)))

  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
