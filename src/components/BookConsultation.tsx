import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ArrowUpRight, Globe2, MapPin, Send, ShieldCheck } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks'
import { bookConsultationData, type BookPoint } from '../site'

const ICONS: Record<BookPoint['icon'], typeof MapPin> = {
  cities: MapPin,
  countries: Globe2,
  confidential: ShieldCheck,
}

const headlineWords = bookConsultationData.headlineLines.flatMap((line) =>
  line.split(/\s+/),
)
const totalWords = headlineWords.length

/**
 * One word of the headline, lit as the section scrolls in.
 *
 * Same idiom as `IlluminatedWord` in `StillConfused` on the Stick-On or Clip-On
 * page: both lift white type out of a faint white on a near-black ground.
 * Deliberately not shared between the two — the only thing they have in common
 * is the shape of the transform, and the scrub windows differ.
 */
function LitWord({
  word,
  index,
  progress,
  still,
}: {
  word: string
  index: number
  progress: MotionValue<number>
  still: boolean
}) {
  /* Words light in sequence across the first two-thirds of the scrub, each
     over an overlapping window so the line reads as a sweep rather than as
     separate words switching on. */
  const start = 0.06 + (index / totalWords) * 0.6
  const end = Math.min(0.92, start + 0.16)

  const opacity = useTransform(progress, [start, end], [0.35, 1])
  const y = useTransform(progress, [start, end], [10, 0])
  const color = useTransform(
    progress,
    [start, end],
    ['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 1)'],
  )

  return (
    <motion.span
      className="bookCall__word"
      style={still ? undefined : { opacity, y, color }}
    >
      {word}
    </motion.span>
  )
}

/**
 * "Book Your 1:1 Consultation Online Or In Person".
 *
 * Closing booking block on the Hair Patch vs Hair System page.
 *
 * Dark treatment, built on the same structure as `Backed` on the homepage: a
 * white section holding one dark panel, lit by a single wide soft band, with
 * the glassmorphism moved inward to translucent white cards over that ground.
 *
 * **This is why there are no background orbs.** An earlier light version put
 * the glass over three blurred colour circles, because glass needs something
 * behind it worth blurring and this page's ground is a flat near-white. The
 * dark panel solves that problem better — white translucency over a near-black
 * gradient reads as glass on its own — so the orbs were removed outright
 * rather than recoloured.
 *
 * The scrub is driven by the section entering the viewport rather than by a
 * tall pinned stage. `StillConfused` reserves 220vh for its reveal, which is
 * right for a full-viewport immersive close; this is a compact card, and
 * spending two extra viewports of scroll on it immediately above the footer
 * would cost more than the effect is worth.
 *
 * Under `prefers-reduced-motion` the whole thing renders static and fully lit —
 * no word sweep, no panel arrival, nothing showing up late.
 */
export function BookConsultation() {
  const sectionRef = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'center 40%'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.35,
    restDelta: 0.0005,
  })

  const panelOpacity = useTransform(smooth, [0, 0.18], [0, 1])
  const panelY = useTransform(smooth, [0, 0.3], [46, 0])
  const panelScale = useTransform(smooth, [0, 0.3], [0.965, 1])

  const eyebrowOpacity = useTransform(smooth, [0.04, 0.16], [0, 1])
  const eyebrowY = useTransform(smooth, [0.04, 0.16], [-8, 0])

  /* Points and CTA arrive after the headline has finished lighting — the last
     word's window closes at 0.745 — but both are done well before the scrub
     ends. Progress only reaches 1 once the panel's centre passes 40% of the
     viewport, which is slightly past the point where the panel sits nicely in
     frame; ending the CTA at 0.94 left it half-faded at exactly the moment
     someone is looking at it. */
  const pointsOpacity = useTransform(smooth, [0.5, 0.68], [0, 1])
  const pointsY = useTransform(smooth, [0.5, 0.68], [20, 0])

  const ctaOpacity = useTransform(smooth, [0.62, 0.8], [0, 1])
  const ctaY = useTransform(smooth, [0.62, 0.8], [22, 0])

  let wordIndex = 0

  return (
    <section
      className={`bookCall${still ? ' is-static' : ''}`}
      ref={sectionRef}
      aria-labelledby="bookcall-title"
    >
      <div className="wrap">
        <motion.div
          className="bookCall__panel"
          style={
            still
              ? undefined
              : { opacity: panelOpacity, y: panelY, scale: panelScale }
          }
        >
          <div className="bookCall__in">
            <motion.p
              className="bookCall__eyebrow"
              style={
                still ? undefined : { opacity: eyebrowOpacity, y: eyebrowY }
              }
            >
              <Send size={13} strokeWidth={2.4} aria-hidden="true" />
              <span>{bookConsultationData.eyebrow}</span>
            </motion.p>

            {/* Same reason as `StillConfused`: the words are separate spans so
                each can be lit, spaced by `margin-right` rather than by
                whitespace, so the accessible name read
                "BookYour1:1ConsultationOnlineOrInPerson". */}
            <h2
              className="bookCall__title"
              id="bookcall-title"
              aria-label={bookConsultationData.headlineLines.join(' ')}
            >
              {bookConsultationData.headlineLines.map((line) => (
                <span className="bookCall__line" key={line}>
                  {line.split(/\s+/).map((word) => {
                    const i = wordIndex++
                    return (
                      <LitWord
                        key={i}
                        word={word}
                        index={i}
                        progress={smooth}
                        still={still}
                      />
                    )
                  })}
                </span>
              ))}
            </h2>

            <motion.ul
              className="bookCall__points"
              style={still ? undefined : { opacity: pointsOpacity, y: pointsY }}
            >
              {bookConsultationData.points.map((point) => {
                const Icon = ICONS[point.icon]
                return (
                  <li className="bookCall__point" key={point.title}>
                    <span
                      className={`bookCall__tile bookCall__tile--${point.icon}`}
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={2.1} />
                    </span>
                    <h3 className="bookCall__pointTitle">{point.title}</h3>
                    <p className="bookCall__pointNote">{point.note}</p>
                  </li>
                )
              })}
            </motion.ul>

            <motion.div
              className="bookCall__ctaWrap"
              style={still ? undefined : { opacity: ctaOpacity, y: ctaY }}
            >
              <a className="bookCall__btn" href={bookConsultationData.href}>
                <span>{bookConsultationData.cta}</span>
                <span className="bookCall__btnIcon" aria-hidden="true">
                  <ArrowUpRight size={15} strokeWidth={2.6} />
                </span>
              </a>
              <p className="bookCall__ctaNote">
                {bookConsultationData.ctaNote}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
