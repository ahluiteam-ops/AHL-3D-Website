/* "Will My Hairline Look Real?" hero, and proof that extracting `GuideHero`
 * left the Hair Patch vs Hair System hero untouched.
 *   node scripts/verify-hairline-hero.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/#'
const out = process.argv[2] ?? './.tmp-hairline'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function probe(route, width, height, reduced, tag) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('requestfailed', (r) => errors.push('REQ FAIL ' + r.url()))
  await page.setViewport({ width, height, isMobile: width < 900, hasTouch: width < 900 })
  if (reduced)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1600))

  const m = await page.evaluate(() => {
    const hero = document.querySelector('.guideHero')
    if (!hero) return { missing: true }
    const img = hero.querySelector('.guideHero__media img')
    const icon = hero.querySelector('.guideHero__eyebrowIcon')
    const h1 = hero.querySelector('h1')
    const fonts = [...hero.querySelectorAll('p, span')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((n) => n > 0)
    return {
      h1: h1.textContent.trim(),
      labelled: hero.getAttribute('aria-labelledby') === h1.id,
      eyebrow: hero.querySelector('.guideHero__eyebrow').textContent.trim(),
      mask: getComputedStyle(icon).maskImage || getComputedStyle(icon).webkitMaskImage,
      iconBox: [Math.round(icon.getBoundingClientRect().width), Math.round(icon.getBoundingClientRect().height)],
      imgSrc: new URL(img.src).pathname,
      imgLoaded: img.naturalWidth > 0,
      imgNatural: [img.naturalWidth, img.naturalHeight],
      imgBox: [Math.round(img.getBoundingClientRect().width), Math.round(img.getBoundingClientRect().height)],
      bold: [...hero.querySelectorAll('.guideHero__lede strong')].map((b) => b.textContent),
      play: !!hero.querySelector('.guideHero__play'),
      minFont: Math.min(...fonts).toFixed(2),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Size: getComputedStyle(h1).fontSize,
    }
  })

  if (m.missing) {
    console.log(`${tag.padEnd(16)} HERO MISSING`)
    await page.close()
    return null
  }

  console.log(
    tag.padEnd(16),
    `${width}x${height}`.padEnd(10),
    'h1', m.h1Size.padEnd(8),
    'icon', m.iconBox.join('x').padEnd(6),
    'img', m.imgBox.join('x').padEnd(10),
    m.imgLoaded ? 'LOADED' : 'BROKEN',
    '| minFont', m.minFont + 'px', m.minFont >= 14 ? 'OK' : 'UNDER',
    '| overflow', m.overflow,
    '| errors', errors.length || 'none',
  )
  if (errors.length) console.log('   ', errors.slice(0, 3))
  await page.screenshot({ path: `${out}/${tag}.png` })
  await page.close()
  return m
}

console.log('--- new page ---')
const a = await probe('/will-my-hairline-look-real', 1440, 900, false, 'hairline-desktop')
console.log('   h1        :', JSON.stringify(a.h1))
console.log('   labelled  :', a.labelled)
console.log('   eyebrow   :', JSON.stringify(a.eyebrow))
console.log('   mask      :', a.mask)
console.log('   poster    :', a.imgSrc, a.imgNatural.join('x'))
console.log('   bold      :', a.bold.map((b) => JSON.stringify(b)).join(', '))
console.log('   play mark :', a.play)
await probe('/will-my-hairline-look-real', 768, 1024, false, 'hairline-tablet')
await probe('/will-my-hairline-look-real', 390, 844, false, 'hairline-mobile')
await probe('/will-my-hairline-look-real', 1440, 900, true, 'hairline-reduced')

console.log('\n--- page 3 hero, must be unchanged by the extraction ---')
const b = await probe('/hair-patch-vs-hair-system', 1440, 900, false, 'page3-desktop')
console.log('   h1        :', JSON.stringify(b.h1))
console.log('   mask      :', b.mask)
console.log('   poster    :', b.imgSrc, b.imgNatural.join('x'))
console.log('   masks differ per page:', a.mask !== b.mask)
await probe('/hair-patch-vs-hair-system', 390, 844, false, 'page3-mobile')

await browser.close()
