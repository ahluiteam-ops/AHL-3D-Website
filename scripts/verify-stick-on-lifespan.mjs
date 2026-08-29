/* Verify the Stick-On System Lifespan page and its shared Systems section.
 * Run against a dev or preview server:
 *   VERIFY_URL=http://127.0.0.1:4173 node scripts/verify-stick-on-lifespan.mjs
 */
import puppeteer from 'puppeteer-core'

const base = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173'
const url = `${base.replace(/\/$/, '')}/#/stick-on-lifespan`
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, label) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.setViewport({ width, height })
  if (reduced) {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  }
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await new Promise((resolve) => setTimeout(resolve, 800))

  const section = await page.evaluate(() => {
    const systems = document.querySelector('.systems')
    if (!systems) return null
    const rect = systems.getBoundingClientRect()
    return {
      top: rect.top + scrollY,
      height: rect.height,
    }
  })
  if (!section) throw new Error(`${label}: Systems section missing`)

  await page.evaluate((top) => window.scrollTo(0, top), section.top)
  await new Promise((resolve) => setTimeout(resolve, 700))
  const startTransform = await page.$eval(
    '.cgal__ring',
    (ring) => getComputedStyle(ring).transform,
  ).catch(() => null)

  await page.evaluate(
    ({ top, height, viewport }) =>
      window.scrollTo(0, top + Math.max(0, height - viewport)),
    { ...section, viewport: height },
  )
  await new Promise((resolve) => setTimeout(resolve, 900))

  const result = await page.evaluate(() => {
    const systems = document.querySelector('.systems')
    const ring = document.querySelector('.cgal__ring')
    return {
      order: [...document.querySelectorAll('main > section')].map((node) =>
        node.className.split(' ')[0],
      ),
      heading: document.querySelector('.systems__title')?.textContent?.trim(),
      headingLines: document.querySelectorAll('.systems__title > span').length,
      cards: document.querySelectorAll('.cgal__card').length,
      images: document.querySelectorAll('.cgal__card img').length,
      still: systems?.classList.contains('systems--still'),
      ringTransform: ring ? getComputedStyle(ring).transform : null,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
    }
  })

  const expectedStill = reduced || width <= 900
  if (result.h1 !== 1) throw new Error(`${label}: expected one h1`)
  const expectedOrder = [
    'guideHero',
    'balance',
    'baseOptions',
    'carExample',
    'compare',
    'baseChoice',
    'systems',
    'form',
  ]
  if (result.order.join('|') !== expectedOrder.join('|')) {
    throw new Error(`${label}: wrong section order ${result.order.join(' > ')}`)
  }
  if (result.heading !== "World's Finest Thinnest Hair Systems") {
    throw new Error(`${label}: unexpected Systems heading`)
  }
  if (result.headingLines !== 2 || result.cards !== 13 || result.images !== 13) {
    throw new Error(`${label}: incomplete Systems content`)
  }
  if (result.still !== expectedStill) {
    throw new Error(`${label}: wrong responsive/reduced-motion mode`)
  }
  if (!expectedStill && startTransform === result.ringTransform) {
    throw new Error(`${label}: ring did not rotate with section scroll`)
  }
  if (result.overflow !== 0) throw new Error(`${label}: horizontal overflow`)
  if (errors.length || failed.length) {
    throw new Error(`${label}: browser errors or failed requests`)
  }

  console.log(label, result)
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(844, 390, false, 'landscape')
await run(1440, 900, true, 'reduced')
await browser.close()
