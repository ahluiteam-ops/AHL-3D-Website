/* Verify the founder consultation: the homepage teaser, the full-page booking
 * flow at #/book-consultation, and the hand-off to the thank-you page.
 *   set VERIFY_URL=http://localhost:5180/ && node scripts/verify-founder-booking.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = (process.env.VERIFY_URL ?? 'http://127.0.0.1:5180/').replace(/#.*$/, '')
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-founder-booking'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

const tick = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))
const expectedTimes = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']

async function run(width, height, label, reducedMotion = false) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  // A request cancelled because the page navigated away (the homepage hero video)
  // is not a failure; anything else is.
  page.on('requestfailed', (request) => request.failure()?.errorText !== 'net::ERR_ABORTED' && failed.push(request.url()))
  await page.setViewport({ width, height, isMobile: width <= 620, hasTouch: width <= 620 })
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

  const fail = (what, data) => { throw new Error(`${label}: ${what} ${JSON.stringify(data)}`) }
  const stepText = () => page.evaluate(() => document.querySelector('.bookFlow__step')?.textContent)
  const click = async (selector) => { await page.click(selector); await tick() }

  // ---- Homepage teaser ------------------------------------------------------
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.$eval('.founderBooking', (element) => element.scrollIntoView({ block: 'center' }))
  await tick(900)
  const section = await page.evaluate(() => {
    const root = document.querySelector('.founderBooking')
    const cta = document.querySelector('.founderBooking__cta')
    const form = document.querySelector('.form')
    return {
      title: root?.querySelector('h2')?.textContent?.trim(),
      eyebrow: root?.querySelector('.founderBooking__eyebrow')?.textContent?.trim(),
      meta: root?.querySelector('.founderBooking__meta')?.textContent?.trim(),
      ctaTag: cta?.tagName,
      ctaHref: cta?.getAttribute('href'),
      ctaHeight: cta?.getBoundingClientRect().height,
      beforeForm: Boolean(root && form && (root.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panelOpacity: root ? getComputedStyle(root.querySelector('.founderBooking__panel')).opacity : null,
      dialogs: document.querySelectorAll('dialog').length,
    }
  })
  if (section.title !== 'Looking for Expert Advice from the Founder?' || section.eyebrow !== 'Expert Consultation'
    || section.meta !== '45–60 minutes · Online or in person' || section.ctaTag !== 'A'
    || section.ctaHref !== '#/book-consultation' || !section.ctaHeight || section.ctaHeight < 48
    || !section.beforeForm || section.overflow !== 0 || section.panelOpacity !== '1' || section.dialogs !== 0) {
    fail('teaser mismatch', section)
  }

  // ---- The CTA opens a full page, not a popup -------------------------------
  await click('.founderBooking__cta')
  await page.waitForSelector('.bookPage')
  await tick(300)
  const opened = await page.evaluate(() => ({
    hash: window.location.hash,
    h1: document.querySelector('.bookFlow__head h1')?.textContent,
    dialogs: document.querySelectorAll('dialog').length,
    floating: document.querySelectorAll('.floatingContact').length,
    nav: document.querySelectorAll('header.nav').length,
    scrollY: window.scrollY,
    days: document.querySelectorAll('.bookFlow__calDays button').length,
    monthTitle: document.querySelector('.bookFlow__calNav p')?.textContent,
    prevDisabled: document.querySelector('.bookFlow__calNav button[aria-label="Previous month"]')?.disabled,
    hours: document.querySelector('.bookFlow__hours')?.textContent,
    hint: document.querySelector('.bookFlow__hint')?.textContent,
    pick: document.querySelector('.bookFlow__pick')?.textContent,
    slotsBeforeDate: document.querySelectorAll('.bookFlow__choices--slots button').length,
    selected: document.querySelectorAll('.bookFlow [aria-pressed="true"]').length,
    continueDisabled: document.querySelector('.bookFlow__actions .bookFlow__primary')?.disabled,
    summaryShown: getComputedStyle(document.querySelector('.bookSummary')).display !== 'none',
    summaryRows: [...document.querySelectorAll('.bookSummary dd')].map((node) => node.textContent),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    minTarget: Math.min(...[...document.querySelectorAll('.bookPage button, .bookPage a')]
      .filter((node) => node.getBoundingClientRect().width > 0 && !node.closest('.bookFlow__calDays'))
      .map((node) => node.getBoundingClientRect().height)),
  }))
  if (opened.hash !== '#/book-consultation' || opened.h1 !== 'Book your private consultation' || opened.dialogs !== 0
    || opened.floating !== 0 || opened.nav !== 0 || opened.scrollY !== 0
    || opened.days < 28 || !opened.monthTitle || !opened.prevDisabled
    || opened.hours !== 'Open 11 AM – 8 PM · Closed on Mondays'
    || !opened.hint?.includes('These are tentative dates')
    || !opened.hint.includes('call you back and give you a final confirmation')
    || !opened.pick?.includes('Pick a date') || opened.slotsBeforeDate !== 0 || opened.selected !== 0
    || !opened.continueDisabled || opened.summaryShown !== (width >= 900) || opened.overflow !== 0
    || opened.minTarget < 44 || (await stepText()) !== 'Step 1 of 3') {
    fail('booking page mismatch', opened)
  }
  if (opened.summaryShown && (opened.summaryRows.length !== 4 || opened.summaryRows[3] !== '₹5,000')) {
    fail('summary mismatch', opened.summaryRows)
  }
  await page.screenshot({ path: `${out}/book-${label}-step-1.png` })

  // ---- Every month in the window: Mondays closed, 8 slots a day --------------
  const perDate = []
  const mondays = []
  for (let monthStep = 0; monthStep < 3; monthStep += 1) {
    const month = await page.evaluate(() => ({
      open: [...document.querySelectorAll('.bookFlow__calDays button:not(:disabled)')].map((b) => b.getAttribute('aria-label')),
      closed: [...document.querySelectorAll('.bookFlow__calDays button[aria-label$=", closed"]')].map((b) => ({
        label: b.getAttribute('aria-label'),
        disabled: b.disabled,
      })),
      nextDisabled: document.querySelector('.bookFlow__calNav button[aria-label="Next month"]')?.disabled,
    }))
    mondays.push(...month.closed)
    for (const dayLabel of month.open) {
      await page.evaluate((text) => {
        [...document.querySelectorAll('.bookFlow__calDays button')].find((b) => b.getAttribute('aria-label') === text)?.click()
      }, dayLabel)
      await tick(40)
      perDate.push({ dayLabel, ...(await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.bookFlow__choices--slots button')]
        const booked = buttons.filter((button) => button.disabled)
        return {
          times: buttons.map((button) => button.querySelector('span')?.textContent),
          total: buttons.length,
          booked: booked.length,
          open: buttons.length - booked.length,
          labelled: booked.every((button) => button.textContent.includes('Booked') && button.getAttribute('aria-label')?.endsWith('booked')),
          edgesBooked: [0, 6, 7].every((index) => buttons[index]?.disabled),
        }
      })) })
    }
    if (month.nextDisabled) break
    await click('.bookFlow__calNav button[aria-label="Next month"]')
  }
  if (perDate.length < 24 || perDate.length > 26 || perDate.some((row) => row.dayLabel.startsWith('Monday')
    || row.total !== 8 || JSON.stringify(row.times) !== JSON.stringify(expectedTimes)
    || row.booked < 3 || row.booked > 5 || row.open < 3 || !row.labelled || !row.edgesBooked)) {
    fail('slot grid mismatch', perDate)
  }
  if (!mondays.length || mondays.some((row) => !row.disabled)) fail('Mondays must be closed', mondays)
  if (new Set(perDate.map((row) => row.open)).size < 2) fail('booked pattern is identical on every date', {})
  while (!(await page.evaluate(() => document.querySelector('.bookFlow__calNav button[aria-label="Previous month"]')?.disabled))) {
    await click('.bookFlow__calNav button[aria-label="Previous month"]')
  }

  // ---- Choose, with a booked slot that must not take ------------------------
  await page.evaluate(() => {
    document.querySelectorAll('.bookFlow__choices--mode button')[0]?.click()
    document.querySelector('.bookFlow__calDays button:not(:disabled)')?.click()
  })
  await tick()
  await page.evaluate(() => [...document.querySelectorAll('.bookFlow__choices--slots button')].find((b) => b.disabled)?.click())
  await tick()
  const afterBooked = await page.evaluate(() => document.querySelectorAll('.bookFlow__choices--slots [aria-pressed="true"]').length)
  const time = await page.evaluate(() => {
    const open = [...document.querySelectorAll('.bookFlow__choices--slots button')].find((b) => !b.disabled)
    open?.click()
    return open?.querySelector('span')?.textContent
  })
  await tick()
  const dateLabel = await page.evaluate(() => document.querySelector('.bookFlow__calDays [aria-pressed="true"]')?.getAttribute('aria-label'))
  const summaryAfter = await page.evaluate(() => [...document.querySelectorAll('.bookSummary dd')].map((n) => n.textContent))
  if (afterBooked !== 0 || !time || !dateLabel) fail('selection mismatch', { afterBooked, time, dateLabel })
  if (width >= 900 && (!summaryAfter[1].includes(dateLabel) || summaryAfter[2] !== time || summaryAfter[0] !== 'Online video call')) {
    fail('summary did not follow the choices', summaryAfter)
  }
  if (width <= 700) {
    const bar = await page.evaluate(() => {
      const rect = document.querySelector('.bookFlow__actions').getBoundingClientRect()
      return { bottom: rect.bottom, height: innerHeight }
    })
    if (Math.abs(bar.bottom - bar.height) > 1) fail('mobile action bar is not pinned to the bottom', bar)
  }
  await page.screenshot({ path: `${out}/book-${label}-step-1-picked.png` })

  // ---- Step 2, and the browser Back button between steps ---------------------
  await click('.bookFlow__actions .bookFlow__primary')
  if ((await stepText()) !== 'Step 2 of 3') fail('did not reach step 2', await stepText())
  await page.goBack()
  await tick(150)
  const backToOne = await page.evaluate(() => ({
    step: document.querySelector('.bookFlow__step')?.textContent,
    hash: window.location.hash,
    time: document.querySelector('.bookFlow__choices--slots [aria-pressed="true"]')?.textContent,
  }))
  if (backToOne.step !== 'Step 1 of 3' || backToOne.hash !== '#/book-consultation' || !backToOne.time?.includes(time)) {
    fail('browser Back did not return to step 1 with the choices kept', backToOne)
  }
  await page.goForward()
  await tick(150)
  if ((await stepText()) !== 'Step 2 of 3') fail('browser Forward did not return to step 2', await stepText())

  // Validation, then details.
  await click('.bookFlow__actions .bookFlow__primary')
  const errorsShown = await page.evaluate(() => document.querySelectorAll('.bookFlow__fields small').length)
  if (errorsShown !== 3) fail('expected three validation messages', errorsShown)
  const inputs = await page.$$('.bookFlow__fields input')
  await inputs[0].type('Test Visitor')
  await inputs[1].type('9876543210')
  await inputs[2].type('test@example.com')

  // A refresh keeps the step and what was typed.
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForSelector('.bookFlow')
  const afterReload = await page.evaluate(() => ({
    step: document.querySelector('.bookFlow__step')?.textContent,
    name: document.querySelector('.bookFlow__fields input')?.value,
  }))
  if (afterReload.step !== 'Step 2 of 3' || afterReload.name !== 'Test Visitor') fail('refresh lost the flow', afterReload)

  await click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.bookFlow__review')
  await tick(100)
  const review = await page.evaluate(() => ({
    rows: document.querySelectorAll('.bookFlow__review > div').length,
    text: document.querySelector('.bookFlow__review')?.textContent,
    notice: document.querySelector('.bookFlow__notice')?.textContent,
    pay: document.querySelector('.bookFlow__actions .bookFlow__primary')?.textContent,
    focus: document.activeElement?.id,
    scrollY: window.scrollY,
  }))
  if (review.rows !== 4 || !review.text?.includes('Online video call') || !review.text.includes(time)
    || !review.text.includes(dateLabel.split(', ')[1]) || !review.text.includes('₹5,000')
    || !review.notice?.includes('not a confirmed appointment') || !review.notice.includes('final confirmation')
    || !review.pay?.includes('Pay ₹5,000 securely') || review.focus !== 'book-title' || review.scrollY > 1) {
    fail('review mismatch', review)
  }
  await page.screenshot({ path: `${out}/book-${label}-step-3.png` })

  // ---- Close steps back onto the page the flow was opened from ---------------
  await click('.bookPage__close')
  await page.waitForSelector('.founderBooking')
  await tick(200)
  const closed = await page.evaluate(() => ({
    onBookPage: Boolean(document.querySelector('.bookPage')),
    hash: window.location.hash,
    teaser: Boolean(document.querySelector('.founderBooking')),
  }))
  if (closed.onBookPage || !closed.teaser || closed.hash === '#/book-consultation') fail('Close did not return to the homepage', closed)

  // Reopening keeps the choices and the details.
  await page.$eval('.founderBooking', (element) => element.scrollIntoView({ block: 'center' }))
  await tick(500)
  await click('.founderBooking__cta')
  await page.waitForSelector('.bookPage')
  await tick(200)
  const kept = await page.evaluate(() => ({
    step: document.querySelector('.bookFlow__step')?.textContent,
    selected: document.querySelectorAll('.bookFlow [aria-pressed="true"]').length,
    continueDisabled: document.querySelector('.bookFlow__actions .bookFlow__primary')?.disabled,
  }))
  if (kept.step !== 'Step 1 of 3' || kept.selected !== 3 || kept.continueDisabled) fail('choices were not kept', kept)
  await click('.bookFlow__actions .bookFlow__primary')
  const prefilled = await page.evaluate(() => document.querySelector('.bookFlow__fields input')?.value)
  if (prefilled !== 'Test Visitor') fail('details were not kept', prefilled)
  await click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.bookFlow__review')

  // ---- Pay: with Razorpay unconfigured this is a flagged preview -------------
  await click('.bookFlow__actions .bookFlow__primary')
  await page.waitForSelector('.booked')
  await tick(900)
  const booked = await page.evaluate(() => ({
    hash: window.location.hash,
    h1: document.querySelector('.booked h1')?.textContent,
    preview: document.querySelector('.booked__preview')?.textContent,
    date: document.querySelector('.booked__date')?.textContent,
    time: document.querySelector('.booked__time')?.textContent,
    mode: document.querySelector('.booked__mode')?.textContent,
    facts: document.querySelector('.booked__facts')?.textContent,
    steps: document.querySelectorAll('.booked__next li').length,
    bookPage: Boolean(document.querySelector('.bookPage')),
    scrollY: window.scrollY,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }))
  if (booked.hash !== '#/consultation-booked' || booked.h1 !== 'Thank you, Test.'
    || !booked.preview?.includes('no payment was taken') || booked.time !== time
    || !booked.date?.includes(dateLabel.split(', ')[1]) || !booked.mode?.includes('Online')
    || !booked.facts?.includes('9876543210') || !booked.facts.includes('₹5,000') || booked.steps !== 3
    || booked.bookPage || booked.scrollY !== 0 || booked.overflow > 0) {
    fail('thank-you mismatch', booked)
  }
  await page.screenshot({ path: `${out}/consultation-booked-${label}.png`, fullPage: true })

  // The draft is gone after a booking: a fresh visit starts empty.
  await page.goto(`${URL}#/book-consultation`, { waitUntil: 'networkidle2' })
  await page.waitForSelector('.bookFlow')
  const fresh = await page.evaluate(() => document.querySelectorAll('.bookFlow [aria-pressed="true"]').length)
  if (fresh !== 0) fail('a finished booking left a draft behind', fresh)

  if (errors.length) fail('console errors', errors)
  if (failed.length) fail('failed requests', failed)

  console.log(label, JSON.stringify({ opened: { ...opened, summaryRows: undefined }, time, dateLabel, review: { rows: review.rows }, closed, booked: { hash: booked.hash, h1: booked.h1 } }))
  await page.close()
}

await run(1440, 900, 'desktop')
await run(390, 844, 'mobile')
await run(375, 812, 'small-mobile')
await run(360, 780, 'reference-mobile')
await run(320, 568, 'compact-mobile')
await run(844, 390, 'landscape')
await run(1440, 900, 'reduced', true)
await browser.close()
