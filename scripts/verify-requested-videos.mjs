import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
})

const checks = [
  { route: '#/', section: '.decide', button: '.decide__card--playable', video: '.decide__video', src: '/decide/client-before-after.mp4', poster: '/decide/from-bald-to-bold.png', ratio: 16 / 9 },
  { route: '#/', section: '.process', button: '.process__media--playable', video: '.process__video', src: '/process/step-by-step.mp4', poster: '/process/steps.png', ratio: 4 / 3 },
  { route: '#/hair-patch-vs-hair-system', section: '.guideHero', button: '.guideHero__trigger', video: '.guideHero__video', src: '/patch-vs-system/patch-vs-system.mp4', poster: '/patch-vs-system/thumbnail.png', ratio: 16 / 9 },
  { route: '#/will-my-hairline-look-real', section: '.guideHero', button: '.guideHero__trigger', video: '.guideHero__video', src: '/hairline-real/natural-hairline.mp4', poster: '/hairline-real/thumbnail.png', ratio: 16 / 9 },
  { route: '#/will-my-hairline-look-real', section: '#hairline-design-title', closest: '.checklist', button: '.checklist__media--playable', video: '.checklist__video', src: '/hairline-real/design-film.mp4', poster: '/hairline-real/design-film.png', ratio: 4 / 3 },
  { route: '#/stick-on-lifespan', section: '.guideHero', button: '.guideHero__trigger', video: '.guideHero__video', src: '/guide-media/stick-on-vs-clip-on.mp4', poster: '/stick-on-lifespan/thumbnail.png', ratio: 16 / 9 },
  { route: '#/clip-on-lifespan', section: '.guideHero', button: '.guideHero__trigger', video: '.guideHero__video', src: '/guide-media/stick-on-vs-clip-on.mp4', poster: '/clip-on-lifespan/thumbnail.png', ratio: 16 / 9 },
  { route: '#/hair-transplant', section: '.htHero', button: '.htHero__media > button', video: '.htHero__media > video', src: '/hair-transplant/hair-transplant-or-system.mp4', poster: '/hair-transplant/combination-method.png', ratio: 16 / 9 },
  { route: '#/results', section: '.resultsHero', button: '.resultsHero__media > button', video: '.resultsHero__media > video', src: '/decide/client-before-after.mp4', poster: '/results/results-hero.png', ratio: 16 / 9 },
]

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  for (const check of checks) {
    await page.goto(`http://127.0.0.1:5173/${check.route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const root = check.closest
      ? await page.$eval(check.section, (node, closest) => node.closest(closest)?.className, check.closest)
      : true
    if (!root) throw new Error(`Missing section ${check.section} on ${check.route}`)
    const scope = check.closest ? check.closest : check.section
    await page.waitForSelector(`${scope} ${check.button}`)
    await page.click(`${scope} ${check.button}`)
    await page.waitForSelector(`${scope} ${check.video}`)
    const result = await page.$eval(`${scope} ${check.video}`, async (video) => {
      if (video.readyState === 0) {
        await Promise.race([
          new Promise(resolve => video.addEventListener('loadedmetadata', resolve, { once: true })),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Video metadata timeout')), 15_000)),
        ])
      }
      const rect = video.parentElement.getBoundingClientRect()
      return {
        src: new URL(video.getAttribute('src'), location.href).pathname,
        poster: new URL(video.getAttribute('poster'), location.href).pathname,
        ratio: rect.width / rect.height,
        fit: getComputedStyle(video).objectFit,
        sourceRatio: video.videoWidth / video.videoHeight,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })
    if (result.src !== check.src || result.poster !== check.poster) throw new Error(`Wrong media mapping on ${check.route}: ${JSON.stringify(result)}`)
    if (Math.abs(result.ratio - check.ratio) > 0.01) throw new Error(`Wrong ratio on ${check.route}: ${result.ratio}`)
    if (Math.abs(result.sourceRatio - check.ratio) > 0.01) throw new Error(`Wrong source ratio on ${check.route}: ${result.sourceRatio}`)
    if (result.fit !== 'contain' || result.overflow > 1) throw new Error(`Layout failure on ${check.route}: ${JSON.stringify(result)}`)
    console.log(`${viewport.width}px ${check.route} ${check.src} ratio=${result.ratio.toFixed(4)}`)
  }
  await page.close()
}

await browser.close()
