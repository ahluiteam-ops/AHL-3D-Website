/* "Can You Use Your Own Front Hair For A Brush-Back Style?" — the decision tree.
 *   node scripts/verify-brushback.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = 'http://127.0.0.1:5173/#/will-my-hairline-look-real'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-flow'
mkdirSync(out, { recursive: true })

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
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  const before = await page.evaluate(() => {
    const el = document.querySelector('.flow__in')
    return el ? el.getAttribute('data-shown') : 'MISSING'
  })

  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('.flow')
      if (el) scrollBy(0, el.getBoundingClientRect().top - 50)
    })
    await new Promise((r) => setTimeout(r, 250))
  }
  await new Promise((r) => setTimeout(r, 2200))

  const m = await page.evaluate(() => {
    const sec = document.querySelector('.flow')
    const drawn = (sel) =>
      [...sec.querySelectorAll(sel)].filter((e) => {
        const t = getComputedStyle(e).transform
        return t === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(t)
      }).length
    const heads = [...sec.querySelectorAll('.flow__head')]
    const nodes = [...sec.querySelectorAll('.flow__node')]
    const pills = [...sec.querySelectorAll('.flow__pill')]
    const branch = [...sec.querySelectorAll('.flow__row--branch .flow__node')]
    const fonts = [...sec.querySelectorAll('p, span, strong')]
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((n) => n > 0)
    const h = sec.querySelector('h2')
    const lineSel =
      '.flow__lineV, .flow__splitStem, .flow__splitBar, .flow__splitLeg, .flow__leg, .flow__mergeDrop, .flow__mergeBar, .flow__mergeStem'
    return {
      order: [...document.querySelectorAll('main > section')].map((s) => s.className.split(' ')[0]),
      shown: document.querySelector('.flow__in').getAttribute('data-shown'),
      title: h.textContent.replace(/\s+/g, ' ').trim(),
      labelled: sec.getAttribute('aria-labelledby') === h.id,
      nodes: nodes.length,
      nodesVisible: nodes.filter((n) => parseFloat(getComputedStyle(n).opacity) > 0.95).length,
      words: sec.querySelectorAll('.flow__word').length,
      wordsRisen: drawn('.flow__word'),
      lines: sec.querySelectorAll(lineSel).length,
      linesDrawn: drawn(lineSel),
      heads: heads.length,
      headsVisible: heads.filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.95).length,
      pills: pills.map((p) => p.textContent.trim()),
      pillColours: pills.map((p) => getComputedStyle(p).color),
      /* The two branch nodes must sit on one row — the design keeps them side
         by side even on a phone. */
      branchSameRow:
        branch.length === 2 &&
        Math.abs(branch[0].getBoundingClientRect().top - branch[1].getBoundingClientRect().top) < 2,
      bolds: sec.querySelectorAll('.flow__text strong').length,
      minFont: Math.min(...fonts).toFixed(2),
      chartW: Math.round(sec.querySelector('.flow__chart').getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  console.log(
    tag.padEnd(9),
    `${width}x${height}`.padEnd(10),
    `nodes ${m.nodesVisible}/${m.nodes}`.padEnd(12),
    `lines ${m.linesDrawn}/${m.lines}`.padEnd(12),
    `heads ${m.headsVisible}/${m.heads}`.padEnd(12),
    `words ${m.wordsRisen}/${m.words}`.padEnd(14),
    `reveal ${before}\u2192${m.shown}`.padEnd(17),
    'branch side-by-side', String(m.branchSameRow).padEnd(6),
    '| chart', m.chartW + 'px',
    '| minFont', m.minFont, m.minFont >= 14 ? 'OK' : 'UNDER',
    '| ov', m.overflow,
    '| errors', errors.length || 'none',
  )
  if (errors.length) console.log('    ', errors.slice(0, 2))
  if (tag === 'desktop') {
    console.log('   order :', m.order.join(' > '))
    console.log('   title :', JSON.stringify(m.title))
    console.log('   pills :', m.pills.join(' / '), '|', m.pillColours.join(' / '))
    console.log('   bolds :', m.bolds, '| labelled', m.labelled)
  }
  await page.screenshot({ path: `${out}/flow-${tag}.png` })
  await page.close()
}

await run(1440, 900, false, 'desktop')
await run(768, 1024, false, 'tablet')
await run(390, 844, false, 'mobile')
await run(360, 780, false, 'small')
await run(1440, 900, true, 'reduced')
await browser.close()
