/* "HD Exposed Hairline — Brush Back Hairstyle" — the scroll rail and its
 * keyboard/button contract.
 *   node scripts/verify-hd-exposed.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/will-my-hairline-look-real'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-hd'
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

  for (let i = 0; i < 9; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.hd')
      if (el) scrollBy(0, el.getBoundingClientRect().top - 60)
    })
    await new Promise((r) => setTimeout(r, 240))
  }
  await new Promise((r) => setTimeout(r, 1400))

  const base = await page.evaluate(() => {
    const sec = document.querySelector('.hd')
    const rail = sec.querySelector('.hd__rail')
    const cards = [...sec.querySelectorAll('.hd__card')]
    const btns = [...sec.querySelectorAll('.hd__btn')]
    const fonts = [...sec.querySelectorAll('p, h3, strong, span')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((n) => n > 0)
    return {
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      title: sec.querySelector('h2').textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === sec.querySelector('h2').id,
      cards: cards.length,
      cardsVisible: cards.filter((c) => parseFloat(getComputedStyle(c).opacity) > 0.95).length,
      railTabbable: rail.getAttribute('tabindex'),
      railLabel: rail.getAttribute('aria-label'),
      snap: getComputedStyle(rail).scrollSnapType,
      scrollBehavior: getComputedStyle(rail).scrollBehavior,
      scrollable: rail.scrollWidth > rail.clientWidth + 2,
      btnSizes: btns.map((b) => [Math.round(b.getBoundingClientRect().width), Math.round(b.getBoundingClientRect().height)]),
      controlsDisplay: getComputedStyle(sec.querySelector('.hd__controls')).display,
      liveRegion: !!sec.querySelector('[aria-live="polite"]'),
      liveText: sec.querySelector('[aria-live="polite"]')?.textContent.replace(/\s+/g, ' ').trim(),
      marks: cards.map((c) => getComputedStyle(c.querySelector('.hd__mark')).backgroundColor),
      minFont: Math.min(...fonts).toFixed(2),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  const state = () =>
    page.evaluate(() => {
      const sec = document.querySelector('.hd')
      const rail = sec.querySelector('.hd__rail')
      const btns = [...sec.querySelectorAll('.hd__btn')]
      return {
        left: Math.round(rail.scrollLeft),
        prevDisabled: btns[0].disabled,
        nextDisabled: btns[1].disabled,
        live: sec.querySelector('[aria-live="polite"]')?.textContent.replace(/\s+/g, ' ').trim(),
      }
    })

  const start = await state()
  /* Nothing overflows on a wide screen, so the controls are absent by design;
     clicking them would be testing a control the design says should not be
     there. */
  const hasControls = base.controlsDisplay !== 'none'
  let afterNext = start
  if (hasControls) {
    await page.evaluate(() => document.querySelectorAll('.hd__btn')[1].click())
    await new Promise((r) => setTimeout(r, 900))
    afterNext = await state()
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const b = document.querySelectorAll('.hd__btn')[1]
        if (!b.disabled) b.click()
      })
      await new Promise((r) => setTimeout(r, 700))
    }
  }
  const atEnd = await state()
  /* Keyboard: arrows scroll a focused horizontal container. `Home`/`End` do
     not — that is browser behaviour, and testing them wrongly reports the rail
     as keyboard-unreachable. */
  await page.evaluate(() => {
    const rail = document.querySelector('.hd__rail')
    rail.scrollLeft = 0
    rail.focus()
  })
  await new Promise((r) => setTimeout(r, 400))
  const focused = await page.evaluate(
    () => document.activeElement?.className === 'hd__rail',
  )
  await page.keyboard.press('ArrowRight')
  await new Promise((r) => setTimeout(r, 700))
  const afterKey = await state()

  console.log(
    tag.padEnd(9),
    `${width}x${height}`.padEnd(10),
    `cards ${base.cardsVisible}/${base.cards}`.padEnd(12),
    (base.scrollable ? 'scrollable' : 'fits').padEnd(11),
    `controls ${base.controlsDisplay === 'none' ? 'hidden' : 'shown'}`.padEnd(16),
    `| snap ${base.snap}`.padEnd(20),
    `| btns ${base.btnSizes.map((b) => b.join('x')).join(' ')}`.padEnd(20),
    '| minFont', base.minFont, base.minFont >= 14 ? 'OK' : 'UNDER',
    '| ov', base.overflow,
    '| errors', errors.length || 'none',
  )
  console.log(
    '          scroll',
    `${start.left}->${afterNext.left}->${atEnd.left}`.padEnd(20),
    '| prev off at start', String(start.prevDisabled).padEnd(5),
    '| next off at end', String(atEnd.nextDisabled).padEnd(5),
    '| rail focusable', String(focused).padEnd(5),
    '| ArrowRight moved it', afterKey.left > 0,
  )
  if (errors.length) console.log('     ', errors.slice(0, 2))
  if (tag === 'desktop') {
    console.log('   order   :', base.order.join(' > '))
    console.log('   title   :', JSON.stringify(base.title), '| labelled', base.labelled)
    console.log('   rail    : tabindex', base.railTabbable, '| label', JSON.stringify(base.railLabel))
    console.log('   behavior:', base.scrollBehavior, '| live region', base.liveRegion, JSON.stringify(atEnd.live))
    console.log('   marks   :', base.marks.join(' '))
  }
  await page.screenshot({ path: `${out}/hd-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(360, 780, false, 'small')
await run(1440, 900, true, 'reduced')
await browser.close()
