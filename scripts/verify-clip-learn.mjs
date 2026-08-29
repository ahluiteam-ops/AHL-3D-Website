/* Clip-On Hair System cross-link card.
 *   node scripts/verify-clip-learn.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/clip-on-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-clip-learn'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, tag) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))
  await page.setViewport({ width, height, isMobile: width <= 820, hasTouch: width <= 820 })
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })

  await page.evaluate(() => document.querySelector('.learnSo')?.scrollIntoView())
  await new Promise((resolve) => setTimeout(resolve, 900))

  const metrics = await page.evaluate(() => {
    const section = document.querySelector('.learnSo')
    const card = section?.querySelector('.learnSo__card')
    const body = section?.querySelector('.learnSo__body')
    const art = section?.querySelector('.learnSo__art')
    const image = section?.querySelector('.learnSo__photo')
    if (!(section && card && body && art && image instanceof HTMLImageElement)) return null
    return {
      cardHeight: Math.round(card.getBoundingClientRect().height),
      bodyFont: parseFloat(getComputedStyle(body).fontSize),
      bodyWidth: Math.round(body.getBoundingClientRect().width),
      artHeight: Math.round(art.getBoundingClientRect().height),
      imageWidth: Math.round(image.getBoundingClientRect().width),
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      complete: image.complete,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  if (!metrics) throw new Error(`${tag}: learnSo section is missing`)
  if (!metrics.complete || metrics.naturalWidth !== 2808 || metrics.naturalHeight !== 2332)
    throw new Error(`${tag}: replacement image did not load at 2808x2332`)
  if (metrics.overflow !== 0) throw new Error(`${tag}: ${metrics.overflow}px horizontal overflow`)
  if (errors.length || failed.length)
    throw new Error(`${tag}: ${errors.length} console errors, ${failed.length} failed requests`)

  console.log(tag, `${width}x${height}`, metrics)
  await page.screenshot({ path: `${out}/clip-learn-${tag}.png` })
  await page.close()
}

await run(1440, 900, 'desktop')
await run(390, 844, 'mobile')
await browser.close()
