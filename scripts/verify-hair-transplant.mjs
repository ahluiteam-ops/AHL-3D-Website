/* Verify the Hair Transplant route.
 *   node scripts/verify-hair-transplant.mjs [outDir]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://127.0.0.1:5173/#/hair-transplant'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = process.argv[2] ?? './.tmp-hair-transplant'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

async function run(width, height, label, reducedMotion = false) {
  const page = await browser.newPage()
  const errors = []
  const failed = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('requestfailed', (request) => failed.push(request.url()))

  await page.setViewport({ width, height, isMobile: width <= 700, hasTouch: width <= 700 })
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => { image.loading = 'eager' })
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 55))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 120))
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)))
    window.scrollTo(0, 0)
  })

  const result = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('.hairTransplantPage button, .hairTransplantPage input, .hairTransplantPage select')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
    const benefitRail = document.querySelector('.htBenefits__rail')
    const comparisonSection = document.querySelector('.htCompare')
    const comparisonTitle = comparisonSection?.querySelector('h2')
    const comparisonWrap = comparisonSection?.querySelector('.htCompare__tableWrap')
    const comparisonTable = comparisonSection?.querySelector('table')
    const comparisonHead = comparisonTable?.querySelector('thead')
    const comparisonFirstRow = comparisonTable?.querySelector('tbody tr')
    const bollywoodFrame = document.querySelector('.htBollywood__media')
    const bollywoodImage = bollywoodFrame?.querySelector('img')
    const bollywoodFrameRect = bollywoodFrame?.getBoundingClientRect()
    const bollywoodImageRect = bollywoodImage?.getBoundingClientRect()
    const bollywoodContentRect = document.querySelector('.htBollywood__content')?.getBoundingClientRect()
    const processResultBody = document.querySelector('.htProcess__resultCopy p')
    const processVideoLink = document.querySelector('.htProcess__videoLink')
    const processResultBodyRect = processResultBody?.getBoundingClientRect()
    const processVideoLinkRect = processVideoLink?.getBoundingClientRect()
    return {
      h1: document.querySelectorAll('.hairTransplantPage h1').length,
      activeNav: document.querySelector('.nav__dropdownLink--active')?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      minControlHeight: Math.min(...controls.map((element) => element.getBoundingClientRect().height)),
      brokenImages: [...document.querySelectorAll('.hairTransplantPage img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      benefits: document.querySelectorAll('.htBenefits__card').length,
      benefitCards: [...document.querySelectorAll('.htBenefits__card article')].map((card) => ({
        width: card.getBoundingClientRect().width,
        height: card.getBoundingClientRect().height,
        top: card.getBoundingClientRect().top,
      })),
      benefitImageFits: [...document.querySelectorAll('.htBenefits__card img')].map((image) => getComputedStyle(image).objectFit),
      benefitImages: [...document.querySelectorAll('.htBenefits__card img')].map((image) => ({
        width: image.getBoundingClientRect().width,
        height: image.getBoundingClientRect().height,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      })),
      comparisonLayout: comparisonSection && comparisonTitle && comparisonWrap && comparisonTable && comparisonHead && comparisonFirstRow ? {
        sectionBackground: getComputedStyle(comparisonSection).backgroundColor,
        titleAlign: getComputedStyle(comparisonTitle).textAlign,
        wrapperBorder: getComputedStyle(comparisonWrap).borderTopWidth,
        wrapperRadius: getComputedStyle(comparisonWrap).borderTopLeftRadius,
        wrapperOverflow: getComputedStyle(comparisonWrap).overflow,
        tableDisplay: getComputedStyle(comparisonTable).display,
        headDisplay: getComputedStyle(comparisonHead).display,
        headBackground: getComputedStyle(comparisonHead).backgroundColor,
        headCells: comparisonHead.querySelectorAll('th').length,
        rowDisplay: getComputedStyle(comparisonFirstRow).display,
        rowHeight: comparisonFirstRow.getBoundingClientRect().height,
        rowCellTops: [...comparisonFirstRow.children].map((cell) => cell.getBoundingClientRect().top),
      } : null,
      bollywoodMedia: bollywoodFrame && bollywoodImage && bollywoodFrameRect && bollywoodImageRect ? {
        objectFit: getComputedStyle(bollywoodImage).objectFit,
        naturalWidth: bollywoodImage.naturalWidth,
        naturalHeight: bollywoodImage.naturalHeight,
        frameRatio: bollywoodFrameRect.width / bollywoodFrameRect.height,
        imageRatio: bollywoodImageRect.width / bollywoodImageRect.height,
        frameTop: bollywoodFrameRect.top,
        frameHeight: bollywoodFrameRect.height,
        frameWidth: bollywoodFrameRect.width,
        contentTop: bollywoodContentRect?.top,
        contentHeight: bollywoodContentRect?.height,
        contentWidth: bollywoodContentRect?.width,
      } : null,
      bollywoodTitle: document.querySelector('#ht-bollywood-title')?.textContent?.replace(/\s+/g, ' ').trim(),
      processVideo: processVideoLink && processResultBodyRect && processVideoLinkRect ? {
        text: processVideoLink.textContent?.trim(),
        href: processVideoLink.getAttribute('href'),
        target: processVideoLink.getAttribute('target'),
        rel: processVideoLink.getAttribute('rel'),
        decoration: getComputedStyle(processVideoLink).textDecorationLine,
        height: processVideoLinkRect.height,
        top: processVideoLinkRect.top,
        bodyBottom: processResultBodyRect.bottom,
      } : null,
      comparisonRows: document.querySelectorAll('.htCompare tbody tr').length,
      idealItems: document.querySelectorAll('.htIdeal__card li').length,
      processSteps: document.querySelectorAll('.htProcess__step').length,
      surgeons: document.querySelectorAll('.htSurgeons__card').length,
      trust: document.querySelector('.htHero__trust')?.textContent?.trim(),
      trustAvatars: [...document.querySelectorAll('.htHero__avatars img')].map((image) => ({
        src: image.getAttribute('src'),
        width: image.naturalWidth,
        height: image.naturalHeight,
        renderedWidth: image.getBoundingClientRect().width,
        renderedHeight: image.getBoundingClientRect().height,
      })),
      railScrollable: benefitRail ? benefitRail.scrollWidth > benefitRail.clientWidth : null,
      reducedCard: (() => {
        const card = document.querySelector('.htBenefits__card')
        if (!card) return null
        const style = getComputedStyle(card)
        return { opacity: style.opacity, transform: style.transform }
      })(),
    }
  })

  if (result.h1 !== 1) throw new Error(`${label}: expected one h1`)
  if (result.activeNav !== 'Hair transplant') throw new Error(`${label}: Hair transplant nav item is not active`)
  if (result.overflow !== 0) throw new Error(`${label}: ${result.overflow}px horizontal overflow`)
  if (result.minControlHeight < 44) throw new Error(`${label}: interactive target below 44px`)
  if (result.brokenImages.length) throw new Error(`${label}: broken images ${result.brokenImages.join(', ')}`)
  if (result.benefits !== 3 || result.comparisonRows !== 7 || result.idealItems !== 10 || result.processSteps !== 3 || result.surgeons !== 2) {
    throw new Error(`${label}: content count mismatch ${JSON.stringify(result)}`)
  }
  if (result.benefitImageFits.some((fit) => fit !== 'contain')) {
    throw new Error(`${label}: benefit images must use contain sizing ${JSON.stringify(result.benefitImageFits)}`)
  }
  if (result.benefitCards.some((card) => card.width > (width <= 900 ? 290.1 : 345))) {
    throw new Error(`${label}: benefit cards are too wide ${JSON.stringify(result.benefitCards)}`)
  }
  if (width <= 900) {
    const expectedCardWidth = Math.min(290, Math.max(250, width * 0.72))
    if (result.benefitCards.some((card) =>
      Math.abs(card.width - expectedCardWidth) > 0.2
    )) {
      throw new Error(`${label}: mobile benefit card width mismatch ${JSON.stringify({ expectedCardWidth, cards: result.benefitCards })}`)
    }
  }
  if (width > 900 && new Set(result.benefitCards.map((card) => Math.round(card.top))).size !== 1) {
    throw new Error(`${label}: benefit cards do not share one responsive row ${JSON.stringify(result.benefitCards)}`)
  }
  if (width > 900 && result.benefitImages.some((image, index) =>
    Math.abs(result.benefitCards[index].width - image.width) > 2.1
  )) {
    throw new Error(`${label}: desktop benefit image sizing changed ${JSON.stringify({ cards: result.benefitCards, images: result.benefitImages })}`)
  }
  if (width <= 900 && result.benefitImages.some((image, index) =>
    Math.abs(result.benefitCards[index].width - image.width) > 2.1
      || Math.abs((image.width / image.height) - (image.naturalWidth / image.naturalHeight)) > 0.01
  )) {
    throw new Error(`${label}: mobile benefit images must fill card width at natural ratio ${JSON.stringify({ cards: result.benefitCards, images: result.benefitImages })}`)
  }
  if (!result.comparisonLayout
    || result.comparisonLayout.tableDisplay !== 'table'
    || result.comparisonLayout.headDisplay !== 'table-header-group'
    || result.comparisonLayout.headCells !== 3) {
    throw new Error(`${label}: comparison table semantics/layout mismatch ${JSON.stringify(result.comparisonLayout)}`)
  }
  if (width <= 700 && (result.comparisonLayout.sectionBackground !== 'rgb(243, 245, 247)'
    || result.comparisonLayout.titleAlign !== 'left'
    || result.comparisonLayout.wrapperBorder !== '1px'
    || result.comparisonLayout.wrapperRadius !== '14px'
    || result.comparisonLayout.wrapperOverflow !== 'hidden'
    || result.comparisonLayout.headBackground !== 'rgb(17, 19, 20)'
    || result.comparisonLayout.rowDisplay !== 'table-row'
    || Math.abs(result.comparisonLayout.rowHeight - 68) > 0.2
    || new Set(result.comparisonLayout.rowCellTops.map((top) => Math.round(top))).size !== 1)) {
    throw new Error(`${label}: mobile comparison does not match compact table format ${JSON.stringify(result.comparisonLayout)}`)
  }
  if (width > 700 && (result.comparisonLayout.sectionBackground !== 'rgb(255, 255, 255)'
    || result.comparisonLayout.titleAlign !== 'center')) {
    throw new Error(`${label}: desktop comparison styling changed ${JSON.stringify(result.comparisonLayout)}`)
  }
  if (!result.bollywoodMedia
    || result.bollywoodMedia.objectFit !== 'contain'
    || result.bollywoodMedia.naturalWidth !== 2176
    || result.bollywoodMedia.naturalHeight !== 1632
    || Math.abs(result.bollywoodMedia.frameRatio - (4 / 3)) > 0.01
    || Math.abs(result.bollywoodMedia.imageRatio - (4 / 3)) > 0.01) {
    throw new Error(`${label}: Bollywood image is cropped or distorted ${JSON.stringify(result.bollywoodMedia)}`)
  }
  if (result.bollywoodTitle !== 'The Secret Behind Most Bollywood Actors’ Hair') {
    throw new Error(`${label}: Bollywood heading words are not separated ${JSON.stringify(result.bollywoodTitle)}`)
  }
  if (width > 900 && (Math.abs(result.bollywoodMedia.frameHeight - result.bollywoodMedia.contentHeight) > 0.5
    || Math.abs(result.bollywoodMedia.frameTop - result.bollywoodMedia.contentTop) > 0.5)) {
    throw new Error(`${label}: Bollywood columns do not match ${JSON.stringify(result.bollywoodMedia)}`)
  }
  if (width <= 900 && (result.bollywoodMedia.frameTop >= result.bollywoodMedia.contentTop
    || Math.abs(result.bollywoodMedia.frameWidth - result.bollywoodMedia.contentWidth) > 0.5)) {
    throw new Error(`${label}: Bollywood stacked layout mismatch ${JSON.stringify(result.bollywoodMedia)}`)
  }
  if (!result.processVideo
    || result.processVideo.text !== 'Watch the video.'
    || result.processVideo.href !== 'https://www.youtube.com/watch?si=-NXdBuo8rl8b6hZT&v=-od3mv_pHHQ&feature=youtu.be'
    || result.processVideo.target !== '_blank'
    || !result.processVideo.rel?.includes('noopener')
    || !result.processVideo.rel?.includes('noreferrer')
    || !result.processVideo.decoration.includes('underline')
    || result.processVideo.height < 44
    || result.processVideo.top < result.processVideo.bodyBottom) {
    throw new Error(`${label}: process video CTA mismatch ${JSON.stringify(result.processVideo)}`)
  }
  if (result.trust !== 'Trusted by 6,000+ men around the world') {
    throw new Error(`${label}: unexpected hero trust copy ${JSON.stringify(result.trust)}`)
  }
  if (result.trustAvatars.length !== 5 || result.trustAvatars.some((avatar, index) =>
    avatar.src !== `/hair-transplant/trusted-client-${index + 1}.png`
      || avatar.width !== 98
      || avatar.height !== 98
      || avatar.renderedWidth !== 38
      || avatar.renderedHeight !== 38
  )) {
    throw new Error(`${label}: hero trust avatars mismatch ${JSON.stringify(result.trustAvatars)}`)
  }
  if (width <= 900 && !result.railScrollable) throw new Error(`${label}: benefit rail should swipe on mobile`)
  if (width > 900 && result.railScrollable) throw new Error(`${label}: benefit cards should fit desktop grid`)
  if (reducedMotion && (!result.reducedCard || result.reducedCard.opacity !== '1' || result.reducedCard.transform !== 'none')) {
    throw new Error(`${label}: reduced-motion content is not settled ${JSON.stringify(result.reducedCard)}`)
  }

  if (!reducedMotion) {
    await page.click('.htBollywood .htAction')
    await new Promise((resolve) => setTimeout(resolve, 700))
    const formPosition = await page.$eval('#hair-transplant-form', (element) => Math.abs(element.getBoundingClientRect().top))
    if (formPosition > 240) throw new Error(`${label}: consultation action did not reach form (${formPosition}px)`)
  }

  if (errors.length) throw new Error(`${label}: console errors ${errors.join(' | ')}`)
  if (failed.length) throw new Error(`${label}: failed requests ${failed.join(' | ')}`)

  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((resolve) => setTimeout(resolve, 250))
  if (!reducedMotion) {
    await page.screenshot({ path: `${out}/hair-transplant-${label}-full.png`, fullPage: true })
    const benefitsSection = await page.$('.htBenefits')
    await benefitsSection?.screenshot({ path: `${out}/hair-transplant-${label}-benefits.png` })
    const comparisonSection = await page.$('.htCompare')
    await comparisonSection?.screenshot({ path: `${out}/hair-transplant-${label}-comparison.png` })
    const bollywoodSection = await page.$('.htBollywood')
    await bollywoodSection?.screenshot({ path: `${out}/hair-transplant-${label}-bollywood.png` })
    const processSection = await page.$('.htProcess')
    await processSection?.screenshot({ path: `${out}/hair-transplant-${label}-process.png` })
  }

  console.log(label, JSON.stringify(result))
  await page.close()
}

await run(1440, 900, 'desktop')
await run(1024, 900, 'tablet')
await run(820, 900, 'small-tablet')
await run(390, 844, 'mobile')
await run(1440, 900, 'reduced', true)

await browser.close()
