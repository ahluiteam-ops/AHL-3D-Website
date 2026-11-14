import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, Check, Play, Target, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { Footer } from '../components/Footer'
import { FounderBooking } from '../components/FounderBooking'
import { Form } from '../components/Form'
import { Nav } from '../components/Nav'
import { usePrefersReducedMotion } from '../hooks'
import { hairTransplant, storyReels } from '../site'
import { StoryReels } from '../components/StoryReels'

function Lines({ children }: { children: readonly string[] }) {
  return children.map((line, index) => (
    <span key={line}>{line}{index < children.length - 1 ? ' ' : null}</span>
  ))
}

function Emphasised({ text }: { text: string }) {
  return text.split('**').map((part, index) =>
    index % 2 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>,
  )
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduced ? 0 : 0.46, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ConsultationButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const scrollToForm = () => {
    document.getElementById('hair-transplant-form')?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <button className={`htAction ${className}`.trim()} type="button" onClick={scrollToForm}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </button>
  )
}

function Hero() {
  const { hero } = hairTransplant
  const [playing, setPlaying] = useState(false)
  return (
    <section
      className="htHero"
      aria-labelledby="hair-transplant-title"
      style={{ '--ht-eyebrow-icon': `url('${hero.eyebrowIcon}')` } as CSSProperties}
    >
      <div className="wrap htHero__panel">
        <Reveal className="htHero__copy">
          <div className="htHero__eyebrow">
            <span aria-hidden="true" />
            {hero.eyebrow}
          </div>
          <h1 id="hair-transplant-title"><Lines>{hero.title}</Lines></h1>
          <p>
            {hero.lede.map((part, index) =>
              index === 1 || index === 3 ? <strong key={part}>{part}</strong> : <span key={part}>{part}</span>,
            )}
          </p>
          <div className="htHero__trust" aria-label={hero.trust}>
            <div className="htHero__avatars" aria-hidden="true">
              {hero.avatars.map((src, index) => <img key={src} src={src} alt="" width={44} height={44} style={{ zIndex: hero.avatars.length - index }} />)}
            </div>
            <span>{hero.trust}</span>
          </div>
        </Reveal>

        <Reveal className="htHero__media" delay={0.08}>
          {playing ? (
            /* eslint-disable-next-line jsx-a11y/media-has-caption */
            <video src={hero.media.src} poster={hero.media.poster} controls autoPlay playsInline />
          ) : (
            <button type="button" aria-label={hero.media.label} onClick={() => setPlaying(true)}>
              <img src={hero.media.poster} alt="" width={hero.media.width} height={hero.media.height} />
              <span className="htHero__play" aria-hidden="true"><Play fill="currentColor" /></span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Benefits() {
  const { benefits } = hairTransplant
  return (
    <section className="htBenefits" aria-labelledby="ht-benefits-title">
      <div className="wrap">
        <Reveal><h2 id="ht-benefits-title"><Lines>{benefits.title}</Lines></h2></Reveal>
        <div className="htBenefits__rail" role="region" aria-label="Combination method benefits" tabIndex={0}>
          {benefits.items.map((item, index) => (
            <Reveal className="htBenefits__card" delay={index * 0.07} key={item.title}>
              <article>
                <div className="htBenefits__copy"><h3>{item.title}</h3><p>{item.body}</p></div>
                <img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const { comparison } = hairTransplant
  return (
    <section className="htCompare" aria-labelledby="ht-compare-title">
      <div className="wrap htCompare__in">
        <Reveal><h2 id="ht-compare-title"><Lines>{comparison.title}</Lines></h2></Reveal>
        <Reveal className="htCompare__tableWrap" delay={0.05}>
          <table>
            <thead><tr>{comparison.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => index === 0
                    ? <th key={cell} scope="row">{cell}</th>
                    : <td key={cell} data-label={comparison.columns[index]}>{cell}</td>,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal className="htCompare__close" delay={0.08}>
          <p>{comparison.closeLead}<strong>{comparison.closeStrong}</strong></p>
        </Reveal>
      </div>
    </section>
  )
}

function IdealFor() {
  const { idealFor } = hairTransplant
  return (
    <section className="htIdeal" aria-labelledby="ht-ideal-title">
      <div className="wrap htIdeal__in">
        <Reveal><h2 id="ht-ideal-title">{idealFor.title}</h2></Reveal>
        <Reveal className="htIdeal__card" delay={0.04}>
          <h3>{idealFor.intro}</h3>
          <ul>{idealFor.items.map((item) => <li key={item}><span aria-hidden="true"><Check /></span><p><Emphasised text={item} /></p></li>)}</ul>
        </Reveal>
        <Reveal className="htIdeal__close" delay={0.08}>
          <p>{idealFor.closeLead}<strong>{idealFor.closeStrong}</strong>{idealFor.closeEnd}</p>
        </Reveal>
      </div>
    </section>
  )
}

function Bollywood() {
  const { bollywood } = hairTransplant
  return (
    <section className="htBollywood" aria-labelledby="ht-bollywood-title">
      <div className="wrap">
        <Reveal><h2 id="ht-bollywood-title"><Lines>{bollywood.title}</Lines></h2></Reveal>
        <div className="htBollywood__grid">
          <Reveal className="htBollywood__content" delay={0.04}>
            <div className="htBollywood__card">
              <h3>{bollywood.intro}</h3>
              <ul>{bollywood.items.map((item) => <li key={item}><span aria-hidden="true"><Check /></span><p>{item}</p></li>)}</ul>
            </div>
            <ConsultationButton>{bollywood.action}</ConsultationButton>
          </Reveal>
          <Reveal className="htBollywood__media" delay={0.08}>
            <img src={bollywood.media.src} alt={bollywood.media.alt} width={bollywood.media.width} height={bollywood.media.height} loading="lazy" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const { process } = hairTransplant
  return (
    <section className="htProcess" aria-labelledby="ht-process-title">
      <div className="wrap">
        <Reveal><h2 id="ht-process-title"><Lines>{process.title}</Lines></h2></Reveal>
        <div className="htProcess__grid">
          {process.steps.map((step, index) => (
            <Reveal className="htProcess__step" delay={index * 0.07} key={step.title}>
              <article>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <h4>{step.label}</h4>
                  <ul>{step.items.map((item) => <li key={item}><span aria-hidden="true"><Check /></span><p>{item}</p></li>)}</ul>
                </div>
                <strong className="htProcess__takeaway">{step.close}</strong>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="htProcess__result" delay={0.08}>
          <div className="htProcess__resultCopy">
            <h3><Target aria-hidden="true" />{process.resultTitle}</h3>
            <p>{process.resultBody}</p>
            <a
              className="htProcess__videoLink"
              href={process.resultVideo.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {process.resultVideo.label}
            </a>
          </div>
          <ConsultationButton className="htAction--light">{process.action}</ConsultationButton>
        </Reveal>
      </div>
    </section>
  )
}

function Surgeons() {
  const { surgeons } = hairTransplant
  return (
    <section className="htSurgeons" aria-labelledby="ht-surgeons-title">
      <div className="wrap">
        <Reveal><h2 id="ht-surgeons-title"><Lines>{surgeons.title}</Lines></h2></Reveal>
        <div className="htSurgeons__grid">
          {surgeons.items.map((surgeon, index) => (
            <Reveal className="htSurgeons__card" delay={index * 0.07} key={surgeon.name}>
              <figure>
                <img src={surgeon.image} alt={surgeon.alt} width={surgeon.width} height={surgeon.height} loading="lazy" />
                <figcaption className="htSrOnly"><UserRound aria-hidden="true" />{surgeon.name}, {surgeon.credential}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HairTransplant() {
  return (
    <>
      <Nav />
      <main>
        <div className="hairTransplantPage">
          <Hero />
          <Benefits />
          <Comparison />
          <IdealFor />
          <Bollywood />
          <Process />
          <Surgeons />
        </div>
        {/* Outside the page wrapper on purpose: `.hairTransplantPage` zeroes
            heading and paragraph margins, which would squash this shared
            section. */}
        <FounderBooking />
        <div className="hairTransplantPage">
          <div id="hair-transplant-form"><Form /></div>
          <StoryReels set={storyReels.transplant} />
        </div>
      </main>
      <Footer />
    </>
  )
}
