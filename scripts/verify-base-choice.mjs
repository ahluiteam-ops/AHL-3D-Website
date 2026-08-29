/* "Still Confused Between Bases?" — the two self-assessment cards.
 *   node scripts/verify-base-choice.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/stick-on-lifespan'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-choice'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, tag, shot) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => errors.push('REQ FAIL ' + r.url()))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1600))

  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.baseChoice')
      if (el) scrollBy(0, Math.max(0, el.getBoundingClientRect().top - 60))
    })
    await new Promise((r) => setTimeout(r, 200))
  }
  await new Promise((r) => setTimeout(r, 900))

  const base = await page.evaluate(() => {
    const sec = document.querySelector('.baseChoice')
    if (!sec) return { missing: true }
    const cards = [...sec.querySelectorAll('.baseChoice__card')]
    const h2 = sec.querySelector('h2')
    const fonts = [...sec.querySelectorAll('p, span, legend, h3')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((n) => n > 0)
    return {
      title: h2.textContent.trim(),
      labelled: sec.getAttribute('aria-labelledby') === h2.id,
      cards: cards.length,
      visible: cards.filter((c) => parseFloat(getComputedStyle(c).opacity) > 0.95).length,
      /* The interaction was removed by request: no controls, no tally, and the
         `fieldset`/`legend`/live-region scaffolding that served them should be
         gone too rather than left describing nothing. */
      inputs: sec.querySelectorAll('input').length,
      legends: sec.querySelectorAll('legend').length,
      live: sec.querySelectorAll('[aria-live]').length,
      tallies: sec.querySelectorAll('.baseChoice__tally').length,
      lists: sec.querySelectorAll('ul').length,
      items: sec.querySelectorAll('.baseChoice__item').length,
      dots: sec.querySelectorAll('.baseChoice__dot').length,
      prompts: [...sec.querySelectorAll('.baseChoice__prompt')].map((p) => p.textContent.trim()),
      /* The blue cap was removed; assert it stays removed, and that the
         `overflow: hidden` which only existed to clip it went with it. */
      caps: cards.filter((c) => getComputedStyle(c, '::before').content !== 'none').length,
      cardOverflow: getComputedStyle(cards[0]).overflow,
      cardRadius: getComputedStyle(cards[0]).borderRadius,
      cols: getComputedStyle(sec.querySelector('.baseChoice__grid')).gridTemplateColumns.split(' ').length,
      minFont: Math.min(...fonts).toFixed(2),
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  if (base.missing) {
    console.log(tag.padEnd(11), 'SECTION MISSING')
    await page.close()
    return
  }

  console.log(
    tag.padEnd(11),
    `${width}x${height}`.padEnd(10),
    `cards ${base.visible}/${base.cards}`.padEnd(11),
    `cols ${base.cols}`.padEnd(8),
    `lists ${base.lists} items ${base.items} dots ${base.dots}`.padEnd(26),
    `leftovers inputs ${base.inputs} legends ${base.legends} live ${base.live} tally ${base.tallies} caps ${base.caps}`.padEnd(58),
    '| minFont', base.minFont,
    '| ov', base.ov,
    '| err', errors.length || 'none',
  )
  if (errors.length) console.log('     ', errors.slice(0, 2))
  if (shot) {
    console.log('   title  :', JSON.stringify(base.title), '| labelled', base.labelled)
    console.log('   prompts:', base.prompts.join(' | '))
    console.log(
      '   card   : caps', base.caps, '| overflow', base.cardOverflow,
      '| radius', base.cardRadius,
    )
    await page.screenshot({ path: `${out}/choice-${tag}.png` })
  }
  await page.close()
}

await run(1440, 900, false, 'desktop', true)
await run(1100, 900, false, 'laptop', false)
await run(768, 1024, false, 'tablet', false)
await run(390, 844, false, 'mobile', true)
await run(360, 780, false, 'small', false)
await run(1440, 900, true, 'reduced', false)
await browser.close()
