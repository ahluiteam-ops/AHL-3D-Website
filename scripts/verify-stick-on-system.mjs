/* Verify the standalone Stick-On Hair System page.
 *   node scripts/verify-stick-on-system.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/stick-on-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-stick-on-system'
mkdirSync(out, { recursive: true })

const expectedImages = [
  'hero.png',
  'local-fail.png',
  'consult-scalp.png',
  'consult-options.png',
  'consult-recommend.png',
  'consult-design.png',
  'natural-hairline-before-after.png',
  'zycon-gradient.png',
  'zycon-card.png',
  'learn-clip-on.png',
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, label) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.setViewport({ width, height, isMobile: width <= 800, hasTouch: width <= 800 })
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach((image) => (image.loading = 'eager'))
  })

  for (const selector of ['.stickHero', '.stickConsult', '.stickNatural', '.stickCompare', '.zyconRange', '.learnSo']) {
    await page.$eval(selector, (element) => element.scrollIntoView({ block: 'center' }))
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((resolve) => setTimeout(resolve, 500))

  const result = await page.evaluate((names) => {
    const images = [...document.querySelectorAll('img')]
    const supplied = Object.fromEntries(
      names.map((name) => {
        const image = images.find((item) => item.src.endsWith(`/stick-on-system/${name}`))
        return [name, image ? [image.naturalWidth, image.naturalHeight] : null]
      }),
    )
    const controls = [...document.querySelectorAll('.stickConsult__controls button, .stickFaq__item button, .zyconRange__open')]
      .filter((item) => item.getBoundingClientRect().width > 0)
    const sectionScale = (name) => {
      const section = document.querySelector(`.${name}`)
      const heading = section?.querySelector('h2')
      const grid = section?.querySelector(`.${name}__grid`)
      const card = section?.querySelector(`.${name}__card`)
      if (!(section && heading && grid && card)) return null
      const sectionStyle = getComputedStyle(section)
      const headingStyle = getComputedStyle(heading)
      const gridStyle = getComputedStyle(grid)
      const cardStyle = getComputedStyle(card)
      return {
        paddingTop: sectionStyle.paddingTop,
        headingSize: headingStyle.fontSize,
        headingMargin: headingStyle.marginBottom,
        gridWidth: Math.round(grid.getBoundingClientRect().width * 100) / 100,
        gridGap: gridStyle.columnGap,
        columns: gridStyle.gridTemplateColumns,
        cardPadding: cardStyle.paddingTop,
      }
    }
    return {
      h1: document.querySelectorAll('h1').length,
      sections: document.querySelectorAll('main > section').length,
      supplied,
      minControl: Math.min(...controls.map((item) => Math.min(item.getBoundingClientRect().width, item.getBoundingClientRect().height))),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      activeNav: document.querySelector('.nav__link--active, .nav__dropdownLink--active, .nav__submenuLink--active')?.textContent?.trim(),
      localPhoto: (() => {
        const image = document.querySelector('.stickLocal__photo')
        if (!(image instanceof HTMLImageElement)) return null
        const rect = image.getBoundingClientRect()
        return {
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
          fit: getComputedStyle(image).objectFit,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }
      })(),
      naturalPhoto: (() => {
        const image = document.querySelector('.stickNatural__photo')
        if (!(image instanceof HTMLImageElement)) return null
        const rect = image.getBoundingClientRect()
        return {
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
          fit: getComputedStyle(image).objectFit,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }
      })(),
      localScale: sectionScale('stickLocal'),
      naturalScale: sectionScale('stickNatural'),
      naturalLayout: (() => {
        const heading = document.querySelector('.stickNatural h2')
        const copy = document.querySelector('.stickNatural__copy')
        const photo = document.querySelector('.stickNatural__photo')
        if (!(heading && copy && photo)) return null
        const headingRect = heading.getBoundingClientRect()
        const copyRect = copy.getBoundingClientRect()
        const photoRect = photo.getBoundingClientRect()
        return {
          headingBottom: Math.round(headingRect.bottom * 100) / 100,
          copyTop: Math.round(copyRect.top * 100) / 100,
          copyBottom: Math.round(copyRect.bottom * 100) / 100,
          photoTop: Math.round(photoRect.top * 100) / 100,
          photoBottom: Math.round(photoRect.bottom * 100) / 100,
        }
      })(),
      comparisonLayout: (() => {
        const frame = document.querySelector('.stickCompare__scroll')
        const table = frame?.querySelector('table')
        const firstCell = table?.querySelector('tbody th')
        if (!(frame && table && firstCell)) return null
        const frameStyle = getComputedStyle(frame)
        const tableStyle = getComputedStyle(table)
        return {
          frameWidth: Math.round(frame.clientWidth * 100) / 100,
          scrollWidth: Math.round(frame.scrollWidth * 100) / 100,
          overflowX: frameStyle.overflowX,
          radius: frameStyle.borderRadius,
          minWidth: tableStyle.minWidth,
          tableLayout: tableStyle.tableLayout,
          firstCellAlign: getComputedStyle(firstCell).textAlign,
        }
      })(),
      consultationBackgrounds: [...document.querySelectorAll('.stickConsult__photo')]
        .map((image) => getComputedStyle(image).backgroundColor),
    }
  }, expectedImages)

  if (result.h1 !== 1) throw new Error(`${label}: expected one h1`)
  if (result.sections !== 16) throw new Error(`${label}: expected 16 sections, got ${result.sections}`)
  if (Object.values(result.supplied).some((dimensions) => !dimensions?.[0])) {
    throw new Error(`${label}: supplied image missing ${JSON.stringify(result.supplied)}`)
  }
  if (result.minControl < 44) throw new Error(`${label}: interactive target below 44px`)
  if (result.overflow !== 0) throw new Error(`${label}: ${result.overflow}px horizontal overflow`)
  if (
    !result.localPhoto ||
    result.localPhoto.fit !== 'contain' ||
    Math.abs(result.localPhoto.width / result.localPhoto.height - 4 / 3) > 0.01 ||
    result.localPhoto.naturalWidth / result.localPhoto.naturalHeight !== 4 / 3
  ) {
    throw new Error(`${label}: local-system image is not showing its complete 4:3 frame`)
  }
  if (
    !result.naturalPhoto ||
    result.naturalPhoto.fit !== 'contain' ||
    Math.abs(result.naturalPhoto.width / result.naturalPhoto.height - 4 / 3) > 0.01 ||
    result.naturalPhoto.naturalWidth / result.naturalPhoto.naturalHeight !== 4 / 3
  ) {
    throw new Error(`${label}: natural-hairline image is not showing its complete 4:3 frame`)
  }
  if (
    !result.localScale ||
    !result.naturalScale ||
    JSON.stringify(result.localScale) !== JSON.stringify(result.naturalScale)
  ) {
    throw new Error(`${label}: natural-hairline section scale does not match local-system section`)
  }
  if (!result.naturalLayout) {
    throw new Error(`${label}: natural-hairline layout could not be measured`)
  }
  if (width > 800) {
    if (
      Math.abs(result.naturalLayout.copyTop - result.naturalLayout.photoTop) > 1 ||
      Math.abs(result.naturalLayout.copyBottom - result.naturalLayout.photoBottom) > 1
    ) {
      throw new Error(`${label}: natural-hairline desktop columns do not share top and bottom edges`)
    }
  } else if (
    result.naturalLayout.photoTop <= result.naturalLayout.headingBottom ||
    result.naturalLayout.photoBottom > result.naturalLayout.copyTop
  ) {
    throw new Error(`${label}: natural-hairline mobile image is not directly below heading`)
  }
  if (
    result.consultationBackgrounds.length !== 4 ||
    result.consultationBackgrounds.some((color) => color !== 'rgba(0, 0, 0, 0)')
  ) {
    throw new Error(`${label}: consultation image background remains visible`)
  }
  if (!result.comparisonLayout) {
    throw new Error(`${label}: local-patch comparison layout could not be measured`)
  }
  if (width <= 800 && (
    result.comparisonLayout.scrollWidth > result.comparisonLayout.frameWidth + 1 ||
    result.comparisonLayout.overflowX !== 'hidden' ||
    result.comparisonLayout.minWidth !== '0px' ||
    result.comparisonLayout.tableLayout !== 'fixed' ||
    result.comparisonLayout.firstCellAlign !== 'left' ||
    result.comparisonLayout.radius === '0px'
  )) {
    throw new Error(`${label}: local-patch comparison still behaves like a horizontal slider`)
  }

  await page.$eval('.stickLocal', (element) => element.scrollIntoView({ block: 'center' }))
  await new Promise((resolve) => setTimeout(resolve, 350))
  await page.screenshot({ path: `${out}/stick-on-${label}-local-fail.png` })

  await page.$eval('.stickConsult', (element) => element.scrollIntoView({ block: 'start' }))
  await new Promise((resolve) => setTimeout(resolve, 350))
  await page.screenshot({ path: `${out}/stick-on-${label}-consultation.png` })

  await page.$eval('.stickNatural', (element) => element.scrollIntoView({ block: 'center' }))
  await new Promise((resolve) => setTimeout(resolve, 350))
  await page.screenshot({ path: `${out}/stick-on-${label}-natural-hairline.png` })

  await page.$eval('.stickCompare', (element) => element.scrollIntoView({ block: 'center' }))
  await new Promise((resolve) => setTimeout(resolve, 350))
  await page.screenshot({ path: `${out}/stick-on-${label}-local-comparison.png` })

  await page.$eval('.zyconRange', (element) => element.scrollIntoView({ block: 'center' }))
  await new Promise((resolve) => setTimeout(resolve, 500))
  await page.screenshot({ path: `${out}/stick-on-${label}-zycon.png` })

  await page.click('.zyconRange__open')
  await new Promise((resolve) => setTimeout(resolve, 450))
  const dialog = await page.evaluate(() => ({
    open: Boolean(document.querySelector('[role="dialog"]')),
    locked: getComputedStyle(document.documentElement).overflow === 'hidden',
    focused: document.activeElement?.classList.contains('zyconRange__close') ?? false,
    image: (() => {
      const image = document.querySelector('.zyconRange__sheetPhoto')
      return image instanceof HTMLImageElement ? [image.naturalWidth, image.naturalHeight] : null
    })(),
  }))
  if (!dialog.open || !dialog.locked || !dialog.focused || dialog.image?.[0] !== 1400) throw new Error(`${label}: Zycon dialog contract failed`)
  await page.screenshot({ path: `${out}/stick-on-${label}-overlay.png` })
  await page.keyboard.press('Escape')
  await new Promise((resolve) => setTimeout(resolve, 750))

  await page.$eval('.stickFaq', (element) => element.scrollIntoView({ block: 'start' }))
  await page.click('.stickFaq__item:nth-child(2) button')
  const faqExpanded = await page.$eval('.stickFaq__item:nth-child(2) button', (button) => button.getAttribute('aria-expanded'))
  if (faqExpanded !== 'true') throw new Error(`${label}: FAQ did not expand`)

  if (errors.length || failed.length) {
    throw new Error(`${label}: ${errors.length} console errors, ${failed.length} failed requests`)
  }
  console.log(label, result)
  await page.close()
}

await run(1440, 900, 'desktop')
await run(390, 844, 'mobile')
await browser.close()
