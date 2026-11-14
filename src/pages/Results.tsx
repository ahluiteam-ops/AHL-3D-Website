import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Check, Play, X } from 'lucide-react'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { Backed } from '../components/Backed'
import { ClientStories } from '../components/ClientStories'
import { Achievements } from '../components/Achievements'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks'
import '../styles/results.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Category = 'low density' | 'high density' | 'short hair' | 'medium hair' | 'long hair'
const testimonials: Record<string, string> = {
  'ADVIK SHARMA': 'My hair finally looks fuller without looking fake. That’s the best part.',
  'RYLAN RODRIGUES': 'The volume looks so natural, not overdone at all. Exactly what I wanted.',
  'CHANDAN SINGH': 'I didn’t expect it to look this real. It blends perfectly with my natural hair.',
  'VARUN DESAI': 'The transformation is unbelievable. It looks and feels so natural.',
  'DALJIT SINGH': 'The finish is so smooth and natural. I’m really happy with the result.',
  'SANJAY KUMAR': 'I was worried it would look obvious, but it blends seamlessly. The comfort is unmatched.',
  'RAHIL KHAN': 'The transformation is amazing. It feels light, comfortable, and completely natural.',
  'AZHAR SHAIKH': 'No one could tell I’ve done anything. That’s how seamless it looks.',
  'FUZAIL KHAN': 'It blends seamlessly with my natural hair. I feel like myself again, but better!',
  'SAURABH MISHRA': 'Exactly the kind of natural look I was hoping for. Loved the result.',
  'SAHIL KHAN': 'It feels so light and looks completely natural. I’m very satisfied.',
  'ROHIT CHOUDHARY': 'I was looking for something subtle, and this is perfect. It adds volume without looking too heavy.',
  'MANISH YADAV': 'The texture and finish are flawless. It’s exactly what I needed for a more confident look.',
  'NIKHIL PAWAR': 'The result is even better than I expected. It’s comfortable, looks natural, and feels great.',
  'PANKAJ BHATIA': 'The hair looks fuller without being too bulky. It’s exactly the natural look I wanted.',
}
const clientFiles: Record<Category, string[]> = {
  'low density': ['AZHAR SHAIKH DESKTOP STICK ON.png', 'FUZAIL KHAN DESKTOP CLIP ON.png', 'RAHIL KHAN DESKTOP CLIP ON.png', 'ROHIT CHOUDHARY DESKTOP STICK ON.png', 'SAHIL KHAN DESKTOP CLIP ON.png', 'SAURABH MISHRA DESKTOP STICK ON.png'],
  'high density': ['ADVIK SHARMA DESKTOP CLIP ON.png', 'CHANDAN SINGH DESKTOP STICK ON.png', 'DALJIT SINGH DESKTOP STICK ON.png', 'RYLAN RODRIGUES DESKTOP CLIP ON.png', 'VARUN DESAI DESKTOP CLIP ON.png'],
  'short hair': ['AZHAR SHAIKH DESKTOP STICK ON.png', 'DALJIT SINGH DESKTOP STICK ON.png', 'FUZAIL KHAN DESKTOP CLIP ON.png', 'ROHIT CHOUDHARY DESKTOP STICK ON.png', 'SAURABH MISHRA DESKTOP STICK ON.png'],
  'medium hair': ['ADVIK SHARMA DESKTOP CLIP ON.png', 'MANISH YADAV DESKTOP STICK ON.png', 'NIKHIL PAWAR DESKTOP STICK ON.png', 'PANKAJ BHATIA DESKTOP CLIP ON.png', 'RAHIL KHAN DESKTOP CLIP ON.png', 'RYLAN RODRIGUES DESKTOP CLIP ON.png', 'SAHIL KHAN DESKTOP CLIP ON.png'],
  'long hair': ['CHANDAN SINGH DESKTOP STICK ON.png', 'SANJAY KUMAR DESKTOP STICK ON.png'],
}
const categories: Array<{ id: Category | 'all'; label: string }> = [{ id: 'all', label: 'All' }, ...Object.keys(clientFiles).map(id => ({ id: id as Category, label: id.replace(/\b\w/g, c => c.toUpperCase()) }))]
const mistakes = [
  ['Too much density', 'Cheap systems pack too much hair, making it look instantly fake and helmet-like.'],
  ['Poor base materials', 'Thick plastic bases cause intense sweating, itching, and discomfort in Indian weather.'],
  ['Zero customization', 'Stock templates don’t match your facial structure, exposing the front hairline completely.'],
] as const
const approach = [
  ['Age-appropriate density', 'We calculate biological density based on your age and remaining hair for a natural blend.'],
  ['Premium breathable base', 'Swiss lace and ultra-thin skin hybrids allow your scalp to breathe.'],
  ['Precision design', 'Every unit is mapped to your skull curvature and features for an undetectable hairline.'],
] as const
const comparison = [
  ['Hairline recession', 'Hair transplant (12+ mos)', 'Non-surgical system (2 hrs)'],
  ['Crown thinning', 'Topical treatments', 'Instant volume, exact match'],
  ['Temple loss', 'Waiting / Powders', 'Precise custom design'],
  ['Advanced hair loss', 'PRP + months of waiting', 'Full coverage instantly'],
  ['Transplant failure', 'Risky revision surgery', 'Natural system over scar'],
] as const
const mobileFileOverrides: Partial<Record<`${Category}/${string}`, string>> = {
  'short hair/FUZAIL KHAN': 'FUZAIL KHAN MOBILE CLIPON.png',
  'low density/SAHIL KHAN': 'SAHIL KHAN Mobile clip on.png',
  'medium hair/SAHIL KHAN': 'SAHIL KHAN MOBILE clip on.png',
}

function parseClient(file: string, category: Category) {
  const match = file.match(/^(.+?) DESKTOP (CLIP ON|STICK ON)\.png$/i)
  const name = match?.[1] ?? file.replace('.png', '')
  const method = match?.[2] ?? 'STICK ON'
  const mobileFile = mobileFileOverrides[`${category}/${name}`] ?? `${name} MOBILE ${method}.png`
  return { file, category, mobileFile, name, system: method === 'CLIP ON' ? 'Clip-On Hair System' : 'Stick-On Hair System' }
}

export function Results() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [heroPlaying, setHeroPlaying] = useState(false)
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 700px)')
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const clients = useMemo(() => {
    if (category !== 'all') return clientFiles[category].map(file => parseClient(file, category))
    const seenNames = new Set<string>()
    return (Object.entries(clientFiles) as Array<[Category, string[]]>).flatMap(([group, files]) => files
      .map(file => parseClient(file, group))
      .filter(client => {
        if (seenNames.has(client.name)) return false
        seenNames.add(client.name)
        return true
      }))
  }, [category])
  useGSAP(() => {
    if (reduced || !track.current || !viewport.current || !section.current || window.matchMedia('(max-width: 700px)').matches) return
    let tween: gsap.core.Tween | undefined
    const frame = requestAnimationFrame(() => {
      if (!track.current || !viewport.current || !section.current) return
      gsap.set(track.current, { x: 0 })
      const distance = () => Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth)
      if (distance() === 0) return
      tween = gsap.to(track.current, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true } })
      ScrollTrigger.refresh()
    })
    return () => { cancelAnimationFrame(frame); tween?.kill() }
  }, { scope: section, dependencies: [category, reduced], revertOnUpdate: true })
  return (
    <div className="resultsPage">
      <Nav />
      <main>
        <section className="resultsHero" aria-labelledby="results-title">
          <div className="resultsHero__intro">
            <div className="resultsHero__eyebrow">
              <img src="/results/camera.svg" alt="" aria-hidden="true" width="18" height="18" />
              <span>Results</span>
            </div>
            <h1 id="results-title">Real Men. Real Hair<br />Transformations. Real<br className="resultsHero__desktopBreak" /> Confidence.</h1>
            <p>Watch real men go from hair loss to a confident, <strong>natural look</strong> and share the <strong>life-changing</strong> moments that truly changed everything.</p>
          </div>
          <div className="resultsHero__media">
            {heroPlaying ? (
              /* eslint-disable-next-line jsx-a11y/media-has-caption */
              <video src="/decide/client-before-after.mp4" poster="/results/results-hero.png" controls autoPlay playsInline />
            ) : (
              <button type="button" aria-label="Watch real hair transformations" onClick={() => setHeroPlaying(true)}>
                <img src="/results/results-hero.png" alt="" width="1536" height="1024" />
                <span className="resultsHero__play" aria-hidden="true"><Play fill="currentColor" /></span>
              </button>
            )}
          </div>
        </section>
        <section className="resultsStories" ref={section} aria-labelledby="results-stories-title">
          <div className="resultsStories__head"><h2 id="results-stories-title">See How Real People<br />Regain Hair And Confidence</h2><div className="resultsStories__filters" role="tablist" aria-label="Filter client results">{categories.map(item => <button key={item.id} className={category === item.id ? 'is-active' : ''} role="tab" aria-selected={category === item.id} onClick={() => { track.current?.scrollTo({ left: 0 }); setCategory(item.id) }}>{item.label}</button>)}</div></div>
          <div className="resultsStories__viewport" ref={viewport}><div className="resultsStories__track" ref={track}>{clients.map(client => <article className="resultsStory" key={`${client.category}-${client.file}`}><img src={mobile ? `/results/clients-mobile/${client.category}/${encodeURIComponent(client.mobileFile)}` : `/results/clients/${client.category}/${encodeURIComponent(client.file)}`} alt={`${client.name} hair transformation`} /><div className="resultsStory__overlay"><span className="resultsStory__name">{client.name}</span><p>“{testimonials[client.name]}”</p><a href={client.system === 'Clip-On Hair System' ? '#/clip-on-hair-system' : '#/stick-on-hair-system'}>{client.system} <ArrowUpRight size={15} /></a></div></article>)}</div></div>
        </section>
        <Backed />
        <ClientStories />
        <Achievements />
        <section className="resultsMistakes" aria-labelledby="results-mistakes-title">
          <div className="resultsSectionHead"><h2 id="results-mistakes-title">What Most People Get Wrong</h2><p>Not all hair systems are created equal. Here&apos;s why cheap alternatives fail, and why American Hairline succeeds.</p></div>
          <div className="resultsMistakes__grid">
            <article className="resultsMistakes__card resultsMistakes__card--wrong"><h3>Common Mistakes</h3><ul>{mistakes.map(([title, copy]) => <li key={title}><X aria-hidden="true" /><p><strong>{title}:</strong> {copy}</p></li>)}</ul></article>
            <article className="resultsMistakes__card resultsMistakes__card--right"><h3>Our Approach</h3><ul>{approach.map(([title, copy]) => <li key={title}><Check aria-hidden="true" /><p><strong>{title}:</strong> {copy}</p></li>)}</ul></article>
          </div>
        </section>
        <section className="resultsCompare" aria-labelledby="results-compare-title">
          <div className="resultsSectionHead"><h2 id="results-compare-title">Why Men Choose American Hairline</h2><p>Stop waiting months for &apos;maybe&apos;. Get guaranteed results today.</p></div>
          <div className="resultsCompare__table" role="table" aria-label="American Hairline comparison"><div className="resultsCompare__row resultsCompare__row--head" role="row"><strong role="columnheader">The Problem</strong><strong role="columnheader">Typical Solution</strong><strong role="columnheader">Our Solution</strong></div>{comparison.map(([problem, typical, ours]) => <div className="resultsCompare__row" role="row" key={problem}><strong role="cell">{problem}</strong><span role="cell" data-label="Typical Solution">{typical}</span><span role="cell" data-label="Our Solution">{ours}</span></div>)}</div>
        </section>
        <section className="resultsConsult" aria-labelledby="results-consult-title"><div className="resultsConsult__card"><h2 id="results-consult-title">Still Thinking?<br />Your Hair Won&apos;t Wait</h2><p>The sooner you act, the easier it is to <strong>restore your look.</strong> Book a private, <strong>no-obligation consultation</strong> with our experts today.</p><a href="#/consult-with-founder">Book Your Consultation <ArrowUpRight size={17} aria-hidden="true" /></a><small>Limited slots available every month. Reserve yours today.</small></div></section>
      </main>
      <Footer />
    </div>
  )
}
