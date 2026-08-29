/* Verify the SMP page.
 *   node scripts/verify-smp.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/smp'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-smp'
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
  await page.setViewport({ width, height, isMobile: width <= 760, hasTouch: width <= 760 })
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => { image.loading = 'eager' })
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)))
  })

  const result = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('.smpPage button, .smpPage a, .smpPage input, .smpPage select')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
    return {
      h1: document.querySelectorAll('.smpPage h1').length,
      sections: document.querySelectorAll('.smpPage > section').length,
      activeNav: document.querySelector('.nav__dropdownLink--active')?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      minControlHeight: Math.min(...controls.map((element) => element.getBoundingClientRect().height)),
      brokenImages: [...document.querySelectorAll('.smpPage img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      results: document.querySelectorAll('.smpResults__card').length,
      process: document.querySelectorAll('.smpProcess__card').length,
      processImages: [...document.querySelectorAll('.smpProcess__card')].map((card) => {
        const image = card.querySelector('img')
        const cardRect = card.getBoundingClientRect()
        const imageRect = image?.getBoundingClientRect()
        return imageRect ? {
          cardWidth: cardRect.width,
          imageWidth: imageRect.width,
          imageHeight: imageRect.height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        } : null
      }),
      treatments: document.querySelectorAll('.smpTreatments__tabs button').length,
      faq: document.querySelectorAll('.smpFaq__item').length,
      resultsArrows: document.querySelectorAll('.smpResults .smpRailControls button').length,
      processArrows: document.querySelectorAll('.smpProcess .smpRailControls button').length,
      processRailTabIndex: document.querySelector('.smpProcess__rail')?.tabIndex,
      resultsLayout: (() => {
        const section = document.querySelector('.smpResults')
        const pin = document.querySelector('.smpResults__pin')
        const rail = document.querySelector('.smpResults__rail')
        const track = document.querySelector('.smpResults__track')
        const card = document.querySelector('.smpResults__card')
        const image = card?.querySelector('img')
        if (!(section && pin && rail && track && card && image)) return null
        const pinRect = pin.getBoundingClientRect()
        const railRect = rail.getBoundingClientRect()
        const cardRect = card.getBoundingClientRect()
        const imageRect = image.getBoundingClientRect()
        return {
          pinned: section.classList.contains('is-pinned'),
          backgroundColor: getComputedStyle(section).backgroundColor,
          backgroundImage: getComputedStyle(section).backgroundImage,
          railScrollLeft: rail.scrollLeft,
          railScrollable: rail.scrollWidth > rail.clientWidth,
          railTabIndex: rail.tabIndex,
          bottomGap: pinRect.bottom - railRect.bottom,
          pinHeight: pinRect.height,
          scrollTravel: section.offsetHeight - pin.offsetHeight,
          trackDistance: track.scrollWidth - rail.clientWidth,
          cardWidth: cardRect.width,
          cardHeight: cardRect.height,
          imageWidth: imageRect.width,
          imageHeight: imageRect.height,
        }
      })(),
    }
  })

  if (result.h1 !== 1) throw new Error(`${label}: expected one h1`)
  if (result.sections !== 10) throw new Error(`${label}: expected 10 sections, got ${result.sections}`)
  if (result.activeNav !== 'SMP (Scalp Micropigmentation)') throw new Error(`${label}: SMP nav item is not active`)
  if (result.overflow !== 0) throw new Error(`${label}: ${result.overflow}px horizontal overflow`)
  if (result.minControlHeight < 44) throw new Error(`${label}: interactive target below 44px`)
  if (result.brokenImages.length) throw new Error(`${label}: broken images ${result.brokenImages.join(', ')}`)
  if (result.results !== 7 || result.process !== 4 || result.treatments !== 5 || result.faq !== 10) {
    throw new Error(`${label}: content count mismatch ${JSON.stringify(result)}`)
  }
  if (result.processImages.some((item) => !item ||
    Math.abs(item.cardWidth - item.imageWidth) > 1 ||
    Math.abs(item.imageWidth / item.imageHeight - item.naturalWidth / item.naturalHeight) > 0.01)) {
    throw new Error(`${label}: process images do not fit card width at source ratio ${JSON.stringify(result.processImages)}`)
  }
  const shouldPinResults = width >= 901 && !reducedMotion
  if (
    !result.resultsLayout ||
    result.resultsArrows !== 0 ||
    result.processArrows !== 0 ||
    result.processRailTabIndex !== 0 ||
    result.resultsLayout.pinned !== shouldPinResults ||
    result.resultsLayout.backgroundColor !== 'rgb(242, 244, 247)' ||
    result.resultsLayout.backgroundImage !== 'none' ||
    result.resultsLayout.railScrollLeft !== 0 ||
    !result.resultsLayout.railScrollable ||
    (!shouldPinResults && result.resultsLayout.railTabIndex !== 0) ||
    (shouldPinResults && Math.abs(result.resultsLayout.scrollTravel - result.resultsLayout.trackDistance) > 1) ||
    (shouldPinResults && (result.resultsLayout.bottomGap < 57 || result.resultsLayout.bottomGap > 59)) ||
    (width <= 900 && (result.resultsLayout.bottomGap < 47 || result.resultsLayout.bottomGap > 49)) ||
    Math.abs(result.resultsLayout.cardWidth / result.resultsLayout.cardHeight - 0.8) > 0.01 ||
    Math.abs(result.resultsLayout.imageWidth / result.resultsLayout.imageHeight - 0.8) > 0.01
  ) {
    throw new Error(`${label}: results rail geometry is incorrect ${JSON.stringify(result.resultsLayout)}`)
  }

  if (!label.includes('landscape') && !reducedMotion) {
    await page.$eval('.smpResults', (element) => element.scrollIntoView({ block: 'start' }))
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${out}/smp-${label}-results.png` })
  }

  if (shouldPinResults) {
    const scrollMotion = await page.evaluate(async () => {
      const section = document.querySelector('.smpResults')
      const pin = document.querySelector('.smpResults__pin')
      const rail = document.querySelector('.smpResults__rail')
      const track = document.querySelector('.smpResults__track')
      if (!(section && pin && rail && track)) return null
      const sectionTop = section.offsetTop
      const travel = section.offsetHeight - pin.offsetHeight
      window.scrollTo(0, sectionTop)
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const start = track.getBoundingClientRect().left
      window.scrollTo(0, sectionTop + travel / 2)
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const middle = track.getBoundingClientRect().left
      window.scrollTo(0, sectionTop + travel)
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const end = track.getBoundingClientRect().left
      const pinTop = pin.getBoundingClientRect().top
      return { start, middle, end, pinTop, expected: track.scrollWidth - rail.clientWidth }
    })
    if (
      !scrollMotion ||
      Math.abs(scrollMotion.pinTop) > 1 ||
      scrollMotion.start - scrollMotion.middle < scrollMotion.expected * 0.4 ||
      scrollMotion.start - scrollMotion.end < scrollMotion.expected * 0.9
    ) {
      throw new Error(`${label}: vertical scroll did not drive results track ${JSON.stringify(scrollMotion)}`)
    }
    if (!label.includes('landscape')) {
      await page.screenshot({ path: `${out}/smp-${label}-results-end.png` })
    }
  }

  await page.click('.smpAbout__card')
  const modal = await page.evaluate(() => ({
    open: Boolean(document.querySelector('.smpModal [role="dialog"]')),
    locked: getComputedStyle(document.body).overflow === 'hidden',
    focused: document.activeElement?.classList.contains('smpModal__close') ?? false,
  }))
  if (!modal.open || !modal.locked || !modal.focused) throw new Error(`${label}: modal contract failed`)
  if (!label.includes('landscape') && !reducedMotion) {
    await page.screenshot({ path: `${out}/smp-${label}-about-modal.png` })
  }
  await page.keyboard.press('Escape')
  await page.waitForSelector('.smpModal', { hidden: true })

  await page.click('#smp-tab-full-head')
  const selected = await page.$eval('#smp-tab-full-head', (button) => button.getAttribute('aria-selected'))
  if (selected !== 'true') throw new Error(`${label}: treatment tab did not change`)
  await page.click('.smpFaq__item:nth-child(2) button')
  const expanded = await page.$eval('.smpFaq__item:nth-child(2) button', (button) => button.getAttribute('aria-expanded'))
  if (expanded !== 'true') throw new Error(`${label}: FAQ did not expand`)

  if (!label.includes('landscape')) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${out}/smp-${label}-hero.png` })
    await page.$eval('.smpProcess', (element) => element.scrollIntoView({ block: 'start' }))
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${out}/smp-${label}-process.png` })
    await page.$eval('.smpTreatments', (element) => element.scrollIntoView({ block: 'start' }))
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${out}/smp-${label}-treatments.png` })
    await page.$eval('.smpFaq', (element) => element.scrollIntoView({ block: 'start' }))
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${out}/smp-${label}-faq.png` })
  }

  if (errors.length || failed.length) throw new Error(`${label}: ${errors.length} console errors, ${failed.length} failed requests`)
  console.log(label, result)
  await page.close()
}

await run(1440, 900, 'desktop')
await run(1024, 900, 'reference')
await run(390, 844, 'mobile')
await run(844, 390, 'landscape')
await run(390, 844, 'reduced-motion', true)
await browser.close()
