/* "The Truth Behind Ultra Natural Hairline" — grid, word wipe, reduced motion.
 *   node scripts/verify-hairline-truth.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/will-my-hairline-look-real'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-truth'
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
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  const before = await page.evaluate(() => {
    const el = document.querySelector('.truth__in')
    return el ? el.getAttribute('data-shown') : 'MISSING'
  })

  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.truth')
      if (el) scrollBy(0, el.getBoundingClientRect().top - 60)
    })
    await new Promise((r) => setTimeout(r, 250))
  }
  await new Promise((r) => setTimeout(r, 1500))

  const m = await page.evaluate(() => {
    const sec = document.querySelector('.truth')
    const items = [...sec.querySelectorAll('.truth__item')]
    const words = [...sec.querySelectorAll('.truth__word')]
    const last = items[items.length - 1]
    const h = sec.querySelector('h2')
    const fonts = [...sec.querySelectorAll('p, strong, span')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((n) => n > 0)
    return {
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      shown: document.querySelector('.truth__in').getAttribute('data-shown'),
      title: h.textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === h.id,
      items: items.length,
      cols: getComputedStyle(sec.querySelector('.truth__grid')).gridTemplateColumns.split(' ').length,
      bolds: sec.querySelectorAll('.truth__copy strong').length,
      /* Every word should have finished its rise. */
      wordsRisen: words.filter((w) => {
        const t = getComputedStyle(w).transform
        return t === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(t)
      }).length,
      totalWords: words.length,
      itemsVisible: items.filter((i) => parseFloat(getComputedStyle(i).opacity) > 0.95).length,
      lastSpans: getComputedStyle(last).gridColumn,
      lastWidth: Math.round(last.getBoundingClientRect().width),
      itemWidth: Math.round(items[0].getBoundingClientRect().width),
      checkBg: getComputedStyle(sec.querySelector('.truth__check')).backgroundColor,
      minFont: Math.min(...fonts).toFixed(2),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  console.log(
    tag.padEnd(9),
    `${width}x${height}`.padEnd(10),
    `cols ${m.cols}`.padEnd(8),
    `items ${m.itemsVisible}/${m.items}`.padEnd(12),
    `words ${m.wordsRisen}/${m.totalWords}`.padEnd(12),
    `reveal ${before}\u2192${m.shown}`.padEnd(18),
    `last ${m.lastWidth}px vs ${m.itemWidth}px`.padEnd(22),
    '| minFont', m.minFont, m.minFont >= 14 ? 'OK' : 'UNDER',
    '| ov', m.overflow,
    '| errors', errors.length || 'none',
  )
  if (errors.length) console.log('    ', errors.slice(0, 2))
  if (tag === 'desktop') {
    console.log('   order :', m.order.join(' > '))
    console.log('   title :', JSON.stringify(m.title))
    console.log('   bolds :', m.bolds, '| labelled', m.labelled, '| check', m.checkBg)
  }
  await page.screenshot({ path: `${out}/truth-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(360, 780, false, 'small')
await run(1440, 900, true, 'reduced')
await browser.close()
