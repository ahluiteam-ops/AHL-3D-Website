import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { achievements } from '../site'
import { usePrefersReducedMotion } from '../hooks'

/**
 * "Our Big Achievements" as a pinned horizontal scroll, after the reference:
 * the section sticks to the viewport and vertical scrolling drives the track
 * sideways through intro panel → cards → closing CTA.
 *
 * The section's height is what creates the scroll distance. It is
 * `100vh + trackOverflow`, so the pin lasts exactly as long as it takes to
 * travel the track and not a pixel more — get this wrong and you either clip
 * the last card or leave dead scrolling at the end.
 *
 * Below 900px, and for anyone who asked for reduced motion, the whole
 * mechanism is dropped for a plain swipeable rail. Hijacking vertical scroll
 * on a phone is the wrong trade: it fights the gesture the user already has.
 */
export function Achievements() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const still = usePrefersReducedMotion()

  // How far the track has to travel. 0 means "not pinned" — the rail mode.
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const pinned = window.matchMedia('(min-width: 901px)').matches && !still
      setDistance(pinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    }

    measure()
    // Fonts and images change the track's width after first paint, so remeasure
    // rather than trusting the initial number.
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [still])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  const pinned = distance > 0

  return (
    <section
      className={`work${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="work-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="work__pin">
        <motion.div
          className="work__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="work__intro">
            <h2 className="work__title" id="work-title">
              {/* The space before the break is a real text node. A bare `<br>`
                  produces none, so the heading announced as
                  "Our BigAchievements". */}
              Our Big{' '}
              <br />
              Achievements
            </h2>
            <a className="work__link" href="#results">
              View all results
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {/* Cards flagged `hidden` in `site.ts` stay in the record but off the
              page. Filtering here rather than in the data keeps the reason for
              a card's absence next to the card itself. */}
          {achievements
            .filter((item) => !item.hidden)
            .map((item) => (
              <article className="work__item" key={item.title}>
                <div className="work__media">
                  <img src={item.img} alt={item.title} loading="lazy" />
                </div>
                <h3 className="work__name">{item.title}</h3>
                <p className="work__note">{item.note}</p>
              </article>
            ))}

          <div className="work__outro">
            <p className="work__outroCopy">
              Twelve years, 6,770+ men, and 12+ nations — the proof behind every
              hairline we build.
            </p>
            <a className="work__link" href="#book">
              Discuss with a consultant
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
