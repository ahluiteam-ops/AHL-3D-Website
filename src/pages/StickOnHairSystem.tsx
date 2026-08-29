import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  Check,
  CircleCheck,
  Eye,
  Palette,
  Puzzle,
  RefreshCw,
  ShieldCheck,
  Smile,
  Target,
  X,
} from 'lucide-react'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Achievements } from '../components/Achievements'
import { Backed } from '../components/Backed'
import { Checklist } from '../components/Checklist'
import { ClientStories } from '../components/ClientStories'
import {
  ClipZyconRange,
  type ZyconRangeContent,
} from '../components/ClipZyconRange'
import { Footer } from '../components/Footer'
import { HairlineTruth } from '../components/HairlineTruth'
import { Nav } from '../components/Nav'
import { Photo, type Slot } from '../components/Photo'
import { StackRow, useScrollStack } from '../components/ScrollStack'

const media = {
  hero: {
    src: '/stick-on-system/hero.png',
    alt: 'A stick-on hair system being bonded to a shaved area of the scalp.',
    width: 2240,
    height: 1260,
  },
  localFail: {
    src: '/stick-on-system/local-fail.png',
    alt: 'A local hair patch with an unnatural fit and visible density mismatch.',
    width: 1320,
    height: 990,
  },
  naturalHairline: {
    src: '/stick-on-system/natural-hairline-before-after.png',
    alt: 'Before and after views showing a custom, natural-looking hairline.',
    width: 1320,
    height: 990,
  },
  learnClip: {
    src: '/stick-on-system/learn-clip-on.png',
    alt: 'A man wearing a lightweight clip-on hair system.',
    width: 1200,
    height: 1247,
  },
} satisfies Record<string, Slot>

const consultationCards = [
  {
    icon: Eye,
    title: 'We Check Your Scalp',
    body: 'We assess your scalp condition and the level of hair loss (Norwood scale).',
    media: {
      src: '/stick-on-system/consult-scalp.png',
      alt: 'A specialist assessing a client’s scalp and hair loss.',
      width: 880,
      height: 1010,
    },
  },
  {
    icon: Puzzle,
    title: 'We Show You Options',
    body: 'You’ll see different base types, and we’ll explain the pros and cons of each.',
    media: {
      src: '/stick-on-system/consult-options.png',
      alt: 'A specialist showing hair-system options to a client.',
      width: 880,
      height: 1010,
    },
  },
  {
    icon: Target,
    title: 'We Recommend What Fits You',
    body: 'We suggest the system that best fits your scalp, lifestyle, and preferences.',
    media: {
      src: '/stick-on-system/consult-recommend.png',
      alt: 'A specialist measuring and recommending a custom hair system.',
      width: 880,
      height: 1010,
    },
  },
  {
    icon: Palette,
    title: 'We Design It Just for You',
    body: 'We design perfect density, texture, and color to match your natural hair.',
    media: {
      src: '/stick-on-system/consult-design.png',
      alt: 'A specialist designing and styling a custom hair system for a client.',
      width: 880,
      height: 1010,
    },
  },
] as const

const whyPoints = [
  'First in India with **Antimicrobial Base** Technology for Scalp Safety',
  '**Medical-grade adhesives** from the USA for bonding (not cheap glues)',
  'Signature **natural hairline** artistry',
  '6700+ **custom systems** designed in 12+ countries',
  '**Exclusive creators** of Zycon™ range in India',
] as const

const zyconContent: ZyconRangeContent = {
  tag: 'Zycon Range • Pro Series',
  cardTitle: ['Premium Stick-On', 'With Medicated Hygiene'],
  sheetTitleLead: 'Premium Stick-On With Medicated Hygiene —',
  sheetTitleAccent: 'Zycon Range • Pro Series',
  body: [
    {
      text: 'The Zycon range is a stick-on hair system that supports scalp health by using ',
    },
    { text: 'antibacterial protection', strong: true },
    { text: ' and ' },
    { text: 'controlling odor', strong: true },
    {
      text: '. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle.',
    },
  ],
  action: { label: 'Know more', href: '#consult' },
  media: {
    background: {
      src: '/stick-on-system/zycon-gradient.png',
      alt: '',
      width: 1800,
      height: 934,
    },
    card: {
      src: '/stick-on-system/zycon-card.png',
      alt: 'A man wearing a premium stick-on hair system.',
      width: 1200,
      height: 1206,
    },
    overlay: {
      src: '/stick-on-system/zycon-overlay.png',
      alt: 'A man wearing the Zycon Pro Series stick-on hair system.',
      width: 1400,
      height: 1486,
    },
  },
}

function Lines({ children }: { children: readonly string[] }) {
  return children.map((line) => <span key={line}>{line} </span>)
}

function Emphasised({ text }: { text: string }) {
  return text.split('**').map((part, index) =>
    index % 2 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>,
  )
}

function ActionLink({ children }: { children: ReactNode }) {
  return (
    <a className="stickPage__action" href="#consult">
      {children}
      <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
    </a>
  )
}

function StickHero() {
  return (
    <section className="stickHero" aria-labelledby="stick-hero-title">
      <div className="wrap stickHero__in">
        <span className="stickHero__tag">
          {/* The tape mark, painted as a CSS mask like the guide heroes' own
              eyebrow icons — the supplied file's `fill="#000000"` is discarded
              and `--accent-ink` is painted through its shape, so the asset
              needed no recolouring. */}
          <span className="stickHero__tagIcon" aria-hidden="true" /> Stick-On
          Method
        </span>
        <h1 id="stick-hero-title">
          <Lines children={['The Closest Thing to a Hair', 'Transplant — No-Surgery Solution']} />
        </h1>
        <p>
          Invisible. <strong>Secure.</strong> Skin-safe adhesive. Bonds to a shaved area using{' '}
          <strong>medical-grade</strong> tape or glue for a <strong>natural hairline</strong> and
          long-lasting hold. Breathable and <strong>water-resistant</strong>, so you can shower,
          sleep, or workout with <strong>confidence.</strong>
        </p>
        <div className="stickHero__media">
          <Photo slot={media.hero} className="stickHero__photo" loading="eager" />
        </div>
      </div>
    </section>
  )
}

function LocalFail() {
  const bullets = [
    'The base is **too thick**, so it doesn’t sit flat on the scalp.',
    'The hair density is **uneven**, so it looks “placed,” not natural.',
    '**Cheap glue** causes itching and starts peeling with sweat.',
    'After a few weeks, the **system looks fake** and loses shape.',
    'The hair texture and hairline **look unnatural** and aren’t designed for you.',
  ]

  return (
    <section className="stickLocal" aria-labelledby="stick-local-title">
      <div className="wrap">
        <h2 id="stick-local-title">
          <Lines children={['Why Most Local Hair', 'Systems Fail']} />
        </h2>
        <div className="stickLocal__grid">
          <Photo slot={media.localFail} className="stickLocal__photo" />
          <div className="stickLocal__content">
            <div className="stickLocal__card">
              <h3>Why It Looks Fake:</h3>
              <ul>
                {bullets.map((bullet) => (
                  <li key={bullet}>
                    <span aria-hidden="true">•</span>
                    <p><Emphasised text={bullet} /></p>
                  </li>
                ))}
              </ul>
            </div>
            <ActionLink>Talk To An Expert</ActionLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Consultation() {
  const railRef = useRef<HTMLDivElement>(null)
  const move = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * Math.max(280, railRef.current.clientWidth * 0.72),
      behavior: 'smooth',
    })
  }

  return (
    <section className="stickConsult" aria-labelledby="stick-consult-title">
      <div className="wrap">
        <h2 id="stick-consult-title">
          <Lines children={['At American Hairline, We Don’t', 'Do One-Size-Fits-All']} />
        </h2>
        <p className="stickConsult__lede">Here’s what happens during your consultation:</p>
        <div className="stickConsult__rail" ref={railRef}>
          {consultationCards.map(({ icon: Icon, title, body, media: cardMedia }) => (
            <article className="stickConsult__card" key={title}>
              <Icon className="stickConsult__icon" size={40} strokeWidth={1.8} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
              <Photo slot={cardMedia} className="stickConsult__photo" />
            </article>
          ))}
        </div>
        <div className="stickConsult__controls" aria-label="Consultation cards">
          <button type="button" onClick={() => move(-1)} aria-label="Previous cards">
            <ArrowRight size={22} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next cards">
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

function NaturalHairline() {
  const points = [
    'Ultra-thin lace fronts.',
    'Customized hairline shapes to match your younger self.',
    'Graduated density hair looks like it grows from your scalp.',
    'Blending cuts that merge seamlessly.',
  ]

  return (
    <section className="stickNatural" aria-labelledby="stick-natural-title">
      <div className="wrap">
        <h2 id="stick-natural-title">
          <Lines children={['Our Ultra-Signature Natural', 'Hairline, Just For You']} />
        </h2>
        <div className="stickNatural__grid">
          <div className="stickNatural__copy">
            <div className="stickNatural__card">
              {/* The space before the break is a real text node. A bare `<br>` produces
                  none, so this announced as "fail here.At American Hairline". */}
              <h3>
                The hairline is the ultimate test. Most patches fail here.{' '}
                <br />
                At American Hairline, we specialize in:
              </h3>
              <ul>
                {points.map((point) => (
                  <li key={point}>
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ActionLink>Talk To An Expert</ActionLink>
          </div>
          <Photo slot={media.naturalHairline} className="stickNatural__photo" />
        </div>
      </div>
    </section>
  )
}

const perfectRows = [
    /* "Don't", not "Doesn't": the heading above reads "Stick-On Is Perfect For
     Men Who…" and every other row continues it in the plural. */
  { icon: RefreshCw, text: 'Don’t want the hassle of daily clip-on wear and removal.' },
  { icon: CalendarDays, text: 'Open to servicing every 20–25 days (haircut, cleaning, re-fixing).' },
  { icon: ShieldCheck, text: 'Need a secure, activity-proof solution that stays firmly in place.' },
  { icon: CircleCheck, text: 'Want a solution that’s as close to a hair transplant as possible.' },
] as const

function StickPerfectFor() {
  const { sectionRef, still, progress, last } = useScrollStack(perfectRows.length + 1)
  const sectionStyle = { '--perfect-steps': perfectRows.length } as CSSProperties

  return (
    <section
      className={`perfect stickPerfect${still ? ' perfect--still' : ''}`}
      ref={sectionRef}
      style={sectionStyle}
      aria-labelledby="stick-perfect-title"
    >
      <div className="perfect__pin">
        <div className="perfect__in wrap">
          <h2 className="perfect__title" id="stick-perfect-title">
            <Lines children={['Stick-On Is Perfect For', 'Men Who…']} />
          </h2>
          <ol className="perfect__rows">
            {perfectRows.map(({ icon: Icon, text }, index) => (
              <StackRow
                key={text}
                index={index}
                last={last}
                progress={progress}
                still={still}
                className="perfect__row"
                innerClassName="perfect__rowIn"
              >
                <span className="perfect__icon" aria-hidden="true"><Icon size={20} strokeWidth={2.2} /></span>
                <p>{text}</p>
              </StackRow>
            ))}
            <StackRow
              index={last}
              last={last}
              progress={progress}
              still={still}
              className="perfect__row perfect__row--cta"
              innerClassName="perfect__rowIn"
            >
              <Smile className="perfect__ctaMark" size={28} strokeWidth={2} aria-hidden="true" />
              <h3>If this sounds like YOU, Stick-On is made for YOU.</h3>
              <p>It’s secure, easy to apply, and looks just like your real hair.</p>
              <a className="perfect__ctaBtn" href="#consult">
                Talk To An Expert <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </StackRow>
          </ol>
        </div>
      </div>
    </section>
  )
}

const comparisonRows = [
  ['Base Thickness', 'Thick and visible', 'Super-thin and invisible'],
  ['Look & Hairline', 'Wiggy and obvious', 'Natural, like a transplant'],
  ['Density / Texture', 'Mismatched and generic', 'Custom to scalp & age'],
  ['Scalp Safety', 'Cheap adhesives', 'Uses safe, medical-grade bonding'],
  ['Hygiene', 'Traps sweat and bacteria', 'Antimicrobial and odor-free'],
  ['Security', 'Loosens with sweat', 'Activity-proof: gym, swim, running'],
  ['Longevity', 'Looks fake quickly', 'Natural look, lasts until next service'],
] as const

/**
 * "Local Patches Vs Our Patches".
 *
 * **The `.compare` table language, not a bespoke table.** The first build styled
 * its own: `min-width: 620px` inside an `overflow-x: auto` scroller, which on a
 * phone renders as a horizontal slider. The site's `.compare` classes — the
 * pages 2, 3 and 5 tables — share the width three ways and wrap instead, so the
 * table fits every viewport with no scrolling, and this section stops carrying
 * seventy lines of duplicate table CSS.
 */
function LocalComparison() {
  return (
    <section className="compare stickCompare" aria-labelledby="stick-compare-title">
      <div className="wrap">
        <div className="compare__header">
          <h2 className="compare__title" id="stick-compare-title">
            Local Patches Vs Our Patches
          </h2>
        </div>

        <div className="compare__tableCard">
          <div className="compare__tableScroller">
            <table className="compare__table">
              <thead>
                <tr>
                  <th className="compare__th compare__thFeature" scope="col">Feature</th>
                  <th className="compare__th compare__thStick" scope="col">Local Patches</th>
                  <th className="compare__th compare__thClip" scope="col">Our Patches</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="compare__tr">
                    <td className="compare__td compare__tdFeature"><strong>{row[0]}</strong></td>
                    <td className="compare__td compare__tdStick">{row[1]}</td>
                    <td className="compare__td compare__tdClip">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Dermatologist() {
  return (
    <section className="stickDerm" aria-labelledby="stick-derm-title">
      <div className="wrap">
        <h2 id="stick-derm-title"><Lines children={['Dermatologist Approved For', 'Your Scalp Safety']} /></h2>
        <div className="stickDerm__grid">
          <article>
            <h3>Wrong adhesives &amp; poor-quality bases can:</h3>
            <ul className="stickDerm__bad">
              <li><X aria-hidden="true" /><span>Cause itching, redness &amp; <strong>infections.</strong></span></li>
              <li><X aria-hidden="true" /><span><strong>Damage</strong> the scalp with prolonged use.</span></li>
            </ul>
          </article>
          <article>
            <h3>At American Hairline:</h3>
            <ul className="stickDerm__good">
              <li><Check aria-hidden="true" /><span>Only medical-grade <strong>USA adhesives</strong> are used.</span></li>
              <li><Check aria-hidden="true" /><span>Design breathable, <strong>antimicrobial bases</strong> that are gentle on your scalp.</span></li>
            </ul>
          </article>
        </div>
        <div className="stickDerm__banner">
          <ShieldCheck size={48} aria-hidden="true" />
          <div><h3>Our Design Philosophy:</h3><p>Look natural today, protect your scalp for tomorrow.</p></div>
          <ActionLink>Talk To An Expert</ActionLink>
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    question: 'What is Zycon range?',
    answer: 'The Zycon range is a stick-on hair system that supports scalp health by using antibacterial protection and controlling odor. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle.',
  },
  {
    question: 'Will it fall off with sweat?',
    answer: 'No. A correctly fitted system uses medical-grade bonding designed to stay secure through workouts, sweat, showers, and normal daily activity.',
  },
  {
    question: 'Will it damage my scalp?',
    answer: 'A professional fit, breathable base, medical-grade adhesive, and scheduled servicing protect the scalp. Your specialist also checks your skin before bonding.',
  },
  {
    question: 'How often servicing?',
    answer: 'Most clients return every 20–25 days for removal, scalp cleaning, haircut maintenance, and professional re-fixing.',
  },
  {
    question: 'Can I style it?',
    answer: 'Yes. It can be cut and styled to suit your face, density, texture, and preferred look. Your specialist will explain the safest styling routine.',
  },
  {
    question: 'Will my partner notice?',
    answer: 'The ultra-thin base, graduated density, custom colour, and blended cut are designed to make the hairline and finish look natural at close range.',
  },
] as const

function StickFaq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="stickFaq" aria-labelledby="stick-faq-title">
      <div className="wrap stickFaq__in">
        <h2 id="stick-faq-title">Frequently Asked Questions</h2>
        <div className="stickFaq__list">
          {faqs.map((item, index) => {
            const expanded = open === index
            return (
              <div className="stickFaq__item" key={item.question}>
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} aria-controls={`stick-faq-answer-${index}`}>
                    <span>{item.question}</span><span aria-hidden="true">{expanded ? '×' : '+'}</span>
                  </button>
                </h3>
                <div id={`stick-faq-answer-${index}`} hidden={!expanded}><p>{item.answer}</p></div>
              </div>
            )
          })}
        </div>
        <div className="stickFaq__cta">
          <h3>Still have questions?</h3>
          <p>No worries, we’re here to guide you. Talk to us, we will explain everything.</p>
          <ActionLink>Need Guidance</ActionLink>
        </div>
      </div>
    </section>
  )
}

function ReadyCta() {
  return (
    <section className="stickReady" id="consult" aria-labelledby="stick-ready-title">
      <div className="wrap">
        <div className="stickReady__card">
          <h2 id="stick-ready-title"><Lines children={['Ready For The Most', 'Natural Hairline Possible?']} /></h2>
          <p>Book your consultation today. We’ll assess your scalp, explain your options, and help you choose the safest and most <strong>natural-looking solution</strong> with our Stick-On.</p>
          <ActionLink>Discuss With A Consultant</ActionLink>
          <small>Limited Stick-On slots every month. Reserve yours today.</small>
        </div>
      </div>
    </section>
  )
}

function LearnClipOn() {
  return (
    <section className="learnSo" aria-labelledby="stick-learn-title">
      <div className="wrap">
        <div className="learnSo__in" data-shown="true">
          <h2 className="learnSo__title" id="stick-learn-title">
            <Lines children={['Learn How The Clip-On Hair', 'System Works']} />
          </h2>
          <a className="learnSo__card" href="#/clip-on-hair-system">
            <span className="learnSo__copy">
              <span className="learnSo__tag"><Boxes size={14} aria-hidden="true" /> Clip-on Hair System</span>
              <span className="learnSo__body">No shaving, no glue, just clip, wear, and go. Perfect for easy volume without commitment.</span>
              <span className="learnSo__more">Know more <ArrowRight size={15} aria-hidden="true" /></span>
            </span>
            <span className="learnSo__art"><Photo slot={media.learnClip} className="learnSo__photo" /></span>
          </a>
        </div>
      </div>
    </section>
  )
}

/** Complete Stick-On product page. Unique photography intentionally falls back
 * to labelled, dimensioned slots until the supplied assets are installed. */
export function StickOnHairSystem() {
  return (
    <>
      <Nav />
      <main className="stickPage">
        <StickHero />
        <LocalFail />
        <Consultation />
        <NaturalHairline />
        <StickPerfectFor />
        <Achievements />
        <Checklist />
        <Backed />
        <HairlineTruth titleId="stick-why-title" title={['Why Thousands Of Men', 'Choose American Hairline']} points={whyPoints} />
        <ClipZyconRange content={zyconContent} />
        <LocalComparison />
        <ClientStories />
        <Dermatologist />
        <StickFaq />
        <ReadyCta />
        <LearnClipOn />
      </main>
      <Footer />
    </>
  )
}
