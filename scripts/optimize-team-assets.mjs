/* Create web-sized Team page WebP assets from supplied PNGs.
 * Run from project root: node scripts/optimize-team-assets.mjs [output-file]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const sourceRoot = resolve('Images/Team page')
const outputRoot = resolve('public/team')
const requestedOutput = process.argv[2]

const assets = [
  ['Frame 2085665570.png', 'reel-01.webp', 720, 0.84],
  ['Frame 2085665572.png', 'reel-02.webp', 720, 0.84],
  ['Frame 2085665574.png', 'reel-03.webp', 720, 0.84],
  ['Frame 2085665575.png', 'reel-04.webp', 720, 0.84],
  ['Instagram--Streamline-Core 2.png', 'instagram.webp', 96, 0.95],
  ['Group-3-Fill--Streamline-Mingcute-Fill 2.png', 'team-badge.webp', 96, 0.95],
  ['Frame 2085665336.png', 'office-01.webp', 1600, 0.84],
  ['Frame 2085665598.png', 'office-02.webp', 1600, 0.84],
  ['Frame 2085665039.png', 'office-03.webp', 1600, 0.84],
  ['Frame 2085665337.png', 'office-04.webp', 1600, 0.84],
]

mkdirSync(outputRoot, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()

for (const [source, output, maxWidth, quality] of assets.filter(([, output]) => !requestedOutput || output === requestedOutput)) {
  const bytes = readFileSync(resolve(sourceRoot, source))
  const dataUrl = `data:image/png;base64,${bytes.toString('base64')}`
  const encoded = await page.evaluate(async ({ dataUrl, maxWidth, quality }) => {
    const image = new Image()
    image.src = dataUrl
    await image.decode()
    const scale = Math.min(1, maxWidth / image.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale)
    canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('Canvas 2D context unavailable')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return {
      data: canvas.toDataURL('image/webp', quality),
      width: canvas.width,
      height: canvas.height,
    }
  }, { dataUrl, maxWidth, quality })

  writeFileSync(resolve(outputRoot, output), Buffer.from(encoded.data.split(',')[1], 'base64'))
  process.stdout.write(`${output}: ${encoded.width}x${encoded.height}\n`)
}

await browser.close()
