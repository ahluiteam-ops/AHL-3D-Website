import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks'
import { services, servicesAction, servicesTitle } from '../site'

const LAST = services.length - 1

/** Scroll spent moving from one service to the next. Mirrored in CSS as
 *  `--services-step`, which is what builds the section's height. */
const STEP_VH = 38

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * "Explore Our Trusted Range Of Hair Services".
 *
 * Rebuilt to the reference recording's pattern: the services are full-width
 * rows rather than a list beside one photograph. Each row carries its own
 * photograph flush against its left edge, and the row itself is what opens —
 * it grows from a strip to a tall band, so the photograph reveals more of
 * itself as the copy appears beside it. One row is open at a time.
 *
 * The section still pins like "Our Big Achievements": it sticks to the
 * viewport and vertical scroll drives which row is open. The heading holds
 * still above the stack, aligned to the copy column, while the rows trade
 * height beneath it.
 *
 * Two transitions do the opening, and they are deliberately separate. The row
 * animates its own `height` between two CSS lengths, which is what moves the
 * photographs; the copy animates `grid-template-rows: 0fr → 1fr`, so it opens
 * to exactly the height its own text needs with nothing measured.
 *
 * Headings stay real buttons. In pinned mode a click moves page scroll to that
 * service's position rather than setting a second piece of state that would
 * then disagree with the scroll position.
 *
 * Below 901px the pin is dropped, every service is open, and each photograph
 * stacks above its copy. Reduced motion at desktop widths keeps the ordinary
 * click-to-open accordion and its two-column rows.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 900px)')
  const [still, setStill] = useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const read = () =>
      setStill(reduced || !window.matchMedia('(min-width: 901px)').matches)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [reduced])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const eased = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  })

  /* Same shaping as the checklist cursor: each step gets a plateau, so the
     accordion rests on one service for most of the scroll between two rather
     than hovering between them. */
  const cursor = useTransform(eased, (progress) => {
    const raw = clamp01((progress - 0.02) / 0.96) * LAST
    const point = Math.floor(raw)
    const t = clamp01((raw - point - 0.3) / 0.4)
    const step = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2
    return Math.min(LAST, point + step)
  })

  useMotionValueEvent(cursor, 'change', (value) => {
    if (still) return
    setActive(Math.min(LAST, Math.max(0, Math.round(value))))
  })

  const onOpen = useCallback(
    (index: number) => {
      if (still) {
        setActive(index)
        return
      }
      const section = sectionRef.current
      if (!section) return
      const step = (window.innerHeight * STEP_VH) / 100
      window.scrollTo({
        top: section.offsetTop + index * step + step * 0.5,
        behavior: 'smooth',
      })
    },
    [still],
  )

  return (
    <section
      className={`services${still ? ' services--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="services-title"
    >
      <div className="services__pin">
        <div className="services__in wrap">
          <div className="services__masthead">
            <h2 className="services__title" id="services-title">
              {servicesTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <ol className="services__list">
            {services.map((service, i) => {
              /* Phone content is short enough to show in full. Keeping every
                 row open removes needless accordion taps; desktop continues
                 to take its single active row from scroll or click. */
              const expanded = mobile || i === active

              return (
                <li
                  className="services__row"
                  data-open={expanded ? 'true' : 'false'}
                  key={service.title}
                >
                  <div className="services__media">
                    <img
                      src={service.image}
                      alt={service.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="services__text">
                    <h3 className="services__lead">
                      <button
                        type="button"
                        className="services__head"
                        onClick={() => onOpen(i)}
                        aria-expanded={expanded}
                        disabled={mobile}
                      >
                        <span className="services__name">{service.title}</span>
                        <span className="services__index" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </button>
                    </h3>

                    <div className="services__body">
                      <div className="services__bodyIn">
                        <p>{service.body}</p>
                        <a className="services__cta" href={service.href}>
                          {servicesAction}
                          <ArrowUpRight size={14} strokeWidth={2.4} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
