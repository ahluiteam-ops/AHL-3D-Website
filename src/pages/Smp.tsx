import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Check,
  LockKeyhole,
  Pill,
  Plus,
  Smile,
  Syringe,
  UserRound,
  X,
} from 'lucide-react'
import { motion, useMotionValue } from 'motion/react'
import { Footer } from '../components/Footer'
import { GuideHero } from '../components/GuideHero'
import { Nav } from '../components/Nav'
import { usePrefersReducedMotion } from '../hooks'
import { StoryReels } from '../components/StoryReels'
import { storyReels } from '../site'

const results = [1, 3, 4, 5, 6, 7, 2].map((asset, index) => ({
  src: `/smp/result-${asset}.jpg`,
  alt: `Scalp micropigmentation client transformation ${index + 1}`,
}))

const processSteps = [
  {
    step: 'Step 01',
    title: 'Hairline Design & Consultation',
    body: 'We assess your face shape, age, and lifestyle before designing your ideal hairline.',
    image: '/smp/process-1.png',
    height: 704,
    alt: 'Specialist designing a client’s hairline before SMP treatment',
  },
  {
    step: 'Step 02',
    title: 'SMP Session',
    body: 'Our specialists replicate real follicles using 3rl & 1rl micro-needles and carbon-based ink.',
    image: '/smp/process-2.png',
    height: 702,
    alt: 'Specialist performing a scalp micropigmentation session',
  },
  {
    step: 'Step 03',
    title: 'Build Gradually',
    body: '2–3 sessions, spaced 7–10 days apart, build density layer by layer for a natural look.',
    image: '/smp/process-3.png',
    height: 704,
    alt: 'Client showing gradually built scalp micropigmentation density',
  },
  {
    step: 'Step 04',
    title: 'Final Look & Touch-Up',
    body: 'Instant confidence restored. Touch-ups are only needed every 18–30 months.',
    image: '/smp/process-4.png',
    height: 704,
    alt: 'Client’s completed scalp micropigmentation result',
  },
]

const treatments = [
  {
    id: 'alopecia',
    label: 'Alopecia',
    title: 'For Alopecia:',
    image: '/smp/alopecia.jpg',
    alt: 'Before and after scalp micropigmentation for alopecia',
    points: [
      <><strong>Patchy Loss:</strong> Tiny dots in bald patches reduce scalp visibility; keep hair slightly longer for natural blending.</>,
      <><strong>Overall Loss (60%+):</strong> Very short cut + pigments across scalp create full look. Hairline kept receded with fine, uneven dots for realism.</>,
    ],
  },
  {
    id: 'front-hairline',
    label: 'Front Hairline',
    title: 'For Front Hairline:',
    image: '/smp/front-hairline.jpg',
    alt: 'Before and after SMP treatment for a thinning front hairline',
    points: [
      <><strong>Front hairline</strong> often looks thin with <strong>visible scalp</strong> patches.</>,
      <><strong>Pigment micro-dots</strong> make the hairline appear fuller and natural.</>,
      <>Even with low-density transplants, SMP <strong>blends seamlessly</strong> with hair.</>,
    ],
  },
  {
    id: 'scar-treatment',
    label: 'Scar Treatment',
    title: 'For Scar Treatment:',
    image: '/smp/scar-treatment.jpg',
    alt: 'Before and after SMP camouflage for a scalp scar',
    points: [
      <>SMP is an excellent option to <strong>cover transplant or surgery scars.</strong></>,
      <>Tiny pigment dots create the <strong>illusion of hair</strong> in the scar area.</>,
      <>Works for both <strong>FUT and FUE scars</strong>, making them look fuller.</>,
    ],
  },
  {
    id: 'crown-area',
    label: 'Crown Area',
    title: 'For Crown Area:',
    image: '/smp/crown-area.jpg',
    alt: 'Before and after scalp micropigmentation for crown thinning',
    points: [
      <>Most men begin losing hair from the <strong>crown</strong>, making it <strong>look thinner.</strong></>,
      <><strong>Pigment dots</strong> reduce scalp visibility, creating a darker, <strong>fuller crown.</strong></>,
      <>SMP doesn’t affect existing hair since dots are placed <strong>only on the surface.</strong></>,
    ],
  },
  {
    id: 'full-head',
    label: 'Full Head',
    title: 'For Full Head:',
    image: '/smp/full-head.jpg',
    alt: 'Completed full-head scalp micropigmentation treatment',
    points: [
      <>SMP makes <strong>hair look fuller</strong> by creating follicle-like dots on the scalp.</>,
      <>Pigments are placed on <strong>top, sides, back, and front</strong> to reduce scalp visibility.</>,
      <>Avoid regular use of <strong>black fibers</strong>, as they block the scalp and worsen <strong>hair loss.</strong></>,
    ],
  },
] as const

const whyPoints = [
  [<strong>Specialized</strong>, 'We specialize in Scalp Micropigmentation treatment services.'],
  [<strong>Certified 5 Times</strong>, 'India’s only expert certified five times in SMP.'],
  [<strong>Carbon-Based Ink</strong>, 'We use premium USA carbon-based ink designed only for SMP.'],
  [<strong>No Tattoo Ink</strong>, 'We never use tattoo ink, only safe SMP pigments are applied.'],
  [<strong>Precision Needles</strong>, 'We use 3rl and 1rl needles for natural SMP dot results.'],
  [<strong>Cheyenne Machine</strong>, 'We use Cheyenne, the USA’s finest SMP equipment available.'],
  [<strong>6,500+ Clients</strong>, 'We have successfully treated 6,500+ SMP clients nationwide.'],
  [<strong>Hairline Expertise</strong>, 'We design natural hairlines with perfect dot size and shape.'],
  [<strong>Dermatologist Training</strong>, 'We are the only institute training dermatologists in SMP.'],
  [<strong>Do’s & Don’ts</strong>, 'We provide detailed before and after-care SMP instructions.'],
] as const

/* Typed rather than inferred, and `a` is optional because **nine of these ten
 * questions have no answer yet** — only the first does. Inference produced a
 * union in which those members lacked `a` at all, which broke `tsc` and so the
 * whole build.
 *
 * Every question still renders: they are the client's own FAQ list and hiding
 * the unanswered ones would silently delete nine rows of their design. An
 * unanswered one opens onto an empty panel, which is the honest state of the
 * content — add the `a` and it fills in with no other change. */
const faqItems: { q: string; a?: string }[] = [
  {
    q: 'Is scalp micropigmentation painful?',
    a: 'Well, its not at all painful as we just deposit ink in the outer layer, that too after numbing the area. We can share hundreds of videos wherein they sharing their experiences with absolutely no pain.',
  },
  {
    q: 'Can SMP be done in one session?',
    a: 'Typically, SMP requires 2-3 sessions to achieve the perfect density and natural look. The first session lays the foundation, and subsequent sessions add depth and detail.',
  },
  {
    q: 'Does it fade?',
    a: 'SMP is semi-permanent and will fade over time (usually 3-5 years) but won’t discolor like a traditional tattoo. Periodic touch-ups maintain the fresh look.',
  },
  {
    q: 'Will my hair continue to grow?',
    a: 'Yes, SMP does not affect your natural hair growth. You can continue to grow your existing hair, but most clients keep it shaved for the best blend.',
  },
  {
    q: 'Time between each SMP session?',
    a: 'We recommend a gap of 7-10 days between sessions to allow the scalp to heal and the pigment to settle properly.',
  },
  {
    q: 'Do I need a touch up?',
    a: 'Yes, touch-ups are recommended every few years to maintain the sharpness and density of the pigmentation as it naturally fades.',
  },
  {
    q: 'Which machine you use for SMP?',
    a: 'We use the Cheyenne Hawk, a premium German-made machine specifically designed for precision micropigmentation work.',
  },
  {
    q: 'Are there any side effects of Scalp tattooing?',
    a: 'When performed by certified professionals, side effects are minimal. You might experience slight redness for a day or two, but no long-term adverse effects.',
  },
  {
    q: 'Scalp micro-pigmentation cost in India?',
    a: 'Costs vary depending on the area to be covered (hairline, crown, full head). We offer competitive pricing with flexible payment plans.',
  },
  {
    q: 'Which ink you use for scalp micro pigmentation?',
    a: 'We use high-quality, carbon-based organic pigments from the USA that are specifically formulated for SMP and do not change color over time.',
  },
] as const

function Eyebrow() {
  return (
    <span className="smpEyebrow">
      <img src="/smp/syringe.svg" alt="" width={20} height={20} aria-hidden="true" />
      SMP
    </span>
  )
}

function SmpHero() {
  return (
    <GuideHero
      titleId="smp-hero-title"
      eyebrow="SMP"
      eyebrowIcon="/smp/syringe.svg"
      title={
        <>
          <span className="smpNoBreak">Natural-Looking</span> Scalp Micro
          <br className="smpHeroBreak" />
          {' '}Pigmentation (SMP) In India
        </>
      }
      lede="SMP is a safe, **non-surgical procedure** that adds **pigment(color)** to the scalp, mimicking real hair. It restores density and improves the appearance of **thinning areas**, giving you a **natural, fuller look.**"
      media={{
        poster: '/smp/hero.jpg',
        alt: 'Specialist applying scalp micropigmentation to a client',
        width: 2240,
        height: 1260,
      }}
      showPlay={false}
    />
  )
}

function SmpResults() {
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const still = usePrefersReducedMotion()
  const [layout, setLayout] = useState({ distance: 0, pinHeight: 0 })
  const x = useMotionValue(0)

  useEffect(() => {
    const measure = () => {
      const pinElement = pin.current
      const railElement = rail.current
      const trackElement = track.current
      if (!pinElement || !railElement || !trackElement) return
      const pinHeight = pinElement.scrollHeight
      const canPin = window.matchMedia('(min-width: 901px)').matches && !still && pinHeight <= window.innerHeight
      const distance = canPin ? Math.max(0, trackElement.scrollWidth - railElement.clientWidth) : 0
      setLayout((current) => current.distance === distance && current.pinHeight === pinHeight
        ? current
        : { distance, pinHeight })
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (pin.current) observer.observe(pin.current)
    if (rail.current) observer.observe(rail.current)
    if (track.current) observer.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [still])

  const pinned = layout.distance > 0

  useEffect(() => {
    if (!pinned) {
      x.set(0)
      return
    }

    let frame = 0
    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const sectionTop = section.current?.offsetTop ?? 0
        const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / layout.distance))
        x.set(-layout.distance * progress)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [layout.distance, pinned, x])

  return (
    <section
      className={`smpResults${pinned ? ' is-pinned' : ''}`}
      ref={section}
      aria-labelledby="smp-results-title"
      style={pinned ? { height: `${layout.pinHeight + layout.distance}px` } : undefined}
    >
      <div className="smpResults__pin" ref={pin}>
        <div className="smpResults__head wrap">
          <h2 id="smp-results-title">Real Results That Showcase<br />True Transformations</h2>
        </div>
        <div
          className="smpResults__rail"
          ref={rail}
          role="region"
          aria-label="Scalp micropigmentation transformation gallery. Swipe or use arrow keys to browse."
          tabIndex={pinned ? undefined : 0}
        >
          <motion.div className="smpResults__track" ref={track} style={pinned ? { x } : undefined}>
            {results.map((result, index) => (
              <figure className="smpResults__card" key={result.src}>
                <img src={result.src} alt={result.alt} width={920} height={1150} loading={index < 2 ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function AboutSmp() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const dialog = close.current?.closest('[role="dialog"]')
      const controls = dialog?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      trigger.current?.focus()
    }
  }, [open])

  return (
    <section className="smpAbout" aria-labelledby="smp-about-title">
      <div className="wrap">
        <button className="smpAbout__card" type="button" onClick={() => setOpen(true)} ref={trigger} aria-haspopup="dialog">
          <span className="smpAbout__copy"><Eyebrow /><span className="smpAbout__title" id="smp-about-title">About <strong>Scalp<br />Micropigmentation</strong></span></span>
          <img src="/smp/about-card.png" alt="Scalp micropigmentation result viewed from above" width={1000} height={920} loading="lazy" />
          <span className="smpAbout__plus" aria-hidden="true"><Plus /></span>
        </button>
      </div>

      {open && (
        <div className="smpModal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
          <div className="smpModal__dialog" role="dialog" aria-modal="true" aria-labelledby="smp-modal-title">
            <button className="smpModal__close" type="button" aria-label="Close SMP details" onClick={() => setOpen(false)} ref={close}><X aria-hidden="true" /></button>
            <div className="smpModal__copy">
              <h2 id="smp-modal-title">About <span>Scalp Micropigmentation</span></h2>
              <p>Scalp micropigmentation creates the illusion of hair growth with <strong>no side effects</strong> when done by <strong>trained experts</strong> using the right ink. We use carbon-based inks designed for Indian skin, trained by <strong>international academies.</strong></p>
              <h3>Pros</h3>
              <ul className="smpModal__pros">
                <li><Check aria-hidden="true" /> No Scar / No pain</li>
                <li><Check aria-hidden="true" /> 100% Safe</li>
                <li><Check aria-hidden="true" /> Results within a month</li>
                <li><Check aria-hidden="true" /> Makes the scalp look fuller</li>
              </ul>
              <h3>Cons</h3>
              <ul className="smpModal__cons">
                <li><X aria-hidden="true" /> Needs touch up after 2 years</li>
                <li><X aria-hidden="true" /> SMP does not regrow hair</li>
              </ul>
            </div>
            <img className="smpModal__image" src="/smp/about-modal.png" alt="Close view of a completed scalp micropigmentation treatment" width={1000} height={1085} />
          </div>
        </div>
      )}
    </section>
  )
}

function PerfectFor() {
  const items = [
    [LockKeyhole, <>You want a <strong>permanent solution</strong> that looks real.</>],
    [Pill, <>You are tired of <strong>oils, shampoos, or pills</strong> that don’t work.</>],
    [Syringe, <>You don’t want the <strong>pain, cost, or downtime</strong> of a transplant.</>],
    [UserRound, <>You want <strong>scars or alopecia patches</strong> covered naturally.</>],
  ] as const
  return (
    <section className="smpPerfect" aria-labelledby="smp-perfect-title">
      <div className="wrap smpPerfect__grid">
        <h2 id="smp-perfect-title">SMP Is Perfect For<br />You If...</h2>
        <div className="smpPerfect__list">
          {items.map(([Icon, copy], index) => <div className="smpPerfect__item" key={index}><span><Icon aria-hidden="true" /></span><p>{copy}</p></div>)}
          <div className="smpPerfect__cta">
            <Smile aria-hidden="true" />
            <div><h3>If this sounds like YOU,<br />SMP is perfect for YOU.</h3><p>It’s a natural-looking solution that creates the illusion of a fuller hairline by replicating hair follicles on the scalp.</p><a href="#smp-form">Talk to an Expert <ArrowUpRight aria-hidden="true" /></a></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Situations() {
  const items = [
    <><strong>Genetic</strong> or hereditary factors</>,
    <><strong>Alopecia</strong> and patchy hair loss</>,
    <><strong>Hormonal</strong> or chemical imbalance</>,
    <><strong>Age-related</strong> hair thinning</>,
    <>Medication or treatment side effects</>,
    <>Hair loss caused by <strong>stress</strong></>,
  ]
  return (
    <section className="smpSituations" aria-labelledby="smp-situations-title">
      <div className="wrap"><h2 id="smp-situations-title">SMP Works For Every<br />Situation</h2><div className="smpSituations__grid">{items.map((item, index) => <div key={index}><Check aria-hidden="true" /><p>{item}</p></div>)}</div></div>
    </section>
  )
}

function SmpProcess() {
  return (
    <section className="smpProcess" aria-labelledby="smp-process-title">
      <div className="wrap"><h2 id="smp-process-title">The Step-By-Step Process<br />To Fuller Look</h2></div>
      <div
        className="smpProcess__rail wrap"
        role="region"
        aria-label="SMP step-by-step process. Swipe or use arrow keys to browse."
        tabIndex={0}
      >
        {processSteps.map((item) => <article className="smpProcess__card" key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.body}</p><img src={item.image} alt={item.alt} width={600} height={item.height} loading="lazy" /></article>)}
      </div>
    </section>
  )
}

function TreatmentFinder() {
  const [active, setActive] = useState(0)
  const item = treatments[active]
  return (
    <section className="smpTreatments" aria-labelledby="smp-treatments-title">
      <div className="wrap">
        <h2 id="smp-treatments-title">Find The SMP Treatment For<br />Your Concern</h2>
        <div className="smpTreatments__tabs" role="tablist" aria-label="SMP treatment concerns">
          {treatments.map((treatment, index) => <button key={treatment.id} type="button" role="tab" id={`smp-tab-${treatment.id}`} aria-selected={active === index} aria-controls={`smp-panel-${treatment.id}`} onClick={() => setActive(index)}>{treatment.label}</button>)}
        </div>
        <div className="smpTreatments__panel" role="tabpanel" id={`smp-panel-${item.id}`} aria-labelledby={`smp-tab-${item.id}`}>
          <img src={item.image} alt={item.alt} width={1400} height={1050} />
          <div className="smpTreatments__content"><div><h3>{item.title}</h3><ul>{item.points.map((point, index) => <li key={index}>{point}</li>)}</ul></div><a href="#smp-form">Book Your Treatment <ArrowUpRight aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  )
}

function WhyChoose() {
  return (
    <section className="smpWhy" aria-labelledby="smp-why-title"><div className="wrap"><h2 id="smp-why-title">Why Thousands Of Men<br />Choose American Hairline</h2><div className="smpWhy__grid">{whyPoints.map(([title, body], index) => <article key={index}><Check aria-hidden="true" /><p>{title} – {body}</p></article>)}</div></div></section>
  )
}

function SmpFaq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="smpFaq" aria-labelledby="smp-faq-title"><div className="wrap smpFaq__in"><header><h2 id="smp-faq-title">Frequently Asked Questions</h2></header><div className="smpFaq__list">{faqItems.map((item, index) => { const expanded = open === index; return <article className="smpFaq__item" key={item.q} data-open={expanded ? 'true' : 'false'}><h3><button type="button" aria-expanded={expanded} aria-controls={`smp-answer-${index}`} onClick={() => setOpen(expanded ? -1 : index)}><span>{item.q}</span>{expanded ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}</button></h3><div className="smpFaq__answer" id={`smp-answer-${index}`}><div>{item.a ? <p>{item.a}</p> : null}</div></div></article> })}</div><aside><h3>Can’t find your answer?</h3><p>No worries, we’re here to guide you. Talk to us, we will explain everything.</p><a href="#smp-form">Contact Us <ArrowUpRight aria-hidden="true" /></a></aside></div></section>
  )
}

function SmpForm() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  return (
    <section className="smpForm" id="smp-form" aria-labelledby="smp-form-title"><div className="wrap smpForm__grid"><h2 id="smp-form-title">Fill This Form To Get The<br />Right Guidance</h2><form onSubmit={submit}><label htmlFor={`${id}-name`}>Name</label><input id={`${id}-name`} name="name" autoComplete="name" placeholder="Full Name" minLength={2} required /><label htmlFor={`${id}-phone`}>Phone Number</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(123)-456 7890" pattern="[+0-9() -]{10,18}" required /><label htmlFor={`${id}-city`}>City</label><select id={`${id}-city`} name="city" defaultValue="" required><option value="" disabled>Please select</option><option>Mumbai</option><option>Delhi</option><option>Bangalore</option><option>Other</option></select><label htmlFor={`${id}-area`}>Treatment Area</label><select id={`${id}-area`} name="treatment" defaultValue="" required><option value="" disabled>Please select</option>{treatments.map((item) => <option key={item.id}>{item.label}</option>)}</select><button type="submit">Submit <ArrowUpRight aria-hidden="true" /></button>{submitted && <p className="smpForm__status" role="status">Details validated. Online lead delivery is not connected yet.</p>}</form></div></section>
  )
}

export function Smp() {
  return <><Nav /><main className="smpPage"><SmpHero /><SmpResults /><AboutSmp /><PerfectFor /><Situations /><SmpProcess /><TreatmentFinder /><WhyChoose /><SmpFaq /><SmpForm /><StoryReels set={storyReels.smp} ground="tint" /></main><Footer /></>
}
