import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * The card stack that builds itself as a pinned section scrolls.
 *
 * Built for `Story` on the homepage, from TRIONN's "Our values" pattern in
 * `reference/Recording 2026-08-06 182025.mp4`: the heading holds still on the
 * left while cards stack in on the right one at a time, each preceded by a
 * narrower slab of itself peeking out from under the card above. Extracted when
 * the second section needed the same move, so the mechanism lives once.
 *
 * **What is shared is the mechanism, not the appearance.** This publishes two
 * ramps and a set of geometry values; each section's own stylesheet decides
 * what a row looks like. That is why the CSS custom properties are generically
 * named (`--open`, `--peek-amt`) while the class names are not.
 */
export function useScrollStack(rowCount: number) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [still, setStill] = useState(true)

  /* The stack needs room to build. Below 901px there is none, and under
     reduced motion it should not build at all — both fall back to every row
     simply open. Starting `true` means the static state is what renders first,
     so a slow client never flashes a collapsed stack. */
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

  return { sectionRef, still, progress, last: rowCount - 1 }
}

type StackRowProps = {
  index: number
  /* The index of the final row, which is what the ramps divide by. Passed in
     rather than inferred: a row does not know how many siblings it has. */
  last: number
  progress: MotionValue<number>
  still: boolean
  /* The row element's classes. May carry modifiers. */
  className: string
  /* The inner wrapper's class, passed separately rather than derived from
     `className`: a row whose class list carries a modifier would otherwise
     produce an inner class built from the modifier instead of the base. */
  innerClassName: string
  /* Milliseconds of stagger for the static fallback's own entrance. */
  staticDelay?: number
  children: ReactNode
}

export function StackRow({
  index,
  last,
  progress,
  still,
  className,
  innerClassName,
  staticDelay = 70,
  children,
}: StackRowProps) {
  /* Two overlapping ramps. `open` runs a row from its peek to its full height
     over one step of scroll. `peek` starts a step earlier, which is what puts
     the next card on screen as a narrower slab under the current one — the
     move the reference makes, and the thing that tells you more is coming. */
  const open = useTransform(progress, (value) =>
    clamp01(value * last - (index - 1)),
  )
  const peek = useTransform(progress, (value) =>
    clamp01(value * last - (index - 2)),
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
      className={className}
      style={
        still
          ? ({ '--mobile-delay': `${index * staticDelay}ms` } as MotionStyle)
          : ({
              gridTemplateRows: rows,
              scaleX,
              '--open': open,
              '--peek-amt': peek,
            } as MotionStyle)
      }
    >
      <div className={innerClassName}>{children}</div>
    </motion.li>
  )
}
