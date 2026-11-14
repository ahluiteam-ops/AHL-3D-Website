/* Verify the About Us route.
 *   node scripts/verify-about.mjs [outDir]
 */
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/about-us'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-about'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, label, reducedMotion = false) {
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))
  await page.setViewport({ width, height, isMobile: width <= 700, hasTouch: width <= 700 })
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  process.stdout.write(`${label}: loaded\n`)

  await page.evaluate(async () => {
    const sections = [...document.querySelectorAll('.aboutPage > section')]
    for (const section of sections) {
      section.scrollIntoView({ block: 'center' })
      await new Promise((resolve) => setTimeout(resolve, 180))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 650))
    await Promise.race([
      Promise.all([...document.images].filter((image) => image.complete).map((image) => image.decode().catch(() => undefined))),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ])
  })

  const result = await page.evaluate(() => {
    const rects = (selector) => [...document.querySelectorAll(selector)].map((element) => {
      const rect = element.getBoundingClientRect()
      return { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) }
    })
    const imageInfo = (selector) => {
      const image = document.querySelector(selector)
      return image ? { src: new URL(image.currentSrc, location.href).pathname, width: image.naturalWidth, height: image.naturalHeight } : null
    }
    const aboutNav = [...document.querySelectorAll('.nav a')].find((item) => item.textContent?.trim() === 'About us')
    const aboutFooter = [...document.querySelectorAll('.foot a')].find((item) => item.textContent?.trim() === 'About us')
    const storyCard = document.querySelector('.aboutStory__card')?.getBoundingClientRect()
    const storyImage = document.querySelector('.aboutStory__card img')?.getBoundingClientRect()
    const careerSection = document.querySelector('.aboutPage > .stillConfused')
    const careerCta = careerSection?.querySelector('a')
    const careerWords = [...(careerSection?.querySelectorAll('.stillConfused__word') ?? [])]
    return {
      h1: document.querySelectorAll('.aboutPage h1').length,
      title: document.querySelector('.aboutPage h1')?.textContent?.replace(/\s+/g, ' ').trim(),
      sections: document.querySelectorAll('.aboutPage > section').length,
      stats: document.querySelectorAll('.aboutStats__card').length,
      statRects: rects('.aboutStats__card'),
      customImages: [
        imageInfo('.aboutHero__media img'),
        imageInfo('.aboutStory__card img'),
        imageInfo('.aboutFeature:not(.aboutFeature--founder) img'),
        imageInfo('.aboutFeature--founder img'),
      ],
      storyFit: storyCard && storyImage ? {
        widthDelta: Math.abs(storyCard.width - storyImage.width),
        heightDelta: Math.abs(storyCard.height - storyImage.height),
      } : null,
      brokenImages: [...document.querySelectorAll('.aboutHero img, .aboutStory img, .aboutFeature img, .aboutCta img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      navHref: aboutNav?.getAttribute('href'),
      navCurrent: aboutNav?.getAttribute('aria-current'),
      footerHref: aboutFooter?.getAttribute('href'),
      sectionBackgrounds: {
        achievements: getComputedStyle(document.querySelector('.aboutPage > .work')).backgroundColor,
        backed: getComputedStyle(document.querySelector('.aboutPage > .backed')).backgroundColor,
        journey: getComputedStyle(document.querySelector('.aboutCta')).backgroundColor,
      },
      consultationLinks: [...document.querySelectorAll('.aboutPage a[href^="tel:"]')].map((link) => ({
        href: link.getAttribute('href'), height: link.getBoundingClientRect().height,
      })),
      career: careerSection ? {
        background: getComputedStyle(careerSection).backgroundColor,
        title: careerSection.querySelector('h2')?.getAttribute('aria-label'),
        eyebrow: careerSection.querySelector('.stillConfused__eyebrow')?.textContent?.trim(),
        href: careerCta?.getAttribute('href'),
        ctaHeight: careerCta?.getBoundingClientRect().height,
        ctaOpacity: getComputedStyle(careerSection.querySelector('.stillConfused__ctaWrap')).opacity,
        lastWordOpacity: careerWords.length ? getComputedStyle(careerWords.at(-1)).opacity : null,
        words: careerWords.length,
        capsule: Boolean(careerSection.querySelector('.stillConfused__capsule')),
        isStatic: careerSection.classList.contains('is-static'),
        contentOverflow: Math.max(0, careerSection.scrollWidth - careerSection.clientWidth),
      } : null,
      revealed: (() => {
        const item = document.querySelector('[data-about-reveal]')
        return item ? { opacity: getComputedStyle(item).opacity, visibility: getComputedStyle(item).visibility } : null
      })(),
    }
  })

  const mobileImages = width <= 700
  const expectedImages = [
    ['/about/team-hero.webp', 1600, 900],
    ['/about/our-story.webp', 1600, 834],
    mobileImages ? ['/about/mission-mobile.webp', 900, 1124] : ['/about/mission.webp', 1600, 900],
    mobileImages ? ['/about/founder-mobile.webp', 900, 1858] : ['/about/founder.webp', 1600, 1195],
  ]
  if (result.h1 !== 1 || result.title !== 'At American Hairline, We Solve Your Hair Loss Worries') {
    throw new Error(`${label}: heading mismatch ${JSON.stringify(result)}`)
  }
  if (result.sections !== 11 || result.stats !== 4) {
    throw new Error(`${label}: section/card count mismatch ${JSON.stringify(result)}`)
  }
  if (result.overflow !== 0 || result.brokenImages.length) {
    throw new Error(`${label}: overflow/image mismatch ${JSON.stringify({ overflow: result.overflow, broken: result.brokenImages })}`)
  }
  if (result.navHref !== '#/about-us' || result.navCurrent !== 'page' || result.footerHref !== '#/about-us') {
    throw new Error(`${label}: About route mismatch ${JSON.stringify({ nav: result.navHref, current: result.navCurrent, footer: result.footerHref })}`)
  }
  if (result.consultationLinks.length !== 2 || result.consultationLinks.some((link) => link.href !== 'tel:+919222666111' || link.height < 44)) {
    throw new Error(`${label}: consultation CTA mismatch ${JSON.stringify(result.consultationLinks)}`)
  }
  if (Object.values(result.sectionBackgrounds).some((color) => color !== 'rgb(243, 245, 247)')) {
    throw new Error(`${label}: About section backgrounds mismatch ${JSON.stringify(result.sectionBackgrounds)}`)
  }
  if (!result.career || result.career.background !== 'rgb(8, 9, 12)'
    || result.career.title !== 'Open Positions. Build The Future With Us.'
    || result.career.eyebrow !== 'Careers'
    || result.career.href !== '#/team'
    || result.career.ctaHeight < 44 || result.career.words !== 7 || !result.career.capsule
    || result.career.ctaOpacity !== '1' || result.career.lastWordOpacity !== '1'
    || result.career.isStatic !== reducedMotion || result.career.contentOverflow !== 0) {
    throw new Error(`${label}: careers stage mismatch ${JSON.stringify(result.career)}`)
  }
  result.customImages.forEach((image, index) => {
    const expected = expectedImages[index]
    if (!image || image.src !== expected[0] || image.width !== expected[1] || image.height !== expected[2]) {
      throw new Error(`${label}: custom image ${index} mismatch ${JSON.stringify(image)}`)
    }
  })
  if (!result.storyFit || result.storyFit.widthDelta > 1 || result.storyFit.heightDelta > 1) {
    throw new Error(`${label}: Story image does not fill card ${JSON.stringify(result.storyFit)}`)
  }
  if (!result.revealed || result.revealed.opacity !== '1' || result.revealed.visibility !== 'visible') {
    throw new Error(`${label}: reveal did not settle ${JSON.stringify(result.revealed)}`)
  }
  if (new Set(result.statRects.map((rect) => rect.top)).size !== 2) {
    throw new Error(`${label}: stat grid should remain two rows ${JSON.stringify(result.statRects)}`)
  }
  if (errors.length || failed.length) {
    throw new Error(`${label}: browser failures ${JSON.stringify({ errors, failed })}`)
  }

  const hero = await page.$('.aboutHero')
  const story = await page.$('.aboutStory')
  const achievements = await page.$('.aboutPage > .work .work__pin')
  const backed = await page.$('.aboutPage > .backed')
  const mission = await page.$('.aboutFeature:not(.aboutFeature--founder)')
  const founder = await page.$('.aboutFeature--founder')
  const journey = await page.$('.aboutCta')
  const career = await page.$('.aboutPage > .stillConfused')
  await hero?.screenshot({ path: `${out}/about-${label}-hero.png` })
  await story?.screenshot({ path: `${out}/about-${label}-story.png` })
  await achievements?.screenshot({ path: `${out}/about-${label}-achievements.png` })
  await backed?.screenshot({ path: `${out}/about-${label}-backed.png` })
  await mission?.screenshot({ path: `${out}/about-${label}-mission.png` })
  await founder?.screenshot({ path: `${out}/about-${label}-founder.png` })
  await journey?.screenshot({ path: `${out}/about-${label}-journey.png` })
  await career?.screenshot({ path: `${out}/about-${label}-careers.png` })

  if (!reducedMotion) {
    await page.evaluate(() => {
      const section = document.querySelector('.aboutPage > .stillConfused')
      if (!section) return
      const top = section.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(0, section.getBoundingClientRect().height - innerHeight)
      window.scrollTo(0, top + (distance * 0.98))
    })
    await new Promise((resolve) => setTimeout(resolve, 900))
    await page.screenshot({ path: `${out}/about-${label}-careers-revealed.png` })
  }

  if (!reducedMotion) {
    await page.evaluate(() => document.querySelector('.aboutStory__card')?.click())
    await page.waitForFunction(() => document.querySelector('.aboutStoryDialog')?.open === true)
    const dialogState = await page.evaluate(() => {
      const dialog = document.querySelector('.aboutStoryDialog')
      const rect = dialog?.getBoundingClientRect()
      return {
        open: dialog?.open,
        bodyOverflow: document.body.style.overflow,
        images: document.querySelectorAll('.aboutStoryDialog img').length,
        closeHeight: document.querySelector('.aboutStoryDialog__close')?.getBoundingClientRect().height,
        centerXDelta: rect ? Math.abs(rect.left + (rect.width / 2) - (innerWidth / 2)) : null,
        centerYDelta: rect ? Math.abs(rect.top + (rect.height / 2) - (innerHeight / 2)) : null,
      }
    })
    if (!dialogState.open || dialogState.bodyOverflow !== 'hidden' || dialogState.images !== 2 || dialogState.closeHeight < 44
      || dialogState.centerXDelta === null || dialogState.centerXDelta > 1
      || dialogState.centerYDelta === null || dialogState.centerYDelta > 1) {
      throw new Error(`${label}: dialog open mismatch ${JSON.stringify(dialogState)}`)
    }
    await page.screenshot({ path: `${out}/about-${label}-story-dialog.png` })
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => document.querySelector('.aboutStoryDialog')?.open === false && document.body.style.overflow === '')
    const overflowAfter = await page.evaluate(() => document.body.style.overflow)
    if (overflowAfter !== '') throw new Error(`${label}: body scroll not restored ${overflowAfter}`)
  }

  process.stdout.write(`${label} ${JSON.stringify(result)}\n`)
  await page.close()
}

await run(1440, 900, 'desktop')
await run(1024, 900, 'tablet')
await run(390, 844, 'mobile')
await run(375, 812, 'small-mobile')
await run(844, 390, 'landscape')
await run(1440, 900, 'reduced', true)

await browser.close()
