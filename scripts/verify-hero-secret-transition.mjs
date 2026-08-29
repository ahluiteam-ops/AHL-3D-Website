import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173'
const outputDir = process.env.VERIFY_OUTPUT ?? '.tmp-hero-secret-layers'

await mkdir(outputDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox'],
})

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 850))
}

async function scrollToProgress(page, selector, progress, endAtViewportEnd = true) {
  await page.evaluate(
    ({ selector, progress, endAtViewportEnd }) => {
      const section = document.querySelector(selector)
      const top = section.getBoundingClientRect().top + scrollY
      const travel = section.getBoundingClientRect().height - (endAtViewportEnd ? innerHeight : 0)
      window.scrollTo(0, top + Math.max(0, travel) * progress)
    },
    { selector, progress, endAtViewportEnd },
  )
  await settle()
}

async function readState(page) {
  return page.evaluate(() => {
    const video = document.querySelector('.heroSecret__film')
    const filmFrame = document.querySelector('.heroSecret__filmFrame')
    const filmMotion = document.querySelector('.heroSecret__filmMotion')
    const wordmark = document.querySelector('.wordmark')
    const title = document.querySelector('.secret__title')
    const titleWords = [...document.querySelectorAll('.secret__titleWord')]
    const benefits = document.querySelector('.secret__benefits')
    const closing = document.querySelector('.secret__closing')
    const badge = document.querySelector('.wordmark__badgeMark')
    const visible = (element) => {
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.01 && rect.width > 0 && rect.height > 0
    }
    return {
      time: Number(video.currentTime.toFixed(3)),
      duration: Number(video.duration.toFixed(3)),
      paused: video.paused,
      loop: video.loop,
      filmCount: document.querySelectorAll('.heroSecret video').length,
      handoffCount: document.querySelectorAll('.heroHandoff').length,
      filmPosition: getComputedStyle(document.querySelector('.heroSecret__filmFrame')).position,
      filmOpacity: Number(getComputedStyle(video).opacity),
      filmMotionTransform: getComputedStyle(filmMotion).transform,
      filmMotionRect: (() => {
        const rect = filmMotion.getBoundingClientRect()
        return { x: Math.round(rect.x), width: Math.round(rect.width) }
      })(),
      filmRect: (() => {
        const rect = video.getBoundingClientRect()
        return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
      })(),
      filmBlend: getComputedStyle(filmFrame).mixBlendMode,
      filmBackground: getComputedStyle(filmFrame).backgroundColor,
      objectPosition: getComputedStyle(video).objectPosition,
      titleOpacity: Number(getComputedStyle(title).opacity),
      titleWordOpacities: titleWords.map((word) => Number(getComputedStyle(word).opacity)),
      wordmarkVisible: visible(wordmark),
      badgeRect: (() => {
        const rect = badge.getBoundingClientRect()
        return { width: Math.round(rect.width), height: Math.round(rect.height) }
      })(),
      titleVisible: visible(title) && titleWords.some((word) => visible(word)),
      benefitsVisible: visible(benefits),
      closingVisible: visible(closing),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
}

const results = []

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  const errors = []
  const failed = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.waitForFunction(
    () => document.querySelector('.heroSecret__film')?.readyState >= 1,
    { timeout: 15000 },
  )

  const hero = []
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    await scrollToProgress(page, '.stage', progress, false)
    hero.push({ progress, state: await readState(page) })
    if ([0, 0.75, 1].includes(progress)) {
      await page.screenshot({ path: `${outputDir}/${viewport.name}-hero-${progress}.png` })
    }
  }

  const secret = []
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    await scrollToProgress(page, '.secret', progress)
    secret.push({ progress, state: await readState(page) })
    if ([0, 0.5, 1].includes(progress)) {
      await page.screenshot({ path: `${outputDir}/${viewport.name}-secret-${progress}.png` })
    }
  }

  await scrollToProgress(page, '.secret', 0.82)
  const reverseFrom = await readState(page)
  await scrollToProgress(page, '.stage', 0.45, false)
  const reverseTo = await readState(page)

  const followingSections = []
  for (const selector of ['.work', '.facts']) {
    await page.$eval(selector, (node) => node.scrollIntoView())
    await settle()
    const state = await page.evaluate((selector) => {
      const journey = document.querySelector('.heroSecret').getBoundingClientRect()
      const frame = document.querySelector('.heroSecret__filmFrame').getBoundingClientRect()
      const section = document.querySelector(selector)
      const sectionBackground = getComputedStyle(section).backgroundColor
      const overlapWidth = Math.max(0, Math.min(frame.right, journey.right, innerWidth) - Math.max(frame.left, journey.left, 0))
      const overlapHeight = Math.max(0, Math.min(frame.bottom, journey.bottom, innerHeight) - Math.max(frame.top, journey.top, 0))
      return {
        selector,
        paintedFilmArea: Math.round(overlapWidth * overlapHeight),
        sectionBackground,
      }
    }, selector)
    followingSections.push(state)
    if (viewport.name === 'mobile') {
      await page.screenshot({ path: `${outputDir}/${viewport.name}-${selector.slice(1)}.png` })
    }
  }

  results.push({ viewport: viewport.name, hero, secret, reverse: { from: reverseFrom, to: reverseTo }, followingSections, errors, failed })
  await page.close()
}

const reduced = await browser.newPage()
await reduced.setViewport({ width: 1440, height: 900 })
await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await reduced.goto(url, { waitUntil: 'networkidle2' })
await settle()
results.push({
  reduced: await reduced.evaluate(() => ({
    filmCount: document.querySelectorAll('.heroSecret video').length,
    handoffCount: document.querySelectorAll('.heroHandoff').length,
    filmPosition: getComputedStyle(document.querySelector('.heroSecret__filmFrame')).position,
    filmPaused: document.querySelector('.heroSecret__film').paused,
    filmTime: document.querySelector('.heroSecret__film').currentTime,
    secretStill: document.querySelector('.secret').classList.contains('secret--still'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })),
})
await reduced.close()

await browser.close()
console.log(JSON.stringify(results, null, 2))
