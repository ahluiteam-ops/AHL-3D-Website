import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'
import {
  transformationsClients,
  transformationsTitle,
  type TransformationClient,
} from '../site'

function ResultCard({
  client,
  eager,
}: {
  client: TransformationClient
  eager: boolean
}) {
  return (
    <article className="transforms__item">
      <figure className="transforms__media">
        <img
          src={client.image}
          srcSet={`${client.small} 1200w, ${client.image} 1920w`}
          sizes="(max-width: 900px) 92vw, 52vw"
          alt={`${client.name} photographed before and after his hair system.`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
        {/* Every poster is a before/after split with nothing marking which half
            is which, so the two halves are labelled — the same call the
            homepage's client stories made, for the same reason. Without them
            the frame reads as one photograph of two different men. */}
        <span className="transforms__tag transforms__tag--before">Before</span>
        <span className="transforms__tag transforms__tag--after">After</span>
        {/* The gradient belongs to the quote, not the card, so it never sits
            over a frame that has no text on it. */}
        <p className="transforms__quote">{client.testimonial}</p>
      </figure>

      <h3 className="transforms__name">{client.name}</h3>

      {/* The one place this card differs from the homepage's. On a page about
          choosing between the two methods, which one a man actually wore is
          part of the evidence, so it is a link to that method rather than a
          caption. */}
      <a className="transforms__cta" href={client.href}>
        {client.cta}
        <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
      </a>
    </article>
  )
}

/**
 * "Real Results That Showcase True Transformations".
 *
 * The homepage's client-stories mechanism, as asked for: the section pins and
 * vertical scroll drives a horizontal track through intro panel → eight client
 * cards → closing panel. The section's height is `100vh + trackOverflow`,
 * measured after paint, which is what creates the scroll distance for the pin.
 *
 * Below 901px, and for reduced motion, the pin is dropped for a scroll-snapped
 * swipe rail — **the same markup**, with CSS making the pin the scroll
 * container. The version this replaces kept a second copy of every card for
 * mobile; one set now serves both, which is the real saving here.
 *
 * Hijacking vertical scroll on a phone fights the gesture the user already
 * has, which is why the pin is dropped rather than scaled down.
 */
export function Transformations() {
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
    // The posters land after first paint and change the track's width, so
    // remeasure rather than trusting the initial number.
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
      className={`transforms${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="transforms-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="transforms__pin">
        <motion.div
          className="transforms__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="transforms__intro">
            <h2 className="transforms__title" id="transforms-title">
              {transformationsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <a className="transforms__link" href="#/stick-on-or-clip-on#stick-on">
              See how each one works
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          {transformationsClients.map((client, i) => (
            <ResultCard client={client} eager={i === 0} key={client.id} />
          ))}

          <div className="transforms__outro">
            <p className="transforms__outroCopy">
              Eight men, two methods. The right one for you is the one that fits
              the way you actually live.
            </p>
            <a className="transforms__link" href="#consult">
              Discuss with a consultant
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
