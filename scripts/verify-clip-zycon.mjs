/* Clip-On Hair System Zycon card and dialog.
 *   node scripts/verify-clip-zycon.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/clip-on-hair-system'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-clip-zycon'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, tag) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))
  await page.setViewport({ width, height, isMobile: width <= 760, hasTouch: width <= 760 })
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(() => document.querySelector('.zyconRange')?.scrollIntoView())
  await new Promise((resolve) => setTimeout(resolve, 900))

  const closed = await page.evaluate(() => {
    const section = document.querySelector('.zyconRange')
    const card = section?.querySelector('.zyconRange__card')
    const button = section?.querySelector('.zyconRange__open')
    const plus = section?.querySelector('.zyconRange__plus')
    const images = [...(section?.querySelectorAll('img') ?? [])]
    const order = [...document.querySelectorAll('main > section')].map((item) =>
      item.className.split(' ')[0],
    )
    if (!(section && card && button && plus)) return null
    const sectionIndex = order.indexOf('zyconRange')
    return {
      orderBefore: order[sectionIndex - 1],
      orderAfter: order[sectionIndex + 1],
      title: section.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim(),
      cardWidth: Math.round(card.getBoundingClientRect().width),
      cardHeight: Math.round(card.getBoundingClientRect().height),
      buttonWidth: Math.round(button.getBoundingClientRect().width),
      buttonHeight: Math.round(button.getBoundingClientRect().height),
      plusWidth: Math.round(plus.getBoundingClientRect().width),
      plusHeight: Math.round(plus.getBoundingClientRect().height),
      imageSizes: images.map((image) => [image.naturalWidth, image.naturalHeight]),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  if (!closed) throw new Error(`${tag}: Zycon section is missing`)
  if (closed.orderBefore !== 'truth' || closed.orderAfter !== 'compare')
    throw new Error(`${tag}: wrong section order: ${closed.orderBefore} / ${closed.orderAfter}`)
  if (closed.title !== 'Premium Clip-On With Medicated Hygiene')
    throw new Error(`${tag}: title has incorrect accessible text: ${closed.title}`)
  if (closed.plusWidth < 44 || closed.plusHeight < 44)
    throw new Error(`${tag}: plus target is below 44px`)
  if (closed.buttonWidth !== closed.cardWidth || closed.buttonHeight !== closed.cardHeight)
    throw new Error(`${tag}: card button is not full surface`)
  if (closed.imageSizes.some(([width]) => width === 0))
    throw new Error(`${tag}: card image did not load`)
  if (closed.overflow !== 0) throw new Error(`${tag}: ${closed.overflow}px horizontal overflow`)

  await page.screenshot({ path: `${out}/clip-zycon-${tag}-card.png` })
  await page.click('.zyconRange__open')
  await new Promise((resolve) => setTimeout(resolve, 550))

  const opened = await page.evaluate(() => {
    const dialog = document.querySelector('.zyconRange__sheet')
    const close = document.querySelector('.zyconRange__close')
    const image = document.querySelector('.zyconRange__sheetPhoto')
    const copy = document.querySelector('.zyconRange__sheetCopy')
    const art = document.querySelector('.zyconRange__sheetArt')
    const more = document.querySelector('.zyconRange__more')
    const rect = (element) => {
      const box = element?.getBoundingClientRect()
      return box
        ? {
            top: Math.round(box.top),
            right: Math.round(box.right),
            bottom: Math.round(box.bottom),
            left: Math.round(box.left),
            width: Math.round(box.width),
            height: Math.round(box.height),
          }
        : null
    }
    return {
      dialog: Boolean(dialog),
      modal: dialog?.getAttribute('aria-modal'),
      focusedClose: document.activeElement === close,
      locked: getComputedStyle(document.documentElement).overflow === 'hidden',
      closeWidth: Math.round(close?.getBoundingClientRect().width ?? 0),
      imageSize:
        image instanceof HTMLImageElement ? [image.naturalWidth, image.naturalHeight] : [0, 0],
      sheetRect: rect(dialog),
      copyRect: rect(copy),
      artRect: rect(art),
      moreRect: rect(more),
      imageRect: rect(image),
      borderRadius: dialog ? getComputedStyle(dialog).borderRadius : null,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  if (!opened.dialog || opened.modal !== 'true' || !opened.focusedClose || !opened.locked)
    throw new Error(`${tag}: dialog accessibility contract failed`)
  if (opened.closeWidth < 44 || opened.imageSize[0] !== 1400 || opened.imageSize[1] !== 1517)
    throw new Error(`${tag}: dialog controls or image dimensions failed`)
  if (opened.overflow !== 0) throw new Error(`${tag}: dialog caused horizontal overflow`)
  if (
    width <= 760 &&
    (opened.sheetRect?.top !== 0 ||
      opened.sheetRect?.width !== width ||
      opened.copyRect?.bottom > opened.artRect?.top ||
      opened.imageRect?.bottom !== opened.sheetRect?.bottom ||
      opened.borderRadius !== '0px')
  )
    throw new Error(`${tag}: mobile copy-first full-sheet placement failed`)

  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  const wrappedBack = await page.evaluate(
    () => document.activeElement?.classList.contains('zyconRange__more') ?? false,
  )
  await page.keyboard.press('Tab')
  const wrappedForward = await page.evaluate(
    () => document.activeElement?.classList.contains('zyconRange__close') ?? false,
  )
  if (!wrappedBack || !wrappedForward) throw new Error(`${tag}: focus trap failed`)

  await page.screenshot({ path: `${out}/clip-zycon-${tag}-overlay.png` })
  await page.keyboard.press('Escape')
  await new Promise((resolve) => setTimeout(resolve, 800))
  const closedByEscape = await page.evaluate(() => ({
    gone: !document.querySelector('.zyconRange__sheet'),
    openerFocused: document.activeElement?.classList.contains('zyconRange__open') ?? false,
    unlocked: getComputedStyle(document.documentElement).overflow !== 'hidden',
  }))
  if (!closedByEscape.gone || !closedByEscape.openerFocused || !closedByEscape.unlocked)
    throw new Error(
      `${tag}: Escape close or focus return failed: ${JSON.stringify(closedByEscape)}`,
    )

  await page.click('.zyconRange__open')
  await new Promise((resolve) => setTimeout(resolve, 350))
  if (width <= 760) await page.click('.zyconRange__close')
  else await page.mouse.click(5, 5)
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (await page.$('.zyconRange__sheet')) throw new Error(`${tag}: second dismissal failed`)

  if (errors.length || failed.length)
    throw new Error(`${tag}: ${errors.length} console errors, ${failed.length} failed requests`)

  console.log(tag, `${width}x${height}`, closed, opened)
  await page.close()
}

await run(1440, 900, 'desktop')
await run(390, 844, 'mobile')
await browser.close()
