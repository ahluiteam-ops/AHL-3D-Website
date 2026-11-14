// Verifies the story-reels row and viewer on every page that carries one.
// Usage: node scripts/verify-story-reels.mjs [baseUrl] [screenshotDir]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const base = process.argv[2] ?? 'http://127.0.0.1:5173/'
const shots = process.argv[3]
if (shots) mkdirSync(shots, { recursive: true })

const routes = [
  'will-my-hairline-look-real',
  'stick-on-hair-system',
  'clip-on-hair-system',
  'consult-with-founder',
  'smp',
  'hair-transplant',
  'stick-on-lifespan',
  'clip-on-lifespan',
]
const viewports = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
]

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--autoplay-policy=no-user-gesture-required'],
})
let failures = 0
const fail = (msg) => {
  failures++
  console.log('  FAIL', msg)
}

for (const vp of viewports) {
  for (const route of routes) {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.setViewport(vp)
    await page.goto(`${base}#/${route}`, { waitUntil: 'networkidle2' })
    await page.evaluate(() => localStorage.removeItem('ah-story-reels-watched'))

    const info = await page.evaluate(() => {
      const section = document.querySelector('.reels')
      if (!section) return null
      section.scrollIntoView({ block: 'center' })
      const bg = (el) => (el ? getComputedStyle(el).backgroundColor + ' ' + getComputedStyle(el).backgroundImage.slice(0, 40) : 'none')
      const disc = section.querySelector('.reels__disc').getBoundingClientRect()
      return {
        count: section.querySelectorAll('.reels__circle').length,
        disc: Math.round(disc.width),
        prev: section.previousElementSibling?.className.toString().split(' ')[0],
        prevBg: bg(section.previousElementSibling),
        selfBg: bg(section),
        next: section.nextElementSibling?.className.toString().split(' ')[0] || section.nextElementSibling?.id,
        nextBg: bg(section.nextElementSibling?.firstElementChild?.tagName === 'SECTION' ? section.nextElementSibling.firstElementChild : section.nextElementSibling),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })
    console.log(`${vp.name} ${route}`, JSON.stringify(info))
    if (!info) {
      fail('no .reels section')
      await page.close()
      continue
    }
    if (info.overflow > 0) fail(`horizontal overflow ${info.overflow}px`)
    if (info.disc < 88) fail(`circle ${info.disc}px under 88px`)
    await new Promise((r) => setTimeout(r, 600))
    if (shots) {
      // 160px of each neighbour, so the background alternation is visible.
      const box = await page.evaluate(() => {
        const r = document.querySelector('.reels').getBoundingClientRect()
        return { x: 0, y: r.top + window.scrollY - 160, width: window.innerWidth, height: r.height + 320 }
      })
      await page.screenshot({ path: join(shots, `${vp.name}-${route}-row.png`), clip: box, captureBeyondViewport: true })
    }

    // Open, play, advance, close with Escape.
    await page.click('.reels__circle')
    await new Promise((r) => setTimeout(r, 1500))
    const playing = await page.evaluate(() => {
      const d = document.querySelector('dialog.reelView')
      const v = d?.querySelector('video')
      return { open: !!d?.open, t: v ? v.currentTime : -1, paused: v?.paused, w: Math.round(d?.querySelector('.reelView__frame').getBoundingClientRect().width ?? 0), h: Math.round(d?.querySelector('.reelView__frame').getBoundingClientRect().height ?? 0) }
    })
    console.log('  viewer', JSON.stringify(playing))
    if (!playing.open) fail('dialog did not open')
    if (!(playing.t > 0.3)) fail('video not playing')
    if (shots) await page.screenshot({ path: join(shots, `${vp.name}-${route}-viewer.png`) })

    const y0 = await page.evaluate(() => window.scrollY)
    await page.mouse.move(vp.width / 2, vp.height / 2)
    await page.mouse.wheel({ deltaY: 600 })
    await new Promise((r) => setTimeout(r, 300))
    if ((await page.evaluate(() => window.scrollY)) !== y0) fail('page scrolled behind viewer')

    await page.keyboard.press('ArrowRight')
    await new Promise((r) => setTimeout(r, 400))
    const second = await page.evaluate(() => document.querySelector('.reelView__meta span')?.textContent)
    if (!second?.startsWith('2 of')) fail(`ArrowRight did not advance (${second})`)

    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 400))
    if (await page.$('dialog.reelView')) fail('Escape did not close')
    if (!page.url().includes(`#/${route}`)) fail(`route lost after close: ${page.url()}`)
    const watched = await page.$$eval('.reels__circle[data-watched="true"]', (n) => n.length)
    if (watched !== 2) fail(`expected 2 watched rings, got ${watched}`)

    // Back button closes instead of leaving the page.
    await page.click('.reels__circle')
    await new Promise((r) => setTimeout(r, 500))
    await page.goBack()
    await new Promise((r) => setTimeout(r, 500))
    if (await page.$('dialog.reelView')) fail('back button did not close')
    if (!page.url().includes(`#/${route}`)) fail(`back button left the page: ${page.url()}`)

    if (errors.length) fail('console errors: ' + errors.join(' | '))
    await page.close()
  }
}

await browser.close()
console.log(failures ? `${failures} failure(s)` : 'all story-reel checks passed')
process.exit(failures ? 1 : 0)
