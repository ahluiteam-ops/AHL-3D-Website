import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  EyeOff,
  Frown,
  Pill,
  ShieldCheck,
  Smile,
  Syringe,
} from 'lucide-react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'
import { storyCta, storyPoints, storyTitle, type StoryIcon } from '../site'

const icons: Record<StoryIcon, typeof Frown> = {
  frown: Frown,
  'eye-off': EyeOff,
  pill: Pill,
  syringe: Syringe,
  shield: ShieldCheck,
}

/* One row per point, plus the closing card. */
const ROWS = storyPoints.length + 1
const LAST = ROWS - 1

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type RowProps = {
  index: number
  progress: MotionValue<number>
  still: boolean
  className?: string
  children: ReactNode
}

function StoryRow({ index, progress, still, className, children }: RowProps) {
  /* Two overlapping ramps. `open` runs a row from its peek to its full height
     over one step of scroll. `peek` starts a step earlier, which is what puts
     the next card on screen as a narrower slab under the current one — the
     move the reference makes, and the thing that tells you more is coming. */
  const open = useTransform(progress, (value) =>
    clamp01(value * LAST - (index - 1)),
  )
  const peek = useTransform(progress, (value) =>
    clamp01(value * LAST - (index - 2)),
  )

  /* `fr` cannot appear inside `calc()`, so this one value is written as a
     string from here rather than composed in the stylesheet. `0fr` collapses
     the row and `1fr` resolves to its content height, which is how the row
     opens to exactly the height its copy needs with nothing measured.
     The `minmax(0, …)` is load-bearing: a bare `fr` track carries an automatic
     min-content minimum, so `0fr` alone left every closed row standing at the
     height of its own padding — measured 46px instead of collapsing. */
  const rows = useTransform(open, (value) => `minmax(0, ${value}fr)`)
  const scaleX = useTransform(open, [0, 1], [0.955, 1])

  return (
    <motion.li
      className={`story__row${className ? ` ${className}` : ''}`}
      style={
        still
          ? undefined
          : ({
              gridTemplateRows: rows,
              scaleX,
              '--open': open,
              '--peek-amt': peek,
            } as MotionStyle)
      }
    >
      <div className="story__rowIn">{children}</div>
    </motion.li>
  )
}

/**
 * "This Might Sound Like Your Story".
 *
 * Built on TRIONN's "Our values" pattern from
 * `reference/Recording 2026-08-06 182025.mp4`: the heading holds still on the
 * left while the cards stack in on the right one at a time, each one preceded
 * by a narrower slab of itself peeking out from under the card above.
 *
 * Below 901px and for reduced motion the pin is dropped and every card is
 * simply open — the content is five short lines and an offer, and none of it
 * depends on the animation to make sense.
 */
export function Story() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [still, setStill] = useState(true)

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
    stiffness: 120,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  })

  const progress = useTransform(eased, clamp01)

  return (
    <section
      className={`story${still ? ' story--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="story-title"
    >
      <div className="story__pin">
        <div className="story__in wrap">
          <h2 className="story__title" id="story-title">
            {storyTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <ol className="story__rows">
            {storyPoints.map((point, i) => {
              const Icon = icons[point.icon]
              return (
                <StoryRow
                  key={point.text}
                  index={i}
                  progress={progress}
                  still={still}
                >
                  <span className="story__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <p>{point.text}</p>
                </StoryRow>
              )
            })}

            <StoryRow
              index={LAST}
              progress={progress}
              still={still}
              className="story__row--cta"
            >
              <Smile
                className="story__ctaMark"
                size={30}
                strokeWidth={2}
                aria-hidden="true"
              />
              <h3>{storyCta.title}</h3>
              <p>{storyCta.body}</p>
              <a className="story__ctaBtn" href={storyCta.href}>
                {storyCta.action}
                <ArrowUpRight size={15} strokeWidth={2.4} />
              </a>
            </StoryRow>
          </ol>
        </div>
      </div>
    </section>
  )
}
