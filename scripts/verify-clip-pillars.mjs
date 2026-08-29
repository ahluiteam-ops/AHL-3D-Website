/* Check the portrait cards in "A Hair System Gives You Three Things".
 * Run while Vite is serving the project:
 *   node scripts/verify-clip-pillars.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/clip-on-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outDir = process.argv[2] ?? './.tmp-clip-pillars'
const expectedSourceSizes = [
  [2232, 1396],
  [880, 870],
  [1604, 1396],
]
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})

async function run(width, height, tag, expectedColumns) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.setViewport({ width, height })
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await new Promise((resolve) => setTimeout(resolve, 1200))
  const found = await page.evaluate(() => {
    const section = document.querySelector('.pillars3')
    section?.scrollIntoView({ block: 'center' })
    return Boolean(section)
  })
  if (!found) throw new Error(`${tag}: .pillars3 did not render`)
  await new Promise((resolve) => setTimeout(resolve, 700))

  const result = await page.evaluate(() => {
    const round = (value) => Math.round(value * 100) / 100
    const cards = [...document.querySelectorAll('.pillars3__card')]
    const arts = [...document.querySelectorAll('.pillars3__art')]
    const photos = [...document.querySelectorAll('.pillars3__photo')]
    const grid = document.querySelector('.pillars3__grid')
    const inner = document.querySelector('.pillars3__in')
    const title = document.querySelector('.pillars3__title')

    return {
      title: title.textContent.replace(/\s+/g, ' ').trim(),
      innerWidth: round(inner.getBoundingClientRect().width),
      columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      cards: cards.map((card) => {
        const box = card.getBoundingClientRect()
        return { width: round(box.width), height: round(box.height) }
      }),
      arts: arts.map((art) => {
        const box = art.getBoundingClientRect()
        return { width: round(box.width), height: round(box.height) }
      }),
      photos: photos.map((photo) => ({
        naturalWidth: photo.naturalWidth,
        naturalHeight: photo.naturalHeight,
        objectFit: getComputedStyle(photo).objectFit,
        objectPosition: getComputedStyle(photo).objectPosition,
      })),
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }
  })

  if (result.title !== 'A Hair System Gives You Three Things Every Man Wants:')
    throw new Error(`${tag}: heading text is malformed: ${result.title}`)
  if (result.columns !== expectedColumns)
    throw new Error(`${tag}: expected ${expectedColumns} columns, got ${result.columns}`)
  if (result.overflow !== 0)
    throw new Error(`${tag}: horizontal overflow is ${result.overflow}px`)
  if (result.photos.some((photo) => photo.objectFit !== 'contain'))
    throw new Error(`${tag}: a pillar photograph is still cropped`)
  if (result.photos.some((photo, index) => {
    const [width, height] = expectedSourceSizes[index]
    return photo.naturalWidth !== width || photo.naturalHeight !== height
  }))
    throw new Error(`${tag}: a pillar source dimension is wrong`)
  if (expectedColumns === 3 && result.innerWidth > 1001)
    throw new Error(`${tag}: portrait row widened to ${result.innerWidth}px`)
  if (tag === 'desktop' && result.cards.some((card) => card.width < 310))
    throw new Error(`${tag}: cards did not gain enough width`)
  if (tag === 'desktop' && result.arts.some((art) => art.height > 261))
    throw new Error(`${tag}: wider cards enlarged the approved photographs`)
  if (tag === 'phone' && result.arts.some((art) => art.height > 271))
    throw new Error(`${tag}: stacked photograph remains too tall`)
  if (errors.length) throw new Error(`${tag}: console errors: ${errors.join(' | ')}`)
  if (failed.length) throw new Error(`${tag}: failed requests: ${failed.join(' | ')}`)

  const section = await page.$('.pillars3')
  await section.screenshot({ path: `${outDir}/${tag}.png` })
  console.log(tag, JSON.stringify(result))
  await page.close()
}

await run(1440, 900, 'desktop', 3)
await run(768, 900, 'tablet', 3)
await run(390, 844, 'phone', 1)
await browser.close()
