/* Verify the founder-consultation section on the inner pages that carry it.
 *   set VERIFY_URL=http://localhost:5180/ && node scripts/verify-founder-booking-pages.mjs [outDir]
 * Each page must show the section once, ahead of the element named in `before`,
 * open the full-page booking, take a date and time, Close back to the same page, and reach the thank-you page on Pay. */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = (process.env.VERIFY_URL ?? 'http://localhost:5180/').replace(/#.*$/, '')
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-founder-pages'
mkdirSync(out, { recursive: true })

const pages = [
  { route: '#/stick-on-or-clip-on', name: 'stick-or-clip', before: '.stillConfused' },
  { route: '#/will-my-hairline-look-real', name: 'hairline-real', before: '.stillConfused, [class*="airlineConfused"]' },
  { route: '#/hair-transplant', name: 'transplant', before: '#hair-transplant-form' },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
const tick = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

async function run(entry, width, height, label) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  await page.setViewport({ width, height, isMobile: width <= 620, hasTouch: width <= 620 })
  await page.goto(`${BASE}${entry.route}`, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.$eval('.founderBooking', (element) => element.scrollIntoView({ block: 'center' }))
  await tick(900)

  const placed = await page.evaluate((beforeSelector) => {
    const sections = document.querySelectorAll('.founderBooking')
    const section = sections[0]
    const next = [...document.querySelectorAll(beforeSelector)].find(Boolean)
    return {
      count: sections.length,
      title: section?.querySelector('h2')?.textContent?.trim(),
      cta: section?.querySelector('.founderBooking__cta')?.textContent?.trim(),
      ctaHeight: section?.querySelector('.founderBooking__cta')?.getBoundingClientRect().height,
      panelOpacity: section ? getComputedStyle(section.querySelector('.founderBooking__panel')).opacity : null,
      beforeTarget: Boolean(section && next && (section.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  }, entry.before)
  if (placed.count !== 1 || placed.title !== 'Looking for Expert Advice from the Founder?'
    || !placed.cta?.includes('Consult with the Founder') || !placed.ctaHeight || placed.ctaHeight < 48
    || placed.panelOpacity !== '1' || !placed.beforeTarget || placed.overflow !== 0) {
    throw new Error(`${entry.name} ${label}: placement mismatch ${JSON.stringify(placed)}`)
  }
  await page.screenshot({ path: `${out}/${entry.name}-${label}-section.png` })

  await page.click('.founderBooking__cta')
  await page.waitForSelector('.bookPage')
  await tick(300)
  const opened = await page.evaluate(() => ({
    hash: window.location.hash,
    dialogs: document.querySelectorAll('dialog').length,
    h1: document.querySelector('.bookFlow__head h1')?.textContent,
  }))
  if (opened.hash !== '#/book-consultation' || opened.dialogs !== 0 || opened.h1 !== 'Book your private consultation') {
    throw new Error(`${entry.name} ${label}: booking page mismatch ${JSON.stringify(opened)}`)
  }
  await page.evaluate(() => {
    document.querySelectorAll('.bookFlow__choices--mode button')[1]?.click()
    document.querySelector('.bookFlow__calDays button:not(:disabled)')?.click()
  })
  await tick()
  await page.evaluate(() => {
    [...document.querySelectorAll('.bookFlow__choices--slots button')].find((button) => !button.disabled)?.click()
  })
  await tick()
  await page.click('.bookFlow__actions .bookFlow__primary')
  await tick(100)
  const inputs = await page.$$('.bookFlow__fields input')
  await inputs[0].type('Page Tester')
  await inputs[1].type('9876543210')
  await inputs[2].type('page@example.com')
  await page.click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.bookFlow__review')
  const review = await page.evaluate(() => document.querySelector('.bookFlow__review')?.textContent)
  if (!review?.includes('₹5,000') || !review.includes('In person')) {
    throw new Error(`${entry.name} ${label}: review mismatch ${review}`)
  }

  // Close returns to this same page; reopen and pay.
  await page.click('.bookPage__close')
  await page.waitForSelector('.founderBooking')
  await tick(200)
  const back = await page.evaluate(() => window.location.hash)
  if (back !== entry.route) throw new Error(`${entry.name} ${label}: Close returned to ${back}, expected ${entry.route}`)
  await page.$eval('.founderBooking', (element) => element.scrollIntoView({ block: 'center' }))
  await tick(500)
  await page.click('.founderBooking__cta')
  await page.waitForSelector('.bookPage')
  await tick(200)
  await page.click('.bookFlow__actions .bookFlow__primary')
  await tick(100)
  await page.click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.bookFlow__review')
  await page.click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.booked')
  await tick(700)
  const booked = await page.evaluate(() => ({
    hash: window.location.hash,
    h1: document.querySelector('.booked h1')?.textContent,
    bookPage: Boolean(document.querySelector('.bookPage')),
    scrollY: window.scrollY,
  }))
  if (booked.hash !== '#/consultation-booked' || booked.h1 !== 'Thank you, Page.' || booked.bookPage || booked.scrollY !== 0) {
    throw new Error(`${entry.name} ${label}: thank-you mismatch ${JSON.stringify(booked)}`)
  }
  if (errors.length) throw new Error(`${entry.name} ${label}: console errors ${errors.join(' | ')}`)
  console.log(entry.name, label, JSON.stringify(placed))
  await page.close()
}

for (const entry of pages) {
  await run(entry, 1440, 900, 'desktop')
  await run(entry, 390, 844, 'mobile')
}
await browser.close()
