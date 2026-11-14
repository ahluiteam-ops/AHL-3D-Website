/* Create web-sized WebP derivatives from the supplied About Us source PNGs.
 * Run from the project root: node scripts/optimize-about-assets.mjs [output-file]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const sourceRoot = resolve('Images/About us')
const outputRoot = resolve('public/about')
const requestedOutput = process.argv[2]

const assets = [
  ['Group - 2 of 38.png', 'team-hero.webp', 1600, 0.86],
  ['Frame 2085665468.png', 'our-story.webp', 1600, 0.86, { x: 96, y: 48, width: 4480, height: 2336 }],
  ['image.png', 'story-collage.webp', 1200, 0.86],
  ['image2.png', 'story-team.webp', 1600, 0.86],
  ['Frame 2085664921.png', 'mission.webp', 1600, 0.86],
  ['Frame 2085665212.png', 'mission-mobile.webp', 900, 0.86],
  ['Frame 2085665192.png', 'founder.webp', 1600, 0.88],
  ['Frame 20856651921.png', 'founder-mobile.webp', 900, 0.88],
]

mkdirSync(outputRoot, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox'],
})

const page = await browser.newPage()

for (const [source, output, maxWidth, quality, crop] of assets.filter(([, output]) => !requestedOutput || output === requestedOutput)) {
  const bytes = readFileSync(resolve(sourceRoot, source))
  const dataUrl = `data:image/png;base64,${bytes.toString('base64')}`
  const encoded = await page.evaluate(async ({ dataUrl, maxWidth, quality, crop }) => {
    const image = new Image()
    image.src = dataUrl
    await image.decode()
    const sourceX = crop?.x ?? 0
    const sourceY = crop?.y ?? 0
    const sourceWidth = crop?.width ?? image.naturalWidth
    const sourceHeight = crop?.height ?? image.naturalHeight
    const scale = Math.min(1, maxWidth / sourceWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sourceWidth * scale)
    canvas.height = Math.round(sourceHeight * scale)
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('Canvas 2D context unavailable')
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    )
    return {
      data: canvas.toDataURL('image/webp', quality),
      width: canvas.width,
      height: canvas.height,
    }
  }, { dataUrl, maxWidth, quality, crop })

  writeFileSync(resolve(outputRoot, output), Buffer.from(encoded.data.split(',')[1], 'base64'))
  process.stdout.write(`${output}: ${encoded.width}x${encoded.height}\n`)
}

await browser.close()
