/* Verify page-scoped product-section backgrounds.
 *   node scripts/verify-product-section-backgrounds.mjs
 */
import puppeteer from 'puppeteer-core'

const BASE = process.env.VERIFY_BASE ?? 'http://127.0.0.1:5173'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const grey = 'rgb(244, 245, 248)'
const white = 'rgb(255, 255, 255)'

const routes = [
  {
    route: 'stick-on-hair-system',
    mainClass: 'stickPage',
    expected: { '.work': grey, '.truth': grey },
  },
  {
    route: 'clip-on-hair-system',
    mainClass: 'clipSystemPage',
    expected: {
      '.backed': grey,
      '.zyconRange': grey,
      '.compare': white,
    },
  },
]

const viewports = [
  { width: 1440, height: 900, label: 'desktop' },
  { width: 390, height: 844, label: 'mobile' },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

try {
  for (const config of routes) {
    for (const viewport of viewports) {
      const page = await browser.newPage()
      const errors = []
      const failed = []
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      page.on('pageerror', (error) => errors.push(String(error)))
      page.on('requestfailed', (request) => failed.push(request.url()))

      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        isMobile: viewport.width <= 800,
        hasTouch: viewport.width <= 800,
      })
      await page.goto(`${BASE}/#/${config.route}`, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      })

      const result = await page.evaluate((selectors) => {
        const backgrounds = Object.fromEntries(
          selectors.map((selector) => {
            const section = document.querySelector(selector)
            return [selector, section ? getComputedStyle(section).backgroundColor : null]
          }),
        )
        return {
          mainClass: document.querySelector('main')?.className ?? '',
          backgrounds,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }
      }, Object.keys(config.expected))

      if (result.mainClass !== config.mainClass) {
        throw new Error(`${config.route}/${viewport.label}: wrong main class ${result.mainClass}`)
      }
      for (const [selector, expected] of Object.entries(config.expected)) {
        if (result.backgrounds[selector] !== expected) {
          throw new Error(
            `${config.route}/${viewport.label}: ${selector} is ${result.backgrounds[selector]}, expected ${expected}`,
          )
        }
      }
      if (result.overflow !== 0) {
        throw new Error(`${config.route}/${viewport.label}: ${result.overflow}px horizontal overflow`)
      }
      if (errors.length || failed.length) {
        throw new Error(
          `${config.route}/${viewport.label}: errors=${JSON.stringify(errors)} failed=${JSON.stringify(failed)}`,
        )
      }

      console.log(`${config.route}/${viewport.label}:`, result.backgrounds)
      await page.close()
    }
  }
} finally {
  await browser.close()
}

console.log('Product section background verification passed.')
