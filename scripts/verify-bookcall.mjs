/* "Book Your 1:1 Consultation" — glass panel + word-by-word reveal.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-bookcall.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/hair-patch-vs-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-bookcall'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)

  const top = await page.evaluate(
    () => Math.round(document.querySelector('.bookCall').getBoundingClientRect().top + scrollY),
  )

  // Sample the word reveal before the section enters, and once centred.
  const sample = async (offset) => {
    await page.evaluate((y) => scrollTo(0, y), Math.max(0, top - offset))
    await new Promise((r) => setTimeout(r, 1100))
    return page.evaluate(() => {
      const words = [...document.querySelectorAll('.bookCall__word')]
      const cs = (el) => getComputedStyle(el)
      const panel = document.querySelector('.bookCall__panel')
      return {
        firstWord: cs(words[0]).color,
        lastWord: cs(words[words.length - 1]).color,
        panelOpacity: +cs(panel).opacity,
        pointsOpacity: +cs(document.querySelector('.bookCall__points')).opacity,
        ctaOpacity: +cs(document.querySelector('.bookCall__ctaWrap')).opacity,
      }
    })
  }
  const before = await sample(900)
  const during = await sample(-260)

  console.log('words  before :', before.firstWord, '|', before.lastWord)
  console.log('words  during :', during.firstWord, '|', during.lastWord)
  console.log('panel opacity :', before.panelOpacity, '->', during.panelOpacity)
  console.log('points/cta    :', `${before.pointsOpacity}/${before.ctaOpacity}`, '->', `${during.pointsOpacity}/${during.ctaOpacity}`)

  const info = await page.evaluate(() => {
    const panel = document.querySelector('.bookCall__panel')
    const cs = getComputedStyle(panel)
    const btn = document.querySelector('.bookCall__btn').getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    const card = document.querySelector('.bookCall__point')
    const cardCs = getComputedStyle(card)
    return {
      panelBg: cs.backgroundImage.slice(0, 60),
      orbs: document.querySelectorAll('.bookCall__orb').length,
      cardGlass: [
        cardCs.backdropFilter || cardCs.webkitBackdropFilter,
        cardCs.backgroundColor,
        cardCs.borderTopColor,
      ],
      panelBox: [Math.round(p.width), Math.round(p.height)],
      cta: [Math.round(btn.width), Math.round(btn.height)],
      cols: getComputedStyle(document.querySelector('.bookCall__points')).gridTemplateColumns,
      icons: document.querySelectorAll('.bookCall__tile svg').length,
      sectionH: Math.round(document.querySelector('.bookCall').getBoundingClientRect().height),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      href: document.querySelector('.bookCall__btn').getAttribute('href'),
    }
  })
  console.log('panel bg      :', info.panelBg)
  console.log('panel box     :', info.panelBox.join('x'), '| section', info.sectionH + 'px')
  console.log('orbs left     :', info.orbs)
  console.log('point glass   :', info.cardGlass.join(' | '))
  console.log('points columns:', info.cols)
  console.log('lucide icons  :', info.icons, '| CTA', info.cta.join('x'), '| href', info.href)
  console.log('page overflow :', info.overflow)
  console.log('section order :', info.order.join(' > '))
  console.log('console errors:', errors.length ? errors.slice(0, 4) : 'none')

  await page.screenshot({ path: `${out}/bookcall-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
