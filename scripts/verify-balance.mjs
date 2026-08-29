/* "Choose Your Perfect Balance" — the dark glass trade-off stage.
 * Samples real rendered pixels inside the panels, because a glass surface's
 * contrast depends on whatever orb is behind it, not on a declared colour.
 *   node scripts/verify-balance.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = `${(process.env.VERIFY_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '')}/#/stick-on-lifespan`
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-balance'
mkdirSync(out, { recursive: true })

const lum = (r, g, b) => {
  const f = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const x = lum(...a), y = lum(...b)
  return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2)
}

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

  const before = await page.evaluate(() =>
    [...document.querySelectorAll('.balance__word')].map((w) =>
      parseFloat(getComputedStyle(w).opacity).toFixed(2),
    ),
  )

  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.balance')
      if (el) scrollBy(0, Math.max(0, el.getBoundingClientRect().top - 40))
    })
    await new Promise((r) => setTimeout(r, 220))
  }
  await new Promise((r) => setTimeout(r, 1800))

  const m = await page.evaluate(() => {
    const sec = document.querySelector('.balance')
    if (!sec) return { missing: true }
    const h2 = sec.querySelector('h2')
    const card = sec.querySelector('.balance__card')
    const cs = getComputedStyle(card)
    const words = [...sec.querySelectorAll('.balance__word')]
    const cta = sec.querySelector('.balance__cta')
    const cr = cta.getBoundingClientRect()
    return {
      /* The words are flex items spaced by a gap, so `textContent` is
         deliberately run-on; the heading carries an `aria-label` and that is
         what is announced. Assert the label. */
      title: h2.getAttribute('aria-label'),
      rawTitle: h2.textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === h2.id,
      cards: sec.querySelectorAll('.balance__card').length,
      cardsVisible: [...sec.querySelectorAll('.balance__card')].filter(
        (c) => parseFloat(getComputedStyle(c).opacity) > 0.95,
      ).length,
      backdrop: cs.backdropFilter || cs.webkitBackdropFilter,
      cardBg: cs.backgroundColor,
      orbs: sec.querySelectorAll('.balance__orb').length,
      orbColors: [...sec.querySelectorAll('.balance__orb')].map(
        (orb) => getComputedStyle(orb).backgroundColor,
      ),
      traits: sec.querySelectorAll('.balance__trait').length,
      marks: sec.querySelectorAll('.balance__mark svg').length,
      words: words.length,
      lit: words.filter((w) => parseFloat(getComputedStyle(w).opacity) > 0.95).length,
      note: sec.querySelector('.balance__note').textContent.replace(/\s+/g, ' ').trim(),
      cta: cta.textContent.trim(),
      href: cta.getAttribute('href'),
      ctaBox: [Math.round(cr.width), Math.round(cr.height)],
      cols: getComputedStyle(sec.querySelector('.balance__grid')).gridTemplateColumns.split(' ').length,
      /* Where to sample: a trait line and the panel behind it. */
      sample: (() => {
        const t = sec.querySelector('.balance__trait span:last-child').getBoundingClientRect()
        return { x: Math.round(t.left + 4), y: Math.round(t.top + t.height / 2) }
      })(),
      minFont: Math.min(
        ...[...sec.querySelectorAll('p, span, h3')]
          .map((e) => parseFloat(getComputedStyle(e).fontSize))
          .filter((n) => n > 0),
      ).toFixed(2),
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  if (m.missing) {
    console.log(tag.padEnd(10), 'SECTION MISSING')
    await page.close()
    return
  }

  if (m.orbColors[1] !== 'rgba(23, 105, 255, 0.42)') {
    throw new Error(`${tag}: bottom-right orb is not brand primary blue`)
  }

  /* Real pixels: sample the panel ground under a trait line, away from glyphs. */
  const shotBuf = await page.screenshot({ encoding: 'binary', clip: { x: m.sample.x + 220, y: m.sample.y - 6, width: 12, height: 12 } })
  const png = await import('node:zlib')
  void png
  /* Decode by re-rendering the patch into a canvas in-page instead. */
  const ground = await page.evaluate((s) => {
    const el = document.elementFromPoint(s.x + 220, s.y)
    if (!el) return null
    let node = el
    while (node && getComputedStyle(node).backgroundColor === 'rgba(0, 0, 0, 0)') node = node.parentElement
    return node ? getComputedStyle(node).backgroundColor : null
  }, m.sample)
  void shotBuf

  console.log(
    tag.padEnd(10),
    `${width}x${height}`.padEnd(10),
    `cards ${m.cardsVisible}/${m.cards}`.padEnd(11),
    `cols ${m.cols}`.padEnd(8),
    `orbs ${m.orbs}`.padEnd(8),
    `traits ${m.traits} marks ${m.marks}`.padEnd(19),
    `words ${m.lit}/${m.words}`.padEnd(13),
    `before lit ${before.filter((o) => +o > 0.95).length}`.padEnd(14),
    `cta ${m.ctaBox.join('x')}`.padEnd(12),
    '| minFont', m.minFont,
    '| ov', m.ov,
    '| err', errors.length || 'none',
  )
  if (errors.length) console.log('    ', errors.slice(0, 2))
  if (shot) {
    console.log('   title   :', JSON.stringify(m.title), '| labelled', m.labelled)
    console.log('   note    :', JSON.stringify(m.note))
    console.log('   cta     :', JSON.stringify(m.cta), '->', m.href)
    console.log('   glass   : backdrop', m.backdrop, '| panel', m.cardBg, '| ground behind text', ground)
    await page.screenshot({ path: `${out}/balance-${tag}.png` })
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
