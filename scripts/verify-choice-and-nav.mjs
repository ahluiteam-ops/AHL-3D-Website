import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = './.tmp-choice-verify'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

try {
  const page = await browser.newPage()
  
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  // 1. Test Desktop Nav & Dropdown
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/#/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${outDir}/01-desktop-home.png` })

  const guideItem = await page.$('.nav__item--dropdown')
  if (guideItem) {
    await guideItem.hover()
    await new Promise((r) => setTimeout(r, 500))
    await page.screenshot({ path: `${outDir}/02-desktop-dropdown.png` })

    const submenuWrap = await page.$('.nav__submenuWrap')
    if (submenuWrap) {
      await submenuWrap.hover()
      await new Promise((r) => setTimeout(r, 500))
      await page.screenshot({ path: `${outDir}/03-desktop-submenu.png` })
    }
  }

  // 2. Navigate to Stick-On or Clip-On page
  await page.goto('http://127.0.0.1:5173/#/stick-on-or-clip-on', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${outDir}/04-desktop-choice-hero-top.png` })

  // Scroll down within the ChoiceHero section
  await page.evaluate(() => window.scrollTo(0, 500))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `${outDir}/05-desktop-choice-hero-mid.png` })

  await page.evaluate(() => window.scrollTo(0, 950))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `${outDir}/06-desktop-choice-hero-full.png` })

  const desktopStats = await page.evaluate(() => {
    const title = document.querySelector('.choice__title')?.textContent
    const eyebrow = document.querySelector('.choice__eyebrow')?.textContent
    const img = document.querySelector('.choice__card img')
    return {
      title,
      eyebrow,
      imgSrc: img?.getAttribute('src'),
      imgNatural: `${img?.naturalWidth}x${img?.naturalHeight}`,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  // Scroll into Transformations ("Real Results That Showcase True Transformations")
  await page.evaluate(() => {
    const transforms = document.querySelector('.transforms')
    transforms?.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `${outDir}/06b-desktop-transforms-card1.png` })

  // Click on card 2 (Rahil Khan)
  const cards = await page.$$('.transforms__card')
  if (cards.length > 1) {
    await cards[1].click()
    await new Promise((r) => setTimeout(r, 700))
    await page.screenshot({ path: `${outDir}/06c-desktop-transforms-card2.png` })
  }

  // Scroll into Systems ("World's Finest Thinnest Hair Systems")
  await page.evaluate(() => {
    const systems = document.querySelector('.systems')
    systems?.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `${outDir}/06d-desktop-choice-systems.png` })

  // 3. Test Mobile (390x844)
  await page.setViewport({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/#/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${outDir}/07-mobile-home.png` })

  // Open mobile drawer
  await page.click('.nav__grid')
  await new Promise((r) => setTimeout(r, 500))
  await page.screenshot({ path: `${outDir}/08-mobile-drawer-open.png` })

  // Toggle accordion for Confused? We'll Guide You
  const toggleBtn = await page.$('.nav__mobileToggle')
  if (toggleBtn) {
    await toggleBtn.click()
    await new Promise((r) => setTimeout(r, 500))
    await page.screenshot({ path: `${outDir}/09-mobile-accordion-expanded.png` })
  }

  // Go to Stick-On or Clip-On on Mobile
  await page.goto('http://127.0.0.1:5173/#/stick-on-or-clip-on', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${outDir}/10-mobile-choice-hero.png` })

  // Scroll to transforms on mobile
  await page.evaluate(() => {
    const transforms = document.querySelector('.transforms')
    transforms?.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: `${outDir}/11-mobile-transforms-rail.png` })

  const mobileStats = await page.evaluate(() => {
    const title = document.querySelector('.choice__title')?.textContent
    const eyebrow = document.querySelector('.choice__eyebrow')?.textContent
    const img = document.querySelector('.choice__card img')
    return {
      title,
      eyebrow,
      imgSrc: img?.getAttribute('src'),
      imgNatural: `${img?.naturalWidth}x${img?.naturalHeight}`,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  console.log('Mobile Choice Stats:', JSON.stringify(mobileStats, null, 2))
  console.log('Console Errors:', errors)

} finally {
  await browser.close()
}
