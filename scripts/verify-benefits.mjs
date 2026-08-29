/* "Benefits of a Natural Looking Hair System" — the Apple-style card that
 * expands into a sheet. Checks the open/close cycle, the keyboard contract,
 * the scroll lock, and the blur behind.
 *   node scripts/verify-benefits.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/hair-patch-vs-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-benefits'
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
  await new Promise((r) => setTimeout(r, 1400))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)

  // Bring the card into view.
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.benefits')
      if (el) scrollBy(0, el.getBoundingClientRect().top - 60)
    })
    await new Promise((r) => setTimeout(r, 260))
  }
  await new Promise((r) => setTimeout(r, 800))

  const closed = await page.evaluate(() => {
    const card = document.querySelector('.benefits__card')
    const r = card.getBoundingClientRect()
    return {
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      card: [Math.round(r.width), Math.round(r.height)],
      plus: (() => { const p = document.querySelector('.benefits__plus').getBoundingClientRect(); return [Math.round(p.width), Math.round(p.height)] })(),
      expanded: card.getAttribute('aria-expanded'),
      sheet: !!document.querySelector('.benefits__sheet'),
      slots: document.querySelectorAll('.benefits__slot').length,
      bodyOverflow: getComputedStyle(document.body).overflow,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  console.log('order         :', closed.order.join(' > '))
  console.log('card / plus   :', closed.card.join('x'), '|', closed.plus.join('x'))
  console.log('closed state  : aria-expanded', closed.expanded, '| sheet in DOM', closed.sheet, '| empty photo slots', closed.slots)
  await page.screenshot({ path: `${out}/benefits-${tag}-closed.png` })

  // Open it.
  await page.click('.benefits__card')
  await new Promise((r) => setTimeout(r, 1200))
  const opened = await page.evaluate(() => {
    const sheet = document.querySelector('.benefits__sheet')
    const scrim = document.querySelector('.benefits__scrim')
    const r = sheet.getBoundingClientRect()
    return {
      sheet: [Math.round(r.width), Math.round(r.height)],
      role: sheet.getAttribute('role'),
      modal: sheet.getAttribute('aria-modal'),
      labelled: !!document.getElementById(sheet.getAttribute('aria-labelledby')),
      blur: getComputedStyle(scrim).backdropFilter || getComputedStyle(scrim).webkitBackdropFilter,
      focus: document.activeElement?.className || document.activeElement?.tagName,
      bodyOverflow: getComputedStyle(document.body).overflow,
      expanded: document.querySelector('.benefits__card').getAttribute('aria-expanded'),
      points: document.querySelectorAll('.benefits__item').length,
      cta: document.querySelector('.benefits__cta')?.getAttribute('href'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cols: getComputedStyle(document.querySelector('.benefits__sheetIn')).gridTemplateColumns,
    }
  })
  console.log('open sheet    :', opened.sheet.join('x'), '| cols', opened.cols)
  console.log('dialog        : role', opened.role, '| aria-modal', opened.modal, '| labelled', opened.labelled)
  console.log('blur behind   :', opened.blur)
  console.log('focus moved to:', opened.focus, '| body overflow', opened.bodyOverflow, '| aria-expanded', opened.expanded)
  console.log('points / cta  :', opened.points, '|', opened.cta)
  console.log('page overflow :', opened.overflow)
  await page.screenshot({ path: `${out}/benefits-${tag}-open.png` })

  // Escape must close it and hand focus back.
  await page.keyboard.press('Escape')
  await new Promise((r) => setTimeout(r, 1100))
  const after = await page.evaluate(() => ({
    sheet: !!document.querySelector('.benefits__sheet'),
    focus: document.activeElement?.className || document.activeElement?.tagName,
    bodyOverflow: getComputedStyle(document.body).overflow,
    expanded: document.querySelector('.benefits__card').getAttribute('aria-expanded'),
  }))
  console.log('after Escape  : sheet gone', !after.sheet, '| focus', after.focus, '| body overflow', JSON.stringify(after.bodyOverflow), '| aria-expanded', after.expanded)
  console.log('console errors:', errors.length ? errors.slice(0, 4) : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
