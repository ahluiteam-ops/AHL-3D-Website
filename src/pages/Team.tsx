import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, BarChart3, Cake, Clock3, MapPin, PartyPopper, Play, Rocket, Users } from 'lucide-react'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { usePrefersReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const instagramHref = 'https://www.instagram.com/ourhairlinestory?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='

const reels = [
  { src: '/team/reel-04.webp', width: 720, height: 1675, alt: 'American Hairline social media and editing team collaborating in the office.' },
  { src: '/team/reel-03.webp', width: 720, height: 1280, alt: 'American Hairline colleagues enjoying time together outside the office.' },
  { src: '/team/reel-02.webp', width: 720, height: 1280, alt: 'American Hairline founder featured in a behind-the-team reel.' },
  { src: '/team/reel-01.webp', width: 720, height: 1280, alt: 'American Hairline team member taking a coffee break at work.' },
] as const

const officePhotos = [
  {
    src: '/team/office-01.webp',
    width: 1600,
    height: 904,
    alt: 'American Hairline colleagues gathered together in the office.',
  },
  {
    src: '/team/office-02.webp',
    width: 1600,
    height: 904,
    alt: 'American Hairline team celebrating together at an office event.',
  },
  {
    src: '/team/office-03.webp',
    width: 1600,
    height: 904,
    alt: 'American Hairline team taking a group selfie on the office terrace.',
  },
  {
    src: '/team/office-04.webp',
    width: 1600,
    height: 904,
    alt: 'American Hairline colleagues celebrating together outdoors.',
  },
] as const

const openRoles = [
  {
    title: 'Social Media Executive',
    description: 'We’re looking for a mid-level social media executive to join our team.',
  },
  {
    title: 'Senior Video Editor',
    description: 'We’re looking for a senior-level video editor to join our team.',
  },
  {
    title: 'AI Developer Intern',
    description: 'We’re looking for a AI developer intern to join our team.',
  },
  {
    title: 'Social Media Executive',
    description: 'We’re looking for a mid-level social media executive to join our team.',
  },
  {
    title: 'Social Media Executive',
    description: 'We’re looking for a mid-level social media executive to join our team.',
  },
  {
    title: 'Talent Acquisition Executive',
    description: 'We’re looking for a senior talent acquisition executive to join our team.',
  },
] as const

function roleHref(title: string) {
  return `mailto:info@americanhairline.com?subject=${encodeURIComponent(`Application - ${title}`)}`
}

/* "Why You Will Love Working Here".
 *
 * Five perks. The fifth has no partner, so the design centres it under the two
 * columns at one column's width — parking it in column one would leave the same
 * dead space a row lower.
 *
 * `icon` is a component rather than a key because this list lives beside its
 * only consumer; the `site.ts` sections keep keys instead so that file stays
 * import-free. */
const perks = [
  {
    icon: Users,
    title: 'Inclusive and Diverse Culture',
    body: 'We value individuality and ensure every voice is heard.',
  },
  {
    icon: Cake,
    title: 'Birthday Celebrations',
    body: 'Celebrate with cake and your team to make your day special!',
  },
  {
    icon: Rocket,
    title: 'Growth Opportunities',
    body: 'We provide resources and support for your continuous development.',
  },
  {
    icon: BarChart3,
    title: 'Performance-Based',
    body: 'Your hard work is recognized and rewarded here.',
  },
  {
    icon: PartyPopper,
    title: 'Fun Fridays',
    body: 'End the week with some fun and team bonding!',
  },
] as const

export function Team() {
  const pageRef = useRef<HTMLElement>(null)
  const officeSectionRef = useRef<HTMLElement>(null)
  const officeStageRef = useRef<HTMLDivElement>(null)
  const officeTrackRef = useRef<HTMLUListElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(() => {
    if (reducedMotion) return
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-team-hero="badge"]', { autoAlpha: 0, y: -12, duration: 0.5 })
      .from('[data-team-hero="title"]', { autoAlpha: 0, y: 24, duration: 0.68 }, '-=0.26')
      .from('[data-team-hero="copy"]', { autoAlpha: 0, y: 18, duration: 0.58 }, '-=0.34')
      .from('[data-team-hero="cta"]', { autoAlpha: 0, y: 14, duration: 0.5 }, '-=0.28')
      .from('.teamHero__reel', { autoAlpha: 0, y: 28, scale: 0.985, duration: 0.62, stagger: 0.06 }, '-=0.18')
    /* Scroll-triggered, unlike the hero timeline above: this section is below
       the fold, and a mount-time tween would play out entirely before anyone
       had scrolled to it. */
    gsap.from('.teamPerks__card', {
      autoAlpha: 0,
      y: 22,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.teamPerks__grid', start: 'top 82%' },
    })
    gsap.from('.teamJobs__card', {
      autoAlpha: 0,
      y: 24,
      duration: 0.58,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.teamJobs__grid', start: 'top 82%' },
    })

    const media = gsap.matchMedia()
    media.add('(min-width: 901px)', () => {
      const section = officeSectionRef.current
      const stage = officeStageRef.current
      const track = officeTrackRef.current
      if (!section || !stage || !track) return

      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(travel(), window.innerHeight * 1.35)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => media.revert()
  }, { scope: pageRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <>
      <Nav />
      <main className="teamPage" ref={pageRef}>
        <section className="teamHero" aria-labelledby="team-page-title">
          <div className="teamHero__intro wrap">
            <div className="teamHero__eyebrow" data-team-hero="badge">
              <img src="/team/team-badge.webp" alt="" width={32} height={32} aria-hidden="true" />
              <span>Join Us</span>
            </div>

            <h1 id="team-page-title" data-team-hero="title">Life At American Hairline</h1>

            <p className="teamHero__copy" data-team-hero="copy">
              We&apos;re not just about hair; we&apos;re <strong>about people.</strong> We work fast, ask the right questions,
              and foster an <strong>environment</strong> where authenticity is key. Join a team that values
              <strong> creativity,</strong> innovation, and making a real impact. Good vibes, <strong>big ideas,</strong> and a
              shared passion for <strong>helping others</strong> regain their confidence await.
            </p>

            <a
              className="teamHero__instagram"
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              data-team-hero="cta"
            >
              <span>Our Team On Instagram</span>
              <img src="/team/instagram.webp" alt="" width={32} height={32} aria-hidden="true" />
            </a>
          </div>

          <div className="teamHero__gallery">
            <div className="teamHero__rail" aria-label="American Hairline team reels">
              {reels.map((reel, index) => (
                <a
                  className="teamHero__reel"
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View team reel ${index + 1} on Instagram`}
                  key={reel.src}
                >
                  <img src={reel.src} alt={reel.alt} width={reel.width} height={reel.height} />
                  <span className="teamHero__play" aria-hidden="true"><Play fill="currentColor" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="teamPerks" aria-labelledby="team-perks-title">
          <div className="wrap">
            <h2 className="teamPerks__title" id="team-perks-title">
              {/* Real trailing space. These are blocks so it collapses visually,
                  but without it the two lines run together in the accessible
                  name — the defect this codebase has hit thirteen times. */}
              <span>Why You Will Love </span>
              <span>Working Here</span>
            </h2>

            <ul className="teamPerks__grid">
              {perks.map(({ icon: Icon, title, body }) => (
                <li className="teamPerks__card" key={title}>
                  <span className="teamPerks__mark" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="teamPerks__cardTitle">{title}</h3>
                    <p className="teamPerks__body">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="teamOffice" ref={officeSectionRef} aria-labelledby="team-office-title">
          <div className="teamOffice__stage" ref={officeStageRef}>
            <div className="teamOffice__heading wrap">
              <h2 id="team-office-title">P.S. - Check Out Our Office</h2>
            </div>

            <div className="teamOffice__viewport">
              <ul className="teamOffice__track" ref={officeTrackRef} aria-label="Life at the American Hairline office">
                {officePhotos.map((photo) => (
                  <li className="teamOffice__card" key={photo.src}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="teamJobs" aria-labelledby="team-jobs-title">
          <div className="teamJobs__inner wrap">
            <h2 id="team-jobs-title">Apply Now</h2>
            <ul className="teamJobs__grid">
              {openRoles.map((role, index) => (
                <li className="teamJobs__card" key={`${role.title}-${index}`}>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <div className="teamJobs__meta" aria-label="Role details">
                    <span><MapPin aria-hidden="true" size={16} /> Mumbai</span>
                    <span><Clock3 aria-hidden="true" size={16} /> Full-Time</span>
                  </div>
                  <a className="teamJobs__apply" href={roleHref(role.title)} aria-label={`Apply for ${role.title}`}>
                    Apply Now <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
