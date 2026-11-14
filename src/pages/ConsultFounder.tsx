import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Building2,
  Check,
  HeartCrack,
  ShieldCheck,
  Video,
  X,
} from 'lucide-react'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { usePrefersReducedMotion } from '../hooks'
import { StoryReels } from '../components/StoryReels'
import { storyReels } from '../site'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const bookingHref = 'tel:+919222666111'

const decisionCards = [
  {
    icon: BadgeIndianRupee,
    title: 'Wasted Money',
    body: 'Spending lakhs on treatments that were never going to work for your grade of hair loss.',
  },
  {
    icon: HeartCrack,
    title: 'Unnatural Results',
    body: 'Ending up with a noticeable, fake-looking hairline that draws the wrong kind of attention.',
  },
  {
    icon: ArrowDownRight,
    title: 'Loss of Confidence',
    body: 'The emotional toll of a failed procedure is worse than the initial hair loss itself.',
  },
] as const

const rightFor = [
  'Serious individuals who want absolute clarity.',
  'Those actively considering a hair system or transplant.',
  'Professionals who care deeply about a 100% natural look.',
] as const

const notRightFor = [
  'Casual inquiries looking for free generic advice.',
  'People just price-shopping without valuing expertise.',
  'Those unwilling to invest in their appearance.',
] as const

const outcomes = [
  <><strong>A crystal-clear</strong> understanding of the root cause of your hair loss.</>,
  <>The exact <strong>right solution</strong> tailored for you (system vs. transplant vs. medical).</>,
  <><strong>Honest truth</strong> about what will look natural vs. what will look fake on your head.</>,
  <>A <strong>definitive list of treatments</strong> and procedures you must avoid.</>,
  <>A <strong>personalized</strong>, step-by-step direction to restore your hair.</>,
] as const

const founderPoints = [
  <>
    I&apos;m <strong>Vinitt Dessai</strong>, founder of American Hairline. Over the years, I&apos;ve worked
    intimately with high-profile professionals, entrepreneurs, and individuals who cannot afford to look
    anything less than their best.
  </>,
  <>
    My entire focus is on <strong>natural, undetectable results.</strong> I&apos;ve seen the devastating effects
    of botched transplants and cheap hair systems. I know exactly what works and what fails miserably.
  </>,
  <>
    This is not a generic sales pitch disguised as a consultation. It is a <strong>highly personalized
    strategy session</strong>, available via video call or in person, based on real transformations and real
    mistakes I&apos;ve helped men avoid.
  </>,
] as const

const steps = [
  {
    title: 'Book',
    body: 'Reserve your slot, select video or in-person, and pay the ₹5,000 fee.',
  },
  {
    title: 'Share Details',
    body: 'Send photos of your current hair situation before the session.',
  },
  {
    title: 'Your Session',
    body: 'A private 45–60 min conversation with Vinitt Dessai at your convenience.',
  },
  {
    title: 'Clarity',
    body: 'Walk away with a precise, personalized plan and zero guesswork.',
  },
] as const

function BookingButton({ children }: { children: string }) {
  return (
    <a className="cfButton" href={bookingHref} aria-label={`${children}. Call American Hairline at 9222666111`}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  )
}

function Modes({ pills = false }: { pills?: boolean }) {
  return (
    <div className={`cfModes${pills ? ' cfModes--pills' : ''}`} aria-label="Consultation modes">
      <span><Video aria-hidden="true" />Video Call</span>
      {!pills && <i aria-hidden="true" />}
      {pills && <small>or</small>}
      <span><Building2 aria-hidden="true" />In-Person</span>
    </div>
  )
}

export function ConsultFounder() {
  const pageRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(() => {
    const page = pageRef.current
    if (!page) return

    const animated = page.querySelectorAll('[data-cf-animate], [data-cf-reveal], [data-cf-stagger] > *')
    if (reducedMotion) {
      gsap.set(animated, { clearProps: 'all' })
      return
    }

    const hero = gsap.timeline({ defaults: { duration: 0.72, ease: 'power3.out' } })
    hero
      .from('[data-cf-animate="eyebrow"]', { autoAlpha: 0, y: -12 })
      .from('[data-cf-animate="title"]', { autoAlpha: 0, y: 28 }, '-=0.45')
      .from('[data-cf-animate="lede"]', { autoAlpha: 0, y: 18 }, '-=0.42')
      .from('[data-cf-animate="actions"]', { autoAlpha: 0, y: 16 }, '-=0.42')

    gsap.utils.toArray<HTMLElement>('[data-cf-section]').forEach((section) => {
      const revealItems = section.querySelectorAll('[data-cf-reveal]')
      const staggerItems = section.querySelectorAll('[data-cf-stagger] > *')
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      if (revealItems.length) {
        timeline.from(revealItems, {
          autoAlpha: 0,
          y: 28,
          duration: 0.68,
          stagger: 0.08,
          ease: 'power3.out',
        })
      }
      if (staggerItems.length) {
        timeline.from(staggerItems, {
          autoAlpha: 0,
          y: 24,
          duration: 0.58,
          stagger: 0.09,
          ease: 'power2.out',
        }, '-=0.35')
      }
    })

    const processLine = page.querySelector<HTMLElement>('[data-cf-process-line]')
    if (processLine) {
      gsap.from(processLine, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: processLine,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      })
    }
  }, { scope: pageRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <>
      <Nav />
      <main className="consultFounder" ref={pageRef}>
        <section className="cfHero" aria-labelledby="consult-founder-title">
          <div className="cfWrap cfHero__in">
            <div className="cfEyebrow" data-cf-animate="eyebrow">
              <ShieldCheck aria-hidden="true" />
              <span>1-on-1 Consultation</span>
            </div>
            <h1 id="consult-founder-title" data-cf-animate="title">
              <span>Not Sure What Will Work </span>
              <span>For Your Hair? </span>
              <strong>Speak Directly with <br />the Founder.</strong>
            </h1>
            <p className="cfHero__lede" data-cf-animate="lede">
              After <strong>helping thousands of men</strong> restore their hair and confidence, <strong>Vinitt
              Dessai</strong> personally consults a limited number of individuals who want clarity before making
              the wrong decision.
            </p>
            <div className="cfHero__actions" data-cf-animate="actions">
              <Modes />
              <BookingButton>Book Your Consultation Now</BookingButton>
              <small>Limited slots available each week</small>
            </div>
          </div>
        </section>

        <section className="cfSection cfSection--soft cfDecision" data-cf-section aria-labelledby="cf-decision-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-decision-title">
                Most Men Don&apos;t Have A Hair Problem.<br />
                They Have A <strong className="cfRed">Decision Problem.</strong>
              </h2>
              <p>
                You try oils, PRP, minoxidil, or rush into a transplant without knowing if it&apos;s the right
                choice for your specific condition. The result of choosing the wrong solution?
              </p>
            </header>
            <div className="cfDecision__grid" data-cf-stagger>
              {decisionCards.map(({ icon: Icon, title, body }) => (
                <article className="cfCard cfDecision__card" key={title}>
                  <span className="cfDecision__icon"><Icon aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <p className="cfDecision__close" data-cf-reveal>
              This consultation exists to <strong>help you avoid<br />that exact mistake.</strong>
            </p>
          </div>
        </section>

        <section className="cfSection cfAudience" data-cf-section aria-labelledby="cf-audience-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-audience-title">This Is Not For Everyone</h2>
              <p>
                To ensure the highest quality of advice, Vinitt Dessai only speaks with individuals who<br />
                are serious about finding a permanent, natural-looking solution.
              </p>
            </header>
            <div className="cfAudience__grid" data-cf-stagger>
              <article className="cfCard cfAudience__card cfAudience__card--yes">
                <h3>Who This Is For</h3>
                <ul>
                  {rightFor.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              </article>
              <article className="cfCard cfAudience__card cfAudience__card--no">
                <h3>Who This Is NOT For</h3>
                <ul>
                  {notRightFor.map((item) => <li key={item}><X aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="cfSection cfSection--soft cfOutcomes" data-cf-section aria-labelledby="cf-outcomes-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-outcomes-title">What You&apos;ll Walk Away With</h2>
              <p>From a single 45–60 minute session — video or in-person.</p>
            </header>
            <ul className="cfOutcomes__grid" data-cf-stagger>
              {outcomes.map((item, index) => (
                <li className="cfCard" key={index}>
                  <span><Check aria-hidden="true" /></span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cfSection cfFounder" data-cf-section aria-labelledby="cf-founder-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-founder-title">Why This Consultation Is Different</h2>
            </header>
            <div className="cfFounder__grid">
              <figure className="cfFounder__media" data-cf-reveal>
                <img
                  src="/consult-founder.png"
                  alt="Vinitt Dessai, founder of American Hairline"
                  width={1400}
                  height={1050}
                  loading="lazy"
                />
              </figure>
              <article className="cfCard cfFounder__copy" data-cf-reveal>
                <ul>
                  {founderPoints.map((point, index) => <li key={index}><span aria-hidden="true" /> <p>{point}</p></li>)}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="cfSection cfSection--soft cfValue" data-cf-section aria-labelledby="cf-value-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-value-title">Why Clients Gladly Pay ₹5,000 For This</h2>
            </header>
            <div className="cfValue__grid" data-cf-stagger>
              <article className="cfCard cfValue__card cfValue__card--cost">
                <h3>The Cost of Guessing</h3>
                <strong>₹50k - ₹3L+</strong>
                <p>
                  This is what a wrong decision costs. Failed transplants, low-quality systems, and endless
                  &quot;miracle&quot; treatments that drain your wallet and destroy your confidence.
                </p>
              </article>
              <article className="cfCard cfValue__card cfValue__card--clarity">
                <h3>The Value of Clarity</h3>
                <strong>₹5,000</strong>
                <p>
                  A one-time investment to get an expert, unbiased roadmap. You save months of research,
                  anxiety, and potentially lakhs of rupees.
                </p>
              </article>
            </div>
            <p className="cfValue__close" data-cf-reveal>
              It&apos;s not a cost. <strong>It&apos;s clarity before commitment.</strong>
            </p>
          </div>
        </section>

        <section className="cfSection cfProcess" data-cf-section aria-labelledby="cf-process-title">
          <div className="cfWrap">
            <header className="cfSection__head" data-cf-reveal>
              <h2 id="cf-process-title">How It Works</h2>
              <p>Choose your preferred mode at the time of booking.</p>
              <Modes pills />
            </header>
            <div className="cfSteps">
              <span className="cfSteps__line" data-cf-process-line aria-hidden="true" />
              <ol data-cf-stagger>
                {steps.map((step, index) => (
                  <li className="cfStep" key={step.title}>
                    <span className="cfStep__number">{index + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="cfFinal" data-cf-section aria-labelledby="cf-final-title">
          <div className="cfWrap">
            <article className="cfFinal__card" data-cf-reveal>
              <h2 id="cf-final-title">
                Still Thinking?<br />The Wrong Decision Costs<br />More Than ₹5,000.
              </h2>
              <p>If you&apos;re already considering a solution, this conversation will help you<br />make the right choice.</p>
              <BookingButton>Book Consultation With Founder</BookingButton>
              <small>Limited slots available each week</small>
            </article>
          </div>
        </section>
        <StoryReels set={storyReels.founder} />
      </main>
      <Footer />
    </>
  )
}
