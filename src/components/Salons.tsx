import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'
import { salons, salonsAction, salonsOutro, salonsTitle } from '../site'

/**
 * "Walk Into Any Of Our Premium Salons".
 *
 * Built to TRIONN's "Selected work & explorations" pattern from the reference
 * recording, which is the same mechanism as "Our Big Achievements": the
 * section pins and vertical scroll drives a horizontal track through intro
 * panel → city cards → closing panel. Each card carries the city name over the
 * photograph and its address underneath, with the artwork's `Get Direction`
 * link as the per-card action.
 *
 * The section's height is what creates the scroll distance —
 * `100vh + trackOverflow`, measured by a `ResizeObserver` because fonts and
 * images change the track's width after first paint. Get it wrong and you
 * either clip the last card or leave dead scrolling at the end.
 *
 * Below 901px, and for anyone who asked for reduced motion, the pin is dropped
 * for a plain swipeable rail: hijacking vertical scroll on a phone fights the
 * gesture the user already has.
 */
export function Salons() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  // How far the track has to travel. 0 means "not pinned" — the rail mode.
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const pinned = window.matchMedia('(min-width: 901px)').matches && !reduced
      setDistance(pinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reduced])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  const pinned = distance > 0

  return (
    <section
      className={`salons${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="salons-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="salons__pin">
        <motion.div
          className="salons__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="salons__intro">
            <h2 className="salons__title" id="salons-title">
              {salonsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <a className="salons__link" href={salonsOutro.href}>
              {salonsOutro.action}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          {salons.map((salon) => (
            <article className="salons__item" key={salon.city}>
              {/* The city is the card's heading and is set over the
                  photograph, as the reference sets each project's own type
                  over its shot. One element, so it is not announced twice. */}
              <div className="salons__media">
                <img src={salon.image} alt={salon.alt} loading="lazy" />
                <h3 className="salons__city">{salon.city}</h3>
              </div>

              <p className="salons__address">{salon.address}</p>
              <a
                className="salons__direction"
                href={salon.href}
                target="_blank"
                rel="noreferrer"
              >
                {salonsAction}
                <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
              </a>
            </article>
          ))}

          <div className="salons__outro">
            <p className="salons__outroCopy">{salonsOutro.copy}</p>
            <a className="salons__link" href={salonsOutro.href}>
              {salonsOutro.action}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
