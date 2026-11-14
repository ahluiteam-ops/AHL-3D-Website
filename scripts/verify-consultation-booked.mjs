// Direct visit to #/consultation-booked with nothing in storage must still
// render a sensible page (no pass, no preview banner, no console errors).
// Usage: node scripts/verify-consultation-booked.mjs [baseUrl]
import puppeteer from 'puppeteer-core'

const base = process.argv[2] ?? 'http://127.0.0.1:5173/'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
let failures = 0
for (const [width, height] of [[1440, 900], [390, 844], [320, 568]]) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.setViewport({ width, height })
  await page.goto(`${base}#/consultation-booked`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 800))
  const r = await page.evaluate(() => ({
    h1: document.querySelector('.booked h1')?.textContent,
    pass: !!document.querySelector('.booked__pass'),
    preview: !!document.querySelector('.booked__preview'),
    steps: document.querySelectorAll('.booked__next li').length,
    home: document.querySelector('.booked__home')?.getAttribute('href'),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }))
  const ok = r.h1 === 'Thank you.' && !r.pass && !r.preview && r.steps === 3 && r.home === '#/' && r.overflow <= 0 && !errors.length
  console.log(width, ok ? 'ok' : 'FAIL', JSON.stringify(r), errors.join('|'))
  if (!ok) failures++
  await page.close()
}
await browser.close()
process.exit(failures ? 1 : 0)
