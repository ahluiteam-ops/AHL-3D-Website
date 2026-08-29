/* Verify "Some Of Our Clients With The Most Natural Hairline" on Page 3. */
import puppeteer from 'puppeteer-core'

const URL = 'http://127.0.0.1:5173/#/hair-patch-vs-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? '.'

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
  await new Promise((r) => setTimeout(r, 1800))

  console.log(`\n=== ${tag} (${width}x${height}${reduced ? ', reduced' : ''}) ===`)

  const base = await page.evaluate(() => {
    const order = [...document.querySelectorAll('main > section')].map(
      (s) => (s.className || '').toString().split(' ')[0],
    )
    const v = document.querySelector('.voices')
    if (!v) return { order, present: false }
    const r = v.getBoundingClientRect()
    return {
      order,
      present: true,
      pinned: v.classList.contains('is-pinned'),
      title: document.querySelector('.voices__title')?.textContent.trim(),
      cards: document.querySelectorAll('.voices__item').length,
      names: [...document.querySelectorAll('.voices__name')].map((n) => n.textContent.trim()),
      height: Math.round(r.height),
      top: Math.round(r.top + scrollY),
      railScrollable: (() => {
        const pin = document.querySelector('.voices__pin')
        return pin.scrollWidth > pin.clientWidth + 1
      })(),
    }
  })
  console.log('section order  :', base.order.join(' > '))
  console.log('voices         :', base.present ? `pinned=${base.pinned} cards=${base.cards} h=${base.height}` : 'MISSING')
  console.log('title          :', JSON.stringify(base.title))
  console.log('names          :', base.names.join(', '))
  if (!base.pinned) console.log('rail scrollable:', base.railScrollable)

  // Track travel through the pin.
  const travel = await page.evaluate(async (top) => {
    const track = document.querySelector('.voices__track')
    const sec = document.querySelector('.voices')
    const x = () => Math.round(new DOMMatrix(getComputedStyle(track).transform).m41)
    const samples = []
    const dist = sec.getBoundingClientRect().height - innerHeight
    for (const f of [0, 0.5, 1]) {
      scrollTo(0, top + Math.max(0, dist) * f)
      await new Promise((r) => setTimeout(r, 700))
      samples.push(x())
    }
    // Closing panel fully on screen at the end?
    const o = document.querySelector('.voices__outro').getBoundingClientRect()
    return { samples, outroRight: Math.round(o.right), vw: innerWidth, outroVisible: o.right <= innerWidth + 2 && o.left >= -2 }
  }, base.top)
  console.log('track x        :', travel.samples.join(' -> '))
  console.log('outro on screen:', travel.outroVisible, `(right ${travel.outroRight} vs vw ${travel.vw})`)

  const tail = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    // Do the two pinned sections hand off cleanly - no gap, no overlap?
    handoff: (() => {
      const c = document.querySelector('.checklist')?.getBoundingClientRect()
      const v = document.querySelector('.voices').getBoundingClientRect()
      const s = document.querySelector('.simplest')?.getBoundingClientRect()
      const r = (b) => (b ? [Math.round(b.top + scrollY), Math.round(b.bottom + scrollY)] : null)
      return { checklist: r(c), voices: r(v), simplest: r(s) }
    })(),
  }))
  console.log('page overflow  :', tail.overflow)
  const h = tail.handoff
  console.log('checklist      :', h.checklist?.join('..'), '| voices', h.voices.join('..'), '| simplest', h.simplest?.join('..'))
  if (h.checklist && h.simplest) {
    console.log('gaps           : checklist->voices', h.voices[0] - h.checklist[1], ', voices->simplest', h.simplest[0] - h.voices[1])
  }
  console.log('console errors :', errors.length ? errors.slice(0, 4) : 'none')

  await page.screenshot({ path: `${out}/p3-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(390, 844, false, 'mobile')
await run(1440, 900, true, 'reduced')
await browser.close()
