/* Car analogy on the Stick-On System Lifespan page.
 *   VERIFY_URL=http://127.0.0.1:4173 node scripts/verify-car-example.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = (process.env.VERIFY_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '')
const URL = `${BASE}/#/stick-on-lifespan`
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-car-example'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, tag, shot) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) =>
    errors.push(`REQ FAIL ${request.url()}`),
  )

  await page.setViewport({
    width,
    height,
    isMobile: width < 760,
    hasTouch: width < 760,
  })
  if (reduced) {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  }

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(() =>
    document.querySelector('.carExample')?.scrollIntoView({ block: 'center' }),
  )
  await new Promise((resolve) => setTimeout(resolve, reduced ? 250 : 1100))

  const beforeHover = await page.evaluate(() => {
    const surface = document.querySelector('.carExample__surface')
    const image = document.querySelector('.carExample__media img')
    return {
      surface: getComputedStyle(surface).transform,
      image: getComputedStyle(image).transform,
    }
  })

  await page.hover('.carExample__card:first-child .carExample__media')
  await new Promise((resolve) => setTimeout(resolve, 750))

  const afterHover = await page.evaluate(() => {
    const surface = document.querySelector('.carExample__surface')
    const image = document.querySelector('.carExample__media img')
    return {
      surface: getComputedStyle(surface).transform,
      image: getComputedStyle(image).transform,
    }
  })

  await page.mouse.move(0, 0)
  await new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 450))

  const metrics = await page.evaluate(() => {
    const section = document.querySelector('.carExample')
    if (!section) return { missing: true }
    const title = section.querySelector('h2')
    const cards = [...section.querySelectorAll('.carExample__card')]
    const images = [...section.querySelectorAll('img')]
    const grid = section.querySelector('.carExample__grid')
    const compare = document.querySelector('.rateCompare')

    return {
      title: title.getAttribute('aria-label'),
      labelled: section.getAttribute('aria-labelledby') === title.id,
      cards: cards.length,
      visibleCards: cards.filter(
        (card) => parseFloat(getComputedStyle(card).opacity) > 0.95,
      ).length,
      cardTitles: cards.map((card) =>
        card.querySelector('h3').textContent.replace(/\s+/g, ' ').trim(),
      ),
      formulas: cards.map((card) =>
        card.querySelector('.carExample__formula').textContent.trim(),
      ),
      pros: cards.map(
        (card) => card.querySelectorAll('.carExample__mark--pro').length,
      ),
      cons: cards.map(
        (card) => card.querySelectorAll('.carExample__mark--con').length,
      ),
      notes: cards.map((card) =>
        card.querySelector('.carExample__note').getAttribute('aria-label'),
      ),
      noteLineCounts: cards.map(
        (card) => card.querySelectorAll('.carExample__noteLine').length,
      ),
      noteTops: cards.map((card) =>
        Math.round(card.querySelector('.carExample__note').getBoundingClientRect().top),
      ),
      noteHeights: cards.map((card) =>
        Math.round(card.querySelector('.carExample__note').getBoundingClientRect().height),
      ),
      noteFonts: cards.map((card) =>
        parseFloat(getComputedStyle(card.querySelector('.carExample__note')).fontSize),
      ),
      sources: images.map((image) => new URL(image.src).pathname),
      imagesLoaded: images.every(
        (image) => image.complete && image.naturalWidth > 2000,
      ),
      cols: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      cardWidths: cards.map((card) => Math.round(card.getBoundingClientRect().width)),
      imageRatios: images.map((image) => {
        const rect = image.getBoundingClientRect()
        return +(rect.width / rect.height).toFixed(2)
      }),
      minFont: Math.min(
        ...[...section.querySelectorAll('p, li, h3, h4')]
          .map((element) => parseFloat(getComputedStyle(element).fontSize))
          .filter((size) => size > 0),
      ),
      immediatelyBeforeCompare:
        compare && section.nextElementSibling === compare,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }
  })

  if (metrics.missing) throw new Error(`${tag}: section missing`)
  if (metrics.title !== 'Car Example: Think Of It Like This Before Choosing')
    throw new Error(`${tag}: title mismatch`)
  if (!metrics.labelled) throw new Error(`${tag}: section is not labelled`)
  if (metrics.cards !== 2 || metrics.visibleCards !== 2)
    throw new Error(`${tag}: cards are missing or hidden`)
  if (metrics.pros.some((count) => count !== 2) || metrics.cons.some((count) => count !== 2))
    throw new Error(`${tag}: pros/cons counts are wrong`)
  if (metrics.noteLineCounts.some((count) => count !== 2))
    throw new Error(`${tag}: recommendation copy is not two lines`)
  if (
    metrics.notes[0] !==
      'Ideal for men who are okay with changing it every 3–4 months.' ||
    metrics.notes[1] !==
      'Perfect for men who are okay with compromising on realism.'
  )
    throw new Error(`${tag}: recommendation accessible names are wrong`)
  if (!metrics.imagesLoaded) throw new Error(`${tag}: source images did not load`)
  if (!metrics.immediatelyBeforeCompare)
    throw new Error(`${tag}: section is not immediately before the rating table`)
  if (metrics.overflow !== 0) throw new Error(`${tag}: horizontal overflow ${metrics.overflow}px`)
  if (metrics.minFont < 14) throw new Error(`${tag}: text fell below 14px`)
  if (width >= 1440 && metrics.noteFonts.some((size) => size < 15.9))
    throw new Error(`${tag}: recommendation text did not reach 16px`)
  if (metrics.cols === 2 && Math.abs(metrics.noteTops[0] - metrics.noteTops[1]) > 1)
    throw new Error(
      `${tag}: recommendation dividers are not aligned (${metrics.noteTops.join('/')}px)`,
    )
  if (metrics.cols === 2 && Math.abs(metrics.noteHeights[0] - metrics.noteHeights[1]) > 1)
    throw new Error(
      `${tag}: recommendation footers have different heights (${metrics.noteHeights.join('/')}px)`,
    )

  const expectsHover = width >= 760 && !reduced
  const hoverMoved =
    beforeHover.surface !== afterHover.surface &&
    beforeHover.image !== afterHover.image
  if (hoverMoved !== expectsHover)
    throw new Error(`${tag}: hover motion state is wrong`)

  console.log(
    tag.padEnd(9),
    `${width}x${height}`.padEnd(10),
    `cards ${metrics.visibleCards}/${metrics.cards}`.padEnd(11),
    `cols ${metrics.cols}`.padEnd(8),
    `widths ${metrics.cardWidths.join('/')}`.padEnd(19),
    `ratios ${metrics.imageRatios.join('/')}`.padEnd(17),
    `lines ${metrics.noteTops.join('/')}`.padEnd(17),
    `foot ${metrics.noteHeights.join('/')}`.padEnd(14),
    `type ${metrics.noteFonts.map((size) => size.toFixed(1)).join('/')}`.padEnd(16),
    `hover ${hoverMoved ? 'on' : 'off'}`.padEnd(10),
    '| minFont', metrics.minFont.toFixed(2),
    '| ov', metrics.overflow,
    '| err', errors.length || 'none',
  )

  if (errors.length) throw new Error(`${tag}: ${errors.join(' | ')}`)
  if (shot) {
    const section = await page.$('.carExample')
    await section.screenshot({ path: `${out}/car-example-${tag}.png` })
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
