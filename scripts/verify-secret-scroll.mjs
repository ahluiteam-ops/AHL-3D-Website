import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173'
const output = process.argv[2] ?? '.tmp-secret-scroll'

await fs.mkdir(output, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox'],
})

const results = []

async function sample(page, viewport, progress) {
  await page.evaluate((p) => {
    const section = document.querySelector('.secret')
    const top = section.getBoundingClientRect().top + scrollY
    const travel = section.getBoundingClientRect().height - innerHeight
    window.scrollTo(0, top + travel * p)
  }, progress)
  await new Promise((resolve) => setTimeout(resolve, 950))

  const state = await page.evaluate(() => {
    const video = document.querySelector('.heroSecret__film')
    const read = (selector) => {
      const node = document.querySelector(selector)
      const style = getComputedStyle(node)
      const rect = node.getBoundingClientRect()
      return {
        opacity: Number(style.opacity),
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      }
    }
    const bar = new DOMMatrix(getComputedStyle(document.querySelector('.secret__progress span')).transform)
    const titleWords = [...document.querySelectorAll('.secret__titleWord')].map((node) => {
      const style = getComputedStyle(node)
      return {
        opacity: Number(style.opacity),
        filter: style.filter,
        y: Number(new DOMMatrix(style.transform).m42.toFixed(2)),
      }
    })
    return {
      time: Number(video.currentTime.toFixed(3)),
      duration: Number(video.duration.toFixed(3)),
      paused: video.paused,
      loop: video.loop,
      title: read('.secret__title'),
      titleWords,
      benefits: read('.secret__benefits'),
      benefitOpacity: [...document.querySelectorAll('.secret__benefit')].map((node) =>
        Number(getComputedStyle(node).opacity),
      ),
      closing: read('.secret__closing'),
      progressScale: Number(bar.a.toFixed(3)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  await page.screenshot({ path: `${output}/${viewport}-${progress}.png` })
  return state
}

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

  const samples = []
  for (const progress of [0, 0.08, 0.16, 0.24, 0.4, 0.52, 0.7, 0.88, 1]) {
    samples.push({ progress, state: await sample(page, viewport.name, progress) })
  }

  const reverseStart = await sample(page, viewport.name, 0.85)
  const reverseEnd = await sample(page, viewport.name, 0.25)
  results.push({
    viewport: viewport.name,
    samples,
    reverse: { from: reverseStart.time, to: reverseEnd.time },
    errors,
    failed,
  })
  await page.close()
}

const reduced = await browser.newPage()
await reduced.setViewport({ width: 1440, height: 900 })
await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await reduced.goto(url, { waitUntil: 'networkidle2' })
await reduced.$eval('.secret', (node) => node.scrollIntoView())
await new Promise((resolve) => setTimeout(resolve, 400))
results.push({
  reduced: await reduced.evaluate(() => ({
    sectionHeight: Math.round(document.querySelector('.secret').getBoundingClientRect().height),
    videoPaused: document.querySelector('.heroSecret__film').paused,
    videoTime: document.querySelector('.heroSecret__film').currentTime,
    titleOpacity: Number(getComputedStyle(document.querySelector('.secret__title')).opacity),
    titleWords: [...document.querySelectorAll('.secret__titleWord')].map((node) => ({
      opacity: Number(getComputedStyle(node).opacity),
      filter: getComputedStyle(node).filter,
      transform: getComputedStyle(node).transform,
    })),
    benefitsOpacity: Number(getComputedStyle(document.querySelector('.secret__benefits')).opacity),
    closingOpacity: Number(getComputedStyle(document.querySelector('.secret__closing')).opacity),
    progressDisplay: getComputedStyle(document.querySelector('.secret__progress')).display,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })),
})
await reduced.screenshot({ path: `${output}/reduced.png` })
await reduced.close()

await browser.close()
console.log(JSON.stringify(results, null, 2))
