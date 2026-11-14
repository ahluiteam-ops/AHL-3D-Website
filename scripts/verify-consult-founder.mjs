/* Verify the Consult with Founder route.
 *   node scripts/verify-consult-founder.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/consult-with-founder'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-consult-founder'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, label, reducedMotion = false) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.setViewport({ width, height, isMobile: width <= 700, hasTouch: width <= 700 })
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.68) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 90))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 850))
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)))
  })

  const result = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('.consultFounder a')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
    const rects = (selector) => [...document.querySelectorAll(selector)].map((element) => {
      const rect = element.getBoundingClientRect()
      return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    })
    const founderImage = document.querySelector('.cfFounder__media img')
    const processLine = document.querySelector('.cfSteps__line')
    const firstAnimated = document.querySelector('[data-cf-reveal]')
    return {
      h1: document.querySelectorAll('.consultFounder h1').length,
      title: document.querySelector('.consultFounder h1')?.textContent?.replace(/\s+/g, ' ').trim(),
      sections: document.querySelectorAll('.consultFounder > section').length,
      decisionCards: document.querySelectorAll('.cfDecision__card').length,
      audienceCards: document.querySelectorAll('.cfAudience__card').length,
      outcomes: document.querySelectorAll('.cfOutcomes__grid > li').length,
      founderPoints: document.querySelectorAll('.cfFounder__copy li').length,
      valueCards: document.querySelectorAll('.cfValue__card').length,
      steps: document.querySelectorAll('.cfStep').length,
      bookingLinks: [...document.querySelectorAll('.cfButton')].map((link) => ({
        label: link.textContent?.trim(),
        href: link.getAttribute('href'),
        height: link.getBoundingClientRect().height,
      })),
      footerFounder: (() => {
        const link = [...document.querySelectorAll('.foot__col a')]
          .find((item) => item.textContent?.trim() === 'Consult with Founder')
        return link?.getAttribute('href')
      })(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      minControlHeight: Math.min(...controls.map((element) => element.getBoundingClientRect().height)),
      brokenImages: [...document.querySelectorAll('.consultFounder img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      founderImage: founderImage ? {
        src: founderImage.getAttribute('src'),
        naturalWidth: founderImage.naturalWidth,
        naturalHeight: founderImage.naturalHeight,
        objectFit: getComputedStyle(founderImage).objectFit,
      } : null,
      decisionRects: rects('.cfDecision__card'),
      audienceRects: rects('.cfAudience__card'),
      outcomeRects: rects('.cfOutcomes__grid > li'),
      founderRects: rects('.cfFounder__grid > *'),
      valueRects: rects('.cfValue__card'),
      stepRects: rects('.cfStep'),
      processLine: processLine ? {
        width: processLine.getBoundingClientRect().width,
        height: processLine.getBoundingClientRect().height,
      } : null,
      animated: firstAnimated ? {
        opacity: getComputedStyle(firstAnimated).opacity,
        visibility: getComputedStyle(firstAnimated).visibility,
      } : null,
    }
  })

  if (result.h1 !== 1 || result.sections !== 8) {
    throw new Error(`${label}: page structure mismatch ${JSON.stringify(result)}`)
  }
  if (result.title !== 'Not Sure What Will Work For Your Hair? Speak Directly with the Founder.') {
    throw new Error(`${label}: hero title mismatch ${JSON.stringify(result.title)}`)
  }
  if (result.decisionCards !== 3 || result.audienceCards !== 2 || result.outcomes !== 5
    || result.founderPoints !== 3 || result.valueCards !== 2 || result.steps !== 4) {
    throw new Error(`${label}: section content count mismatch ${JSON.stringify(result)}`)
  }
  if (result.bookingLinks.length !== 2 || result.bookingLinks.some((link) =>
    link.href !== 'tel:+919222666111' || link.height < 48
  )) {
    throw new Error(`${label}: booking CTA mismatch ${JSON.stringify(result.bookingLinks)}`)
  }
  if (result.footerFounder !== '#/consult-with-founder') {
    throw new Error(`${label}: footer route mismatch ${JSON.stringify(result.footerFounder)}`)
  }
  if (result.overflow !== 0 || result.minControlHeight < 44) {
    throw new Error(`${label}: responsive overflow/control mismatch ${JSON.stringify({ overflow: result.overflow, minControlHeight: result.minControlHeight })}`)
  }
  if (result.brokenImages.length || !result.founderImage
    || result.founderImage.src !== '/consult-founder.png'
    || result.founderImage.naturalWidth !== 1400
    || result.founderImage.naturalHeight !== 1050
    || result.founderImage.objectFit !== 'cover') {
    throw new Error(`${label}: founder image mismatch ${JSON.stringify({ broken: result.brokenImages, image: result.founderImage })}`)
  }
  if (!result.animated || result.animated.opacity !== '1' || result.animated.visibility !== 'visible') {
    throw new Error(`${label}: revealed content did not settle ${JSON.stringify(result.animated)}`)
  }

  const sharesRow = (rectangles) => new Set(rectangles.map((rect) => Math.round(rect.top))).size === 1
  if (width > 900 && (!sharesRow(result.decisionRects) || !sharesRow(result.audienceRects)
    || !sharesRow(result.founderRects) || !sharesRow(result.valueRects) || !sharesRow(result.stepRects))) {
    throw new Error(`${label}: desktop grids changed ${JSON.stringify(result)}`)
  }
  if (width <= 700 && (sharesRow(result.decisionRects) || sharesRow(result.audienceRects)
    || sharesRow(result.outcomeRects) || sharesRow(result.founderRects)
    || sharesRow(result.valueRects) || sharesRow(result.stepRects))) {
    throw new Error(`${label}: mobile grids did not stack ${JSON.stringify(result)}`)
  }
  if (!result.processLine || (width > 700 && result.processLine.width <= result.processLine.height)
    || (width <= 700 && result.processLine.height <= result.processLine.width)) {
    throw new Error(`${label}: process connector direction mismatch ${JSON.stringify(result.processLine)}`)
  }
  if (errors.length) throw new Error(`${label}: console errors ${errors.join(' | ')}`)
  if (failed.length) throw new Error(`${label}: failed requests ${failed.join(' | ')}`)

  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((resolve) => setTimeout(resolve, 250))
  if (!reducedMotion) {
    await page.screenshot({ path: `${out}/consult-founder-${label}-full.png`, fullPage: true })
    for (const section of ['cfHero', 'cfDecision', 'cfFounder', 'cfProcess', 'cfFinal']) {
      const element = await page.$(`.${section}`)
      await element?.screenshot({ path: `${out}/consult-founder-${label}-${section}.png` })
    }
  }

  console.log(label, JSON.stringify(result))
  await page.close()
}

await run(1440, 900, 'desktop')
await run(1024, 900, 'tablet')
await run(768, 900, 'small-tablet')
await run(390, 844, 'mobile')
await run(844, 390, 'landscape')
await run(1440, 900, 'reduced', true)

await browser.close()
