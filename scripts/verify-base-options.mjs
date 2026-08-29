/* "Two Base Options For Your Stick-On Hair System".
 * Verifies card layout, both accessible dialogs, focus/scroll behavior, assets,
 * responsive columns, motion preferences, and placement above CarExample.
 *   VERIFY_URL=http://127.0.0.1:4173 node scripts/verify-base-options.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = (process.env.VERIFY_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '')
const URL = `${BASE}/#/stick-on-lifespan`
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-base-options'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, reduced, tag, screenshots = false) {
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
    document.querySelector('.baseOptions')?.scrollIntoView({ block: 'center' }),
  )
  await new Promise((resolve) => setTimeout(resolve, reduced ? 250 : 1000))

  const beforeHover = await page.$eval(
    '.baseOptions__card',
    (card) => getComputedStyle(card).transform,
  )
  await page.hover('.baseOptions__card:first-child')
  await new Promise((resolve) => setTimeout(resolve, 500))
  const afterHover = await page.$eval(
    '.baseOptions__card',
    (card) => getComputedStyle(card).transform,
  )
  await page.mouse.move(0, 0)

  const closed = await page.evaluate(() => {
    const section = document.querySelector('.baseOptions')
    if (!section) return { missing: true }
    const cards = [...section.querySelectorAll('.baseOptions__card')]
    const images = [...section.querySelectorAll('.baseOptions__cardArt img')]
    const grid = section.querySelector('.baseOptions__grid')
    const car = document.querySelector('.carExample')
    const sectionTitle = section.querySelector('h2')

    return {
      title: sectionTitle.getAttribute('aria-label'),
      labelled: section.getAttribute('aria-labelledby') === sectionTitle.id,
      cards: cards.length,
      tags: cards.map((card) => card.querySelector('.baseOptions__tag').textContent.trim()),
      titles: cards.map((card) => card.querySelector('.baseOptions__cardTitle').textContent.trim()),
      sources: images.map((image) => new URL(image.src).pathname),
      imagesLoaded: images.every(
        (image) => image.complete && image.naturalWidth >= 1088,
      ),
      expanded: cards.map((card) => card.getAttribute('aria-expanded')),
      plusSizes: cards.map((card) => {
        const rect = card.querySelector('.baseOptions__plus').getBoundingClientRect()
        return [Math.round(rect.width), Math.round(rect.height)]
      }),
      cardWidths: cards.map((card) => Math.round(card.getBoundingClientRect().width)),
      cardHeights: cards.map((card) => Math.round(card.getBoundingClientRect().height)),
      cols: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      immediatelyBeforeCar: car && section.nextElementSibling === car,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }
  })

  if (closed.missing) throw new Error(`${tag}: section missing`)
  if (closed.title !== 'Two Base Options For Your Stick-On Hair System')
    throw new Error(`${tag}: section title mismatch`)
  if (!closed.labelled) throw new Error(`${tag}: section is not labelled`)
  if (closed.cards !== 2) throw new Error(`${tag}: expected two cards`)
  if (closed.tags.join('|') !== '1st Option|2nd Option')
    throw new Error(`${tag}: option tags mismatch`)
  if (
    closed.titles.join('|') !==
    'Thin Base + Low Density|Thick Base + High Density'
  )
    throw new Error(`${tag}: option titles mismatch`)
  if (!closed.imagesLoaded) throw new Error(`${tag}: card images did not load`)
  if (!closed.immediatelyBeforeCar)
    throw new Error(`${tag}: section is not immediately above CarExample`)
  if (closed.plusSizes.some(([w, h]) => w < 44 || h < 44))
    throw new Error(`${tag}: plus target fell below 44px`)
  if (closed.overflow !== 0)
    throw new Error(`${tag}: closed page overflow ${closed.overflow}px`)
  const expectedCols = width > 760 ? 2 : 1
  if (closed.cols !== expectedCols)
    throw new Error(`${tag}: expected ${expectedCols} columns, got ${closed.cols}`)

  const hoverMoved = beforeHover !== afterHover
  const expectsHover = width >= 760 && !reduced
  if (hoverMoved !== expectsHover)
    throw new Error(`${tag}: card hover motion state is wrong`)

  if (screenshots) {
    const section = await page.$('.baseOptions')
    await section.screenshot({ path: `${out}/base-options-${tag}-closed.png` })
  }

  async function openAndMeasure(index) {
    await page.click(
      `.baseOptions__cardShell:nth-child(${index + 1}) .baseOptions__card`,
    )
    await new Promise((resolve) => setTimeout(resolve, reduced ? 100 : 800))
    return page.evaluate(() => {
      const dialog = document.querySelector('.baseOptions__sheet')
      const image = dialog.querySelector('.baseOptions__sheetArt img')
      const title = dialog.querySelector('.baseOptions__sheetTitle')
      const rect = dialog.getBoundingClientRect()
      return {
        size: [Math.round(rect.width), Math.round(rect.height)],
        role: dialog.getAttribute('role'),
        modal: dialog.getAttribute('aria-modal'),
        labelled: dialog.getAttribute('aria-labelledby') === title.id,
        title: title.textContent.replace(/\s+/g, ' ').trim(),
        points: dialog.querySelectorAll('.baseOptions__item').length,
        source: new URL(image.src).pathname,
        imageLoaded: image.complete && image.naturalWidth >= 1077,
        focus: document.activeElement?.className || '',
        rootOverflow: document.documentElement.style.overflow,
        expanded: [...document.querySelectorAll('.baseOptions__card')].map(
          (card) => card.getAttribute('aria-expanded'),
        ),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      }
    })
  }

  const first = await openAndMeasure(0)
  if (
    first.role !== 'dialog' ||
    first.modal !== 'true' ||
    !first.labelled ||
    first.focus !== 'benefits__close'
  )
    throw new Error(`${tag}: first dialog accessibility contract failed`)
  if (first.points !== 3 || first.source !== '/base-options/first-option-overlay.png')
    throw new Error(`${tag}: first dialog content mismatch`)
  if (!first.imageLoaded || first.rootOverflow !== 'hidden' || first.overflow !== 0)
    throw new Error(`${tag}: first dialog media, scroll lock, or overflow failed`)

  await page.keyboard.press('Tab')
  const trapped = await page.$eval(
    '.baseOptions__sheet',
    () => document.activeElement?.className || '',
  )
  if (trapped !== 'benefits__close') throw new Error(`${tag}: focus escaped dialog`)

  if (screenshots) {
    await page.screenshot({ path: `${out}/base-options-${tag}-first.png` })
  }

  await page.keyboard.press('Escape')
  await new Promise((resolve) => setTimeout(resolve, reduced ? 100 : 650))
  const firstClosed = await page.evaluate(() => ({
    dialog: !!document.querySelector('.baseOptions__sheet'),
    focus: document.activeElement?.className || '',
    rootOverflow: document.documentElement.style.overflow,
  }))
  if (
    firstClosed.dialog ||
    firstClosed.focus !== 'baseOptions__card' ||
    firstClosed.rootOverflow !== ''
  )
    throw new Error(`${tag}: Escape close or focus return failed`)

  const second = await openAndMeasure(1)
  if (second.points !== 2 || second.source !== '/base-options/second-option-overlay.png')
    throw new Error(`${tag}: second dialog content mismatch`)
  if (!second.imageLoaded || second.expanded.join('|') !== 'false|true')
    throw new Error(`${tag}: second dialog image or expanded state failed`)

  if (screenshots) {
    await page.screenshot({ path: `${out}/base-options-${tag}-second.png` })
  }

  await page.mouse.click(4, 4)
  await new Promise((resolve) => setTimeout(resolve, reduced ? 100 : 650))
  const finalState = await page.evaluate(() => ({
    dialog: !!document.querySelector('.baseOptions__sheet'),
    focus: document.activeElement?.className || '',
    rootOverflow: document.documentElement.style.overflow,
  }))
  if (
    finalState.dialog ||
    finalState.focus !== 'baseOptions__card' ||
    finalState.rootOverflow !== ''
  )
    throw new Error(`${tag}: scrim close or second focus return failed`)

  console.log(
    tag.padEnd(9),
    `${width}x${height}`.padEnd(10),
    `cols ${closed.cols}`.padEnd(8),
    `cards ${closed.cardWidths.join('/')}x${closed.cardHeights.join('/')}`.padEnd(27),
    `sheets ${first.size.join('x')}/${second.size.join('x')}`.padEnd(27),
    `points ${first.points}/${second.points}`.padEnd(12),
    `hover ${hoverMoved ? 'on' : 'off'}`.padEnd(10),
    '| ov', closed.overflow,
    '| err', errors.length || 'none',
  )

  if (errors.length) throw new Error(`${tag}: ${errors.join(' | ')}`)
  await page.close()
}

await run(1440, 900, false, 'desktop', true)
await run(1100, 900, false, 'laptop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile', true)
await run(360, 780, false, 'small')
await run(1440, 900, true, 'reduced')
await browser.close()
