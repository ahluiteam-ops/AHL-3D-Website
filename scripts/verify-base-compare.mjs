/* "Thin Base Vs. Thick Base" — the rating table on the Stick-On System Lifespan
 * page. Also re-probes page 3's comparison, since both share `.compare`.
 *   node scripts/verify-base-compare.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/#'
const out = process.argv[2] ?? './.tmp-rate'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(route, sel, width, height, tag, shot) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => errors.push('REQ FAIL ' + r.url()))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1600))

  for (let i = 0; i < 8; i++) {
    await page.evaluate((s) => {
      const el = document.querySelector(s)
      if (el) scrollBy(0, Math.max(0, el.getBoundingClientRect().top - 60))
    }, sel)
    await new Promise((r) => setTimeout(r, 220))
  }
  await new Promise((r) => setTimeout(r, 700))

  const m = await page.evaluate((s) => {
    const sec = document.querySelector(s)
    if (!sec) return { missing: true }
    const h2 = sec.querySelector('h2')
    const heads = [...sec.querySelectorAll('th')].map((t) =>
      t.textContent.replace(/\s+/g, ' ').trim(),
    )
    const rows = [...sec.querySelectorAll('tbody tr')].map((tr) => {
      const cells = [...tr.children]
      return {
        feature: cells[0].textContent.trim(),
        /* The rating cells: what a screen reader is actually given. */
        names: cells.slice(1).map((c) => {
          const g = c.querySelector('[role="img"]')
          return g ? g.getAttribute('aria-label') : c.textContent.trim()
        }),
        counts: cells.slice(1).map((c) => c.querySelectorAll('svg').length),
      }
    })
    const star = sec.querySelector('.rateCompare__star')
    const cs = star ? getComputedStyle(star) : null
    const card = sec.querySelector('.compare__tableCard')
    const scroller = sec.querySelector('.compare__tableScroller')
    return {
      title: h2.textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === h2.id,
      heads,
      rows,
      starFill: cs ? cs.fill : '-',
      starStroke: cs ? cs.color : '-',
      headerBg: getComputedStyle(sec.querySelector('thead tr')).backgroundColor,
      cardW: Math.round(card.getBoundingClientRect().width),
      scrolls: scroller.scrollWidth > scroller.clientWidth + 2,
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  }, sel)

  if (m.missing) {
    console.log(tag.padEnd(14), 'SECTION MISSING')
    await page.close()
    return
  }

  const totals = m.rows.map((r) => r.counts.join('/')).join('  ')
  console.log(
    tag.padEnd(14),
    `${width}x${height}`.padEnd(10),
    `rows ${m.rows.length}`.padEnd(8),
    `card ${m.cardW}`.padEnd(10),
    m.scrolls ? 'scrolls' : 'fits   ',
    '| header', m.headerBg.padEnd(18),
    '| ov', m.ov,
    '| err', errors.length || 'none',
  )
  if (errors.length) console.log('     ', errors.slice(0, 2))
  if (shot) {
    console.log('   title :', JSON.stringify(m.title), '| labelled', m.labelled)
    console.log('   heads :', m.heads.map((h) => JSON.stringify(h)).join(' | '))
    console.log('   star  : fill', m.starFill, 'stroke', m.starStroke)
    console.log('   stars drawn per row:', totals)
    for (const r of m.rows)
      console.log(`     ${r.feature.padEnd(18)} announced ${r.names.join('  /  ')}`)
    await page.screenshot({ path: `${out}/rate-${tag}.png` })
  }
  await page.close()
}

console.log('--- page 5: the new rating table ---')
await run('/stick-on-lifespan', '.rateCompare', 1440, 900, 'desktop', true)
await run('/stick-on-lifespan', '.rateCompare', 768, 1024, 'tablet', false)
await run('/stick-on-lifespan', '.rateCompare', 390, 844, 'mobile', true)
await run('/stick-on-lifespan', '.rateCompare', 360, 780, 'small', false)

console.log('\n--- page 3 comparison, must be unchanged ---')
await run('/hair-patch-vs-hair-system', '.patchCompare', 1440, 900, 'p3-desktop', false)
await run('/hair-patch-vs-hair-system', '.patchCompare', 390, 844, 'p3-mobile', false)

await browser.close()
