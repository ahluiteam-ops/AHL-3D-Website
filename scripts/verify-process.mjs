/* Check for "The Step-By-Step Process To Natural Hair".
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-process.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-process'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const probe = () => {
  const section = document.querySelector('.process')
  const steps = [...document.querySelectorAll('.process__step')]
  const round = (n) => Math.round(n)
  const scaleX = (el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform)
    return Number(m.a.toFixed(2))
  }
  return {
    still: section.classList.contains('process--still'),
    /* The steps arrive one at a time: these three must climb 0 → 1 in turn. */
    copyOpacity: steps.map((s) =>
      Number(getComputedStyle(s.querySelector('.process__copy')).opacity).toFixed(2),
    ),
    ruleScale: steps.map((s) => scaleX(s.querySelector('.process__line i'))),
    markOpacity: [...document.querySelectorAll('.process__mark')].map((m) =>
      Number(getComputedStyle(m).opacity).toFixed(2),
    ),
    titleTop: round(document.querySelector('.process__title').getBoundingClientRect().top),
    stage: (() => {
      const r = document.querySelector('.process__pin').getBoundingClientRect()
      return [round(r.width), round(r.height)]
    })(),
    mediaBox: (() => {
      const r = document.querySelector('.process__media').getBoundingClientRect()
      return [round(r.width), round(r.height)]
    })(),
    posterLoaded: (() => {
      const i = document.querySelector('.process__media img')
      return `${i.naturalWidth}x${i.naturalHeight}`
    })(),
    stageBg: getComputedStyle(document.querySelector('.process')).backgroundColor,
    ctaText: document.querySelector('.process__cta').textContent.trim(),
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
    const r = document.querySelector('.process').getBoundingClientRect()
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
