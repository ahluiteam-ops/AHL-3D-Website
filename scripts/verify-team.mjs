/* Verify Team route. Run while Vite is available: node scripts/verify-team.mjs [outDir] */
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/team'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-team'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })

async function run(width, height, label, reducedMotion = false) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))
  await page.setViewport({ width, height, isMobile: width <= 700, hasTouch: width <= 700 })
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await new Promise((resolve) => setTimeout(resolve, 2600))
  await page.evaluate(() => {
    const office = document.querySelector('.teamOffice')
    if (office) scrollTo(0, office.getBoundingClientRect().top + scrollY)
  })
  await new Promise((resolve) => setTimeout(resolve, 900))
  await page.evaluate(() => {
    const office = document.querySelector('.teamOffice')
    const lastCard = document.querySelector('.teamOffice__card:last-child')
    if (!office || !lastCard) return
    if (innerWidth > 900 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const top = office.getBoundingClientRect().top + scrollY
      scrollTo(0, top + office.getBoundingClientRect().height - innerHeight)
    } else {
      lastCard.scrollIntoView({ block: 'center' })
    }
  })
  await new Promise((resolve) => setTimeout(resolve, 900))

  const result = await page.evaluate(() => {
    const reels = [...document.querySelectorAll('.teamHero__reel')]
    const cta = document.querySelector('.teamHero__instagram')
    const badgeIcon = document.querySelector('.teamHero__eyebrow img')
    const ctaIcon = cta?.querySelector('img')
    return {
      h1: document.querySelectorAll('.teamPage h1').length,
      title: document.querySelector('.teamPage h1')?.textContent?.trim(),
      reels: reels.length,
      reelRatios: reels.map((item) => {
        const rect = item.getBoundingClientRect()
        return Number((rect.width / rect.height).toFixed(4))
      }),
      reelWidths: reels.map((item) => Math.round(item.getBoundingClientRect().width)),
      imageSources: [...document.querySelectorAll('.teamHero__reel > img')].map((image) => new URL(image.currentSrc, location.href).pathname),
      broken: [...document.querySelectorAll('.teamPage img')].filter((image) => !image.complete || !image.naturalWidth).map((image) => image.getAttribute('src')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ctaHref: cta?.getAttribute('href'),
      ctaTarget: cta?.getAttribute('target'),
      ctaHeight: cta?.getBoundingClientRect().height,
      badgeSource: badgeIcon ? new URL(badgeIcon.currentSrc, location.href).pathname : null,
      ctaIconSource: ctaIcon ? new URL(ctaIcon.currentSrc, location.href).pathname : null,
      controls: [...document.querySelectorAll('.teamHero__controls button')].map((button) => ({
        label: button.getAttribute('aria-label'),
        width: button.getBoundingClientRect().width,
        height: button.getBoundingClientRect().height,
      })),
      office: {
        heading: document.querySelector('#team-office-title')?.textContent?.trim(),
        cards: [...document.querySelectorAll('.teamOffice__card')].map((card) => {
          const rect = card.getBoundingClientRect()
          return Number((rect.width / rect.height).toFixed(4))
        }),
        sources: [...document.querySelectorAll('.teamOffice__card img')].map((image) => new URL(image.currentSrc, location.href).pathname),
        naturalSizes: [...document.querySelectorAll('.teamOffice__card img')].map((image) => [image.naturalWidth, image.naturalHeight]),
        trackDisplay: getComputedStyle(document.querySelector('.teamOffice__track')).display,
        columns: getComputedStyle(document.querySelector('.teamOffice__track')).gridTemplateColumns,
        stageHeight: document.querySelector('.teamOffice__stage')?.getBoundingClientRect().height,
      },
      jobs: {
        titles: [...document.querySelectorAll('.teamJobs__card h3')].map((heading) => heading.textContent?.trim()),
        links: [...document.querySelectorAll('.teamJobs__apply')].map((link) => ({
          href: link.getAttribute('href'),
          height: link.getBoundingClientRect().height,
        })),
        display: getComputedStyle(document.querySelector('.teamJobs__grid')).display,
        columns: getComputedStyle(document.querySelector('.teamJobs__grid')).gridTemplateColumns,
      },
    }
  })

  const instagram = 'https://www.instagram.com/ourhairlinestory?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
  const sources = ['/team/reel-04.webp', '/team/reel-03.webp', '/team/reel-02.webp', '/team/reel-01.webp']
  if (result.h1 !== 1 || result.title !== 'Life At American Hairline' || result.reels !== 4) throw new Error(`${label}: content mismatch ${JSON.stringify(result)}`)
  if (result.reelRatios.some((ratio) => Math.abs(ratio - 0.5625) > 0.002)) throw new Error(`${label}: reel ratio mismatch ${JSON.stringify(result.reelRatios)}`)
  if (width <= 700 && result.reelWidths.some((value) => value < 190)) throw new Error(`${label}: mobile reel cards too small ${JSON.stringify(result.reelWidths)}`)
  if (JSON.stringify(result.imageSources) !== JSON.stringify(sources) || result.broken.length) throw new Error(`${label}: images mismatch ${JSON.stringify(result)}`)
  if (result.overflow !== 0) throw new Error(`${label}: page overflow ${result.overflow}`)
  if (result.ctaHref !== instagram || result.ctaTarget !== '_blank' || result.ctaHeight < 44) throw new Error(`${label}: Instagram CTA mismatch ${JSON.stringify(result)}`)
  if (result.badgeSource !== '/team/team-badge.webp' || result.ctaIconSource !== '/team/instagram.webp') throw new Error(`${label}: icon mismatch ${JSON.stringify(result)}`)
  if (result.controls.length !== 0) throw new Error(`${label}: removed hero controls returned ${JSON.stringify(result.controls)}`)
  const officeSources = ['/team/office-01.webp', '/team/office-02.webp', '/team/office-03.webp', '/team/office-04.webp']
  if (result.office.heading !== 'P.S. - Check Out Our Office' || result.office.cards.length !== 4) throw new Error(`${label}: office content mismatch ${JSON.stringify(result.office)}`)
  if (result.office.cards.some((ratio) => Math.abs(ratio - (2960 / 1672)) > 0.003)) throw new Error(`${label}: office card ratio mismatch ${JSON.stringify(result.office.cards)}`)
  if (JSON.stringify(result.office.sources) !== JSON.stringify(officeSources) || result.office.naturalSizes.some(([w, h]) => w !== 1600 || h !== 904)) throw new Error(`${label}: office images mismatch ${JSON.stringify(result.office)}`)
  if (width > 900 && !reducedMotion && result.office.trackDisplay !== 'flex') throw new Error(`${label}: office desktop track is not flex ${JSON.stringify(result.office)}`)
  if ((width <= 900 || reducedMotion) && result.office.trackDisplay !== 'grid') throw new Error(`${label}: office fallback is not grid ${JSON.stringify(result.office)}`)
  const expectedJobTitles = ['Social Media Executive', 'Senior Video Editor', 'AI Developer Intern', 'Social Media Executive', 'Social Media Executive', 'Talent Acquisition Executive']
  if (JSON.stringify(result.jobs.titles) !== JSON.stringify(expectedJobTitles) || result.jobs.links.length !== 6 || result.jobs.links.some((link) => !link.href?.startsWith('mailto:') || link.height < 43.5)) throw new Error(`${label}: jobs content/CTA mismatch ${JSON.stringify(result.jobs)}`)
  if (result.jobs.display !== 'grid' || (width <= 700 && result.jobs.columns.trim().split(/\s+/).length !== 1)) throw new Error(`${label}: jobs responsive grid mismatch ${JSON.stringify(result.jobs)}`)
  if (errors.length || failed.length) throw new Error(`${label}: browser failures ${JSON.stringify({ errors, failed })}`)

  let officeMotion = null
  if (width > 900 && !reducedMotion) {
    officeMotion = await page.evaluate(async () => {
      const section = document.querySelector('.teamOffice')
      const stage = document.querySelector('.teamOffice__stage')
      const track = document.querySelector('.teamOffice__track')
      const sectionTop = section.getBoundingClientRect().top + scrollY
      const sectionHeight = section.getBoundingClientRect().height
      const settle = () => new Promise((resolve) => setTimeout(resolve, 900))
      const x = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41

      scrollTo(0, sectionTop + 2)
      await settle()
      const startX = x()
      const middleScroll = sectionTop + ((sectionHeight - innerHeight) / 2)
      scrollTo(0, middleScroll)
      await settle()
      const middleX = x()
      const pinnedTop = stage.getBoundingClientRect().top
      const triggerDistance = Math.max(track.scrollWidth - innerWidth, innerHeight * 1.35)
      scrollTo(0, sectionTop + triggerDistance + 2)
      await settle()
      const endX = x()
      const expectedEnd = -(track.scrollWidth - innerWidth)
      return { startX, middleX, endX, expectedEnd, pinnedTop, sectionHeight, trackWidth: track.scrollWidth }
    })

    if (Math.abs(officeMotion.startX) > 3 || Math.abs(officeMotion.endX - officeMotion.expectedEnd) > 5 || officeMotion.middleX >= -10 || Math.abs(officeMotion.pinnedTop) > 2) {
      throw new Error(`${label}: office scroll motion mismatch ${JSON.stringify(officeMotion)}`)
    }

    await page.screenshot({ path: `${out}/team-office-${label}-end.png` })
  }

  await page.evaluate(() => scrollTo(0, 0))
  await new Promise((resolve) => setTimeout(resolve, 300))
  await page.screenshot({ path: `${out}/team-${label}.png`, fullPage: true })
  process.stdout.write(`${label} ${JSON.stringify({ ...result, officeMotion })}\n`)
  await page.close()
}

await run(1440, 900, 'desktop')
await run(1024, 900, 'tablet')
await run(390, 844, 'mobile')
await run(375, 812, 'small-mobile')
await run(844, 390, 'landscape')
await run(1440, 900, 'reduced', true)
await browser.close()
