/* Check for the three sections added together: "Real Hair Or Illusion?",
 * "Our Trusted Methods For A Natural Look", and the guidance form.
 * Run from inside the project tree so `puppeteer-core` resolves.
 *   node scripts/verify-three.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-three'
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

const round = (n) => Math.round(n)

const probeDecide = () => {
  const card = document.querySelector('.decide__card')
  const stage = document.querySelector('.decide__stage')
  const r = (n) => Math.round(n)
  return {
    tag: card.tagName,
    cardBox: [r(card.getBoundingClientRect().width), r(card.getBoundingClientRect().height)],
    stageWidth: r(stage.getBoundingClientRect().width),
    perspective: getComputedStyle(stage).perspective,
    /* The tilt is written as custom properties, not as a transform, so the
       card can carry both it and its own shadow change. */
    tilt: [
      stage.style.getPropertyValue('--rx') || '0deg',
      stage.style.getPropertyValue('--ry') || '0deg',
    ],
    cardTransform: getComputedStyle(card).transform,
    poster: (() => {
      const i = document.querySelector('.decide__poster')
      return `${i.naturalWidth}x${i.naturalHeight}`
    })(),
    play: !!document.querySelector('.decide__play'),
    note: document.querySelector('.decide__note').textContent.trim().length,
  }
}

const probeMethods = () => {
  const items = [...document.querySelectorAll('.methods__item')]
  const r = (n) => Math.round(n)
  const media = document.querySelector('.methods__media').getBoundingClientRect()
  return {
    count: items.length,
    open: items.map((i) => i.dataset.open),
    expanded: items.map((i) =>
      i.querySelector('.methods__head').getAttribute('aria-expanded'),
    ),
    bodyHeights: items.map((i) =>
      r(i.querySelector('.methods__bodyIn').getBoundingClientRect().height),
    ),
    titles: items.map((i) => i.querySelector('.methods__head > span').textContent.trim()),
    /* The media column is portrait, not a landscape crop of a portrait file. */
    mediaBox: [r(media.width), r(media.height)],
    mediaLoaded: (() => {
      const i = document.querySelector('.methods__media img')
      return `${i.naturalWidth}x${i.naturalHeight}`
    })(),
  }
}

const probeForm = () => {
  const rows = [...document.querySelectorAll('.form__row')]
  return {
    rows: rows.length,
    labels: rows.map((r) => r.querySelector('label').textContent.trim()),
    errors: rows.map((r) => r.dataset.error),
    errorTexts: [...document.querySelectorAll('.form__error')].map((e) =>
      e.textContent.trim(),
    ),
    /* Every visible error must be tied to its own input. */
    described: rows.map((r) => {
      const input = r.querySelector('input, select')
      const id = input.getAttribute('aria-describedby')
      return id ? !!document.getElementById(id) : null
    }),
    cities: [...document.querySelectorAll('.form__row select option')].map(
      (o) => o.value,
    ),
    done: !!document.querySelector('.form__done'),
    doneRole: document.querySelector('.form__done')?.getAttribute('role') ?? null,
  }
}

async function run(width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => failed.push(r.url()))
  await page.setViewport({ width, height })
  if (reduced)
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 700))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)

  for (const [name, sel] of [
    ['decide', '.decide'],
    ['methods', '.methods'],
    ['form', '.form'],
  ]) {
    const box = await page.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect()
      return { top: r.top + scrollY, height: r.height }
    }, sel)
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      box.top - Math.max(0, (height - box.height) / 2),
    )
    await new Promise((r) => setTimeout(r, 1100))
    console.log(`${name} height`, Math.round(box.height))
    await page.screenshot({ path: `${outDir}/${tag}-${name}.png` })
  }

  // ---- Decide: hover writes the tilt, leaving resets it.
  await page.evaluate(() => {
    const r = document.querySelector('.decide').getBoundingClientRect()
    window.scrollTo(0, r.top + scrollY - 60)
  })
  await new Promise((r) => setTimeout(r, 900))
  console.log('decide at rest', JSON.stringify(await page.evaluate(probeDecide)))
  const stage = await page.$('.decide__stage')
  const sb = await stage.boundingBox()
  await page.mouse.move(sb.x + sb.width * 0.2, sb.y + sb.height * 0.25)
  await new Promise((r) => setTimeout(r, 700))
  console.log('decide hovered', JSON.stringify(await page.evaluate(probeDecide)))

  // ---- Methods: the accordion answers clicks and closes what was open.
  await page.evaluate(() => {
    const r = document.querySelector('.methods').getBoundingClientRect()
    window.scrollTo(0, r.top + scrollY - 60)
  })
  await new Promise((r) => setTimeout(r, 900))
  console.log('methods at rest', JSON.stringify(await page.evaluate(probeMethods)))
  await page.evaluate(() => document.querySelectorAll('.methods__head')[1].click())
  await new Promise((r) => setTimeout(r, 900))
  console.log('methods open #2', JSON.stringify(await page.evaluate(probeMethods)))

  // ---- Form: empty submit must fail with errors bound to their inputs.
  await page.evaluate(() => {
    const r = document.querySelector('.form').getBoundingClientRect()
    window.scrollTo(0, r.top + scrollY - 60)
  })
  await new Promise((r) => setTimeout(r, 900))
  await page.evaluate(() => document.querySelector('.form__submit').click())
  await new Promise((r) => setTimeout(r, 600))
  console.log('form empty submit', JSON.stringify(await page.evaluate(probeForm)))

  // A bad phone number must be caught; a good one must clear as it is fixed.
  await page.evaluate(() => {
    const set = (sel, value) => {
      const el = document.querySelector(sel)
      const proto = el instanceof HTMLSelectElement ? HTMLSelectElement : HTMLInputElement
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, value)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    set('.form__row input[name="name"]', 'Rahul Mehta')
    set('.form__row input[name="phone"]', '9876')
    set('.form__row select', 'Mumbai')
  })
  await new Promise((r) => setTimeout(r, 500))
  console.log('form short phone', JSON.stringify(await page.evaluate(probeForm)))

  await page.evaluate(() => {
    const el = document.querySelector('.form__row input[name="phone"]')
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(
      el,
      '+91 98765 43210',
    )
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await new Promise((r) => setTimeout(r, 400))
  await page.evaluate(() => document.querySelector('.form__submit').click())
  await new Promise((r) => setTimeout(r, 700))
  console.log('form valid submit', JSON.stringify(await page.evaluate(probeForm)))
  await page.screenshot({ path: `${outDir}/${tag}-form-done.png` })

  console.log(
    'overflow',
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  )
  console.log('console errors:', errors.length ? errors : 'none')
  console.log('failed requests:', failed.length ? failed : 'none')
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
