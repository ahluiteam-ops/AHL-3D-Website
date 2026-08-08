import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = 'http://127.0.0.1:5173'
const output = '.tmp-secret-autoplay'

await fs.mkdir(output, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
})

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
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.$eval('.secret', (node) => node.scrollIntoView())
  await page.waitForFunction(
    () => document.querySelector('.secret__model')?.readyState >= 1,
    { timeout: 15000 },
  )
  await new Promise((resolve) => setTimeout(resolve, 700))

  for (const time of [0.5, 3.5, 4.4, 8.8, 10]) {
    await page.$eval('.secret__model', async (video, target) => {
      video.pause()
      if (Math.abs(video.currentTime - target) > 0.01) {
        await new Promise((resolve) => {
          const done = () => {
            video.removeEventListener('seeked', done)
            resolve()
          }
          video.addEventListener('seeked', done, { once: true })
          video.currentTime = target
          setTimeout(done, 2000)
        })
      }
      video.dispatchEvent(new Event('timeupdate', { bubbles: true }))
    }, time)
    await new Promise((resolve) => setTimeout(resolve, 750))

    const state = await page.evaluate(() => {
      const section = document.querySelector('.secret')
      const video = document.querySelector('.secret__model')
      const read = (selector) => {
        const node = document.querySelector(selector)
        const style = getComputedStyle(node)
        const rect = node.getBoundingClientRect()
        return {
          opacity: Number(style.opacity),
          visibility: style.visibility,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        }
      }
      return {
        phase: [...section.classList].find((name) => name.startsWith('secret--phase-')),
        time: video.currentTime,
        loops: video.loop,
        objectPosition: getComputedStyle(video).objectPosition,
        title: read('.secret__scene--intro'),
        benefits: read('.secret__scene--benefits'),
        closing: read('.secret__scene--closing'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })

    results.push({ viewport: viewport.name, sample: time, state })
    await page.screenshot({ path: `${output}/${viewport.name}-${time}.png` })
  }

  await page.$eval('.secret__model', async (video) => {
    video.currentTime = Math.max(0, video.duration - 0.12)
    await video.play()
  })
  await page.waitForFunction(() => document.querySelector('.secret__model')?.ended)
  results.push({
    viewport: viewport.name,
    oneShot: await page.$eval('.secret__model', (video) => ({
      currentTime: video.currentTime,
      duration: video.duration,
      ended: video.ended,
      paused: video.paused,
      loops: video.loop,
    })),
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((resolve) => setTimeout(resolve, 300))
  await page.$eval('.secret', (node) => node.scrollIntoView())
  await new Promise((resolve) => setTimeout(resolve, 500))
  results.push({
    viewport: viewport.name,
    afterReentry: await page.$eval('.secret__model', (video) => ({
      currentTime: video.currentTime,
      ended: video.ended,
      paused: video.paused,
    })),
  })

  results.push({ viewport: viewport.name, errors, failed })
  await page.close()
}

const reduced = await browser.newPage()
await reduced.setViewport({ width: 1440, height: 900 })
await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await reduced.goto(url, { waitUntil: 'domcontentloaded' })
await reduced.$eval('.secret', (node) => node.scrollIntoView())
results.push({
  reduced: await reduced.evaluate(() => ({
    sectionHeight: document.querySelector('.secret').getBoundingClientRect().height,
    videoPaused: document.querySelector('.secret__model').paused,
    visibleScenes: [...document.querySelectorAll('.secret__scene')].map(
      (node) => getComputedStyle(node).visibility,
    ),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })),
})
await reduced.close()

await browser.close()
console.log(JSON.stringify(results, null, 2))
