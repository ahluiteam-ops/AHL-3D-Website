import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Plus, Users, X } from 'lucide-react'
import { Achievements } from '../components/Achievements'
import { Backed } from '../components/Backed'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { Salons } from '../components/Salons'
import { Services } from '../components/Services'
import { StillConfused } from '../components/StillConfused'
import { usePrefersReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const consultationHref = 'tel:+919222666111'
const careersHref = '#/team'
const careersData = {
  eyebrow: 'Careers',
  headlineLines: ['Open Positions.', 'Build The Future With Us.'],
  subtext: 'Join our team and be part of transforming the hair industry worldwide.',
  cta: 'Join The Team',
  href: careersHref,
} as const

const stats = [
  ['12+ Years', 'Experience'],
  ['6,770+', 'Men Helped'],
  ['100%', 'Natural Looking'],
  ['12+ Countries', 'Clients Served'],
] as const

function StoryDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement> }) {
  const close = () => dialogRef.current?.close()

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <dialog
      className="aboutStoryDialog"
      ref={dialogRef}
      aria-labelledby="about-story-dialog-title"
      onClose={() => { document.body.style.overflow = '' }}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <article className="aboutStoryDialog__panel">
        <button className="aboutStoryDialog__close" type="button" onClick={close} aria-label="Close our story">
          <X aria-hidden="true" />
        </button>

        <div className="aboutStoryDialog__copy">
          <h2 id="about-story-dialog-title">The Journey of <strong>American Hairline</strong></h2>
          <p>
            When we first launched American Hairline, we thought we were simply creating <strong>hair systems.</strong>{' '}
            But as we worked closely with some of <strong>Bollywood&apos;s biggest stars,</strong> we realized that what we
            were truly doing was helping men feel like themselves again. We learned the importance of creating
            ultra-premium, <strong>natural-looking hair systems</strong> that could withstand harsh studio lighting and
            the precision of 4K cameras. Every strand had to look like it was born right on that head.
          </p>
          <p>
            One day, an <strong>ordinary man</strong> walked in. He wasn&apos;t a celebrity. He looked at us and said,
            “I just want to <strong>look like myself again.</strong>” That moment changed everything for us. We understood
            that there were thousands of men like him; men who didn&apos;t want fake solutions or quick fixes. They
            simply wanted to <strong>look natural, feel confident,</strong> and stop worrying about how their hair looked
            every day.
          </p>
        </div>

        <img
          className="aboutStoryDialog__collage"
          src="/about/story-collage.webp"
          alt="American Hairline team members working together and celebrating staff achievements."
          width={1200}
          height={1291}
        />

        <div className="aboutStoryDialog__copy">
          <p>
            With this realization, we took everything we had learned while working with celebrities: the precision,
            <strong> craftsmanship,</strong> and attention to detail. We made it available to every man who wanted the
            same level of <strong>authenticity.</strong> It wasn&apos;t always easy. We faced countless setbacks, resistance,
            and moments when scaling without compromising quality seemed impossible. But every time a client walked
            out smiling and said, <strong>“I finally feel like myself again,”</strong> we knew we were on the right path.
          </p>
          <p>
            Today, <strong>American Hairline</strong> is India&apos;s most trusted name in <strong>non-surgical hair
            replacement;</strong> not because of who we worked with, but because of who we work for. Real men. Men who
            choose confidence. Men who choose to take control of their own story.
          </p>
          <p>
            At the end of the day, it&apos;s not about hair; <strong>it&apos;s about how you feel when you look in the mirror.</strong>{' '}
            That quiet confidence, that&apos;s what we exist for.
          </p>
        </div>

        <img
          className="aboutStoryDialog__team"
          src="/about/story-team.webp"
          alt="American Hairline team gathered with a client."
          width={1600}
          height={1087}
          loading="lazy"
        />
      </article>
    </dialog>
  )
}

export function AboutUs() {
  const pageRef = useRef<HTMLElement>(null)
  const storyDialogRef = useRef<HTMLDialogElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const openStory = () => {
    document.body.style.overflow = 'hidden'
    storyDialogRef.current?.showModal()
  }

  useGSAP(() => {
    const page = pageRef.current
    if (!page) return
    const animated = page.querySelectorAll('[data-about-hero], [data-about-reveal], [data-about-stagger] > *')
    if (reducedMotion) {
      gsap.set(animated, { clearProps: 'all' })
      return
    }

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-about-hero="eyebrow"]', { autoAlpha: 0, y: -12, duration: 0.55 })
      .from('[data-about-hero="title"]', { autoAlpha: 0, y: 24, duration: 0.72 }, '-=0.32')
      .from('[data-about-hero="copy"]', { autoAlpha: 0, y: 18, duration: 0.62 }, '-=0.38')
      .from('[data-about-hero="media"]', { autoAlpha: 0, y: 28, scale: 0.985, duration: 0.82 }, '-=0.34')

    gsap.utils.toArray<HTMLElement>('[data-about-section]').forEach((section) => {
      const reveal = section.querySelectorAll('[data-about-reveal]')
      const stagger = section.querySelectorAll('[data-about-stagger] > *')
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      })
      if (reveal.length) {
        timeline.from(reveal, { autoAlpha: 0, y: 28, duration: 0.68, stagger: 0.07, ease: 'power3.out' })
      }
      if (stagger.length) {
        timeline.from(stagger, { autoAlpha: 0, y: 22, duration: 0.55, stagger: 0.045, ease: 'power2.out' }, '-=0.3')
      }
    })
  }, { scope: pageRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <>
      <Nav />
      <main className="aboutPage" ref={pageRef}>
        <section className="aboutHero" aria-labelledby="about-page-title">
          <div className="aboutWrap aboutHero__inner">
            <div className="aboutEyebrow" data-about-hero="eyebrow"><Users aria-hidden="true" />About Us</div>
            <h1 id="about-page-title" data-about-hero="title">
              At American Hairline, We Solve{' '}<br />Your Hair Loss Worries
            </h1>
            <div className="aboutHero__copy" data-about-hero="copy">
              <p>We create handcrafted, customized <strong>non-surgical hair replacement systems</strong> tailored to match your hair texture, density, and scalp.</p>
              <p>Designed with Indian hair texture, skin tone, and climate in mind, ensuring they <strong>blend seamlessly and naturally,</strong> just like your own hair.</p>
            </div>
            <figure className="aboutHero__media" data-about-hero="media">
              <img src="/about/team-hero.webp" alt="American Hairline expert team." width={1600} height={900} />
            </figure>
          </div>
        </section>

        <section className="aboutStats" data-about-section aria-labelledby="about-stats-title">
          <div className="aboutWrap aboutStats__grid">
            <div className="aboutStats__lead" data-about-reveal>
              <h2 id="about-stats-title">Why Men Around The{' '}<br />World Choose Us</h2>
              <a className="aboutButton" href={consultationHref}>Talk To An Expert <ArrowUpRight aria-hidden="true" /></a>
            </div>
            <dl className="aboutStats__cards" data-about-stagger>
              {stats.map(([value, label]) => (
                <div className="aboutStats__card" key={label}><dt>{value}</dt><dd>{label}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="aboutStory" data-about-section aria-labelledby="about-story-title">
          <div className="aboutWrap">
            <h2 className="sr-only" id="about-story-title">The Journey of American Hairline</h2>
            <button className="aboutStory__card" type="button" onClick={openStory} aria-haspopup="dialog" data-about-reveal>
              <img src="/about/our-story.webp" alt="" width={1600} height={834} loading="lazy" />
              <span className="aboutStory__open"><Plus aria-hidden="true" /><span className="sr-only">Read our full story</span></span>
            </button>
          </div>
        </section>

        <Achievements />

        <section className="aboutFeature" data-about-section aria-labelledby="about-mission-title">
          <div className="aboutWrap aboutFeature__inner">
            <h2 id="about-mission-title" data-about-reveal>Our Mission: Building The Future Of{' '}<br />Non-Surgical Hair Solutions</h2>
            <picture data-about-reveal>
              <source media="(max-width: 700px)" srcSet="/about/mission-mobile.webp" width={900} height={1124} />
              <img src="/about/mission.webp" alt="American Hairline team developing non-surgical hair solutions." width={1600} height={900} loading="lazy" />
            </picture>
          </div>
        </section>

        <Backed />

        <section className="aboutFeature aboutFeature--founder" data-about-section aria-labelledby="about-founder-title">
          <div className="aboutWrap aboutFeature__inner">
            <h2 id="about-founder-title" data-about-reveal>Our Founder: The Vision Behind{' '}<br />India&apos;s Natural Hairlines</h2>
            <figure data-about-reveal>
              <picture>
                <source media="(max-width: 700px)" srcSet="/about/founder-mobile.webp" width={900} height={1858} />
                <img src="/about/founder.webp" alt="Vinitt Dessai, founder of American Hairline." width={1600} height={1195} loading="lazy" />
              </picture>
              <figcaption className="sr-only">Vinitt Dessai started American Hairline to help men regain confidence through custom-designed, natural-looking hair systems.</figcaption>
            </figure>
          </div>
        </section>

        <Services />

        <section className="aboutCta" data-about-section aria-labelledby="about-cta-title">
          <div className="aboutWrap">
            <div className="aboutCta__panel" data-about-reveal>
              <img src="/brand/logo.png" alt="American Hairline" width={416} height={164} loading="lazy" />
              <h2 id="about-cta-title">Transform Your Life With Hair Again</h2>
              <p>Join thousands of men already living with natural-looking hair systems.</p>
              <a className="aboutCta__button" href={consultationHref}>Start Your Hair Journey <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <Salons />

        <StillConfused data={careersData} titleId="about-careers-title" />
      </main>
      <StoryDialog dialogRef={storyDialogRef} />
      <Footer />
    </>
  )
}
