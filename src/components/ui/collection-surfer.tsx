import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'

/**
 * A collection "surfer": cards laid out as one diagonal ribbon receding into
 * depth, with scroll bringing each in turn to the front and the pointer pulling
 * whichever card it is nearest.
 *
 * Ported from the supplied Tailwind/shadcn component. Four things changed, all
 * of them deliberate:
 *
 * 1. **No loop.** The original duplicated the list and took the scroll position
 *    modulo one set's length, so the ribbon ran forever. Here progress is
 *    clamped to [0, 1]: the track stops on the last card and will not wrap.
 *    Scrolling back up runs it in reverse to the first card, as asked.
 * 2. **Pinned, not fixed.** The original was `position: fixed` over a 50,000px
 *    spacer, which would have covered every other section on this page. It is
 *    now a sticky child of a section whose height is `100vh + travel` — the
 *    same pin the Achievements and Checklist sections use.
 * 3. **Plain CSS.** This project has no Tailwind and no shadcn; the utility
 *    classes are rules in `global.css`. Adding Tailwind now would bring its
 *    preflight reset and restyle everything already built.
 * 4. **`motion/react`, not `framer-motion`.** `framer-motion` is on disk only
 *    as a transitive dependency of `motion`; importing it directly leans on an
 *    undeclared package and ships a second copy of the animation runtime.
 *
 * Below 901px and for reduced-motion users the 3D scene is dropped entirely for
 * a scroll-snapped rail. Hijacking vertical scroll on a phone fights the
 * gesture the user already has.
 */
export type CollectionItem = { id: number; image: string; title: string }

export type CollectionSurferVariant = 'magnetic' | 'uplift' | 'simple'

/** Scroll distance spent bringing one card to the front. */
export const SCROLL_PER_ITEM = 420

/* The step vector between neighbouring cards. The ribbon runs left, down and
   back from the card in front, which sits at the right edge of the screen: the
   chain fills the frame from the right corner toward the lower left, and
   scrolling surfs it across. Running it up instead would put the small far
   cards directly behind the heading. */
const STEP_X = -300
const STEP_Y = 46
const STEP_Z = -300

/* Which way each card turns. The sign matters more than the angle: the cards
   sit to the right of the perspective origin, so turning the right edge toward
   the viewer (a negative angle) throws it further right and the card reads
   wide. Turning the left edge forward instead throws that edge right too,
   which folds the card up — at +50deg the front card measured 116px across
   instead of its 364px width. */
const CARD_TURN = -42

export type SurferState = {
  index: number
  atStart: boolean
  atEnd: boolean
  /** True when the 3D scene is dropped for the plain rail. */
  flat: boolean
}

type CollectionSurferProps = {
  items: CollectionItem[]
  variant?: CollectionSurferVariant
  /** Reduced-motion flag from the host, so the hook stays in one place. */
  still?: boolean
  className?: string
  labelledBy?: string
  /** Overlay UI — heading, controls — drawn on top of the pinned scene. */
  overlay?: ReactNode
  onStateChange?: (state: SurferState) => void
  renderCard?: (item: CollectionItem, index: number) => ReactNode
}

export function CollectionSurfer({
  items,
  variant = 'magnetic',
  still = false,
  className,
  labelledBy,
  overlay,
  onStateChange,
  renderCard,
}: CollectionSurferProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [flat, setFlat] = useState(true)

  useEffect(() => {
    const read = () =>
      setFlat(still || !window.matchMedia('(min-width: 901px)').matches)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [still])

  const last = items.length - 1
  const travel = last * SCROLL_PER_ITEM

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
  })

  /* The spring can overshoot past either end; clamping here is what replaces
     the original's modulo and is why the ribbon never wraps. */
  const progress = useTransform(smooth, (value) =>
    Math.min(1, Math.max(0, value)),
  )

  const x = useTransform(progress, [0, 1], [0, -last * STEP_X])
  const y = useTransform(progress, [0, 1], [0, -last * STEP_Y])
  const z = useTransform(progress, [0, 1], [0, -last * STEP_Z])

  const [reach, setReach] = useState({
    index: 0,
    atStart: true,
    atEnd: last === 0,
  })

  useMotionValueEvent(progress, 'change', (value) => {
    // Nothing consumes the state unless a host asked for it, and re-rendering
    // thirteen cards to tell nobody anything is pure waste.
    if (!onStateChange) return
    const next = {
      index: Math.round(value * last),
      atStart: value <= 0.005,
      atEnd: value >= 0.995,
    }
    setReach((previous) =>
      previous.index === next.index &&
      previous.atStart === next.atStart &&
      previous.atEnd === next.atEnd
        ? previous
        : next,
    )
  })

  const changed = useRef(onStateChange)
  changed.current = onStateChange
  useEffect(() => {
    changed.current?.({ ...reach, flat })
  }, [reach, flat])

  // Off-screen so no card is pulled until the pointer actually enters.
  const mouseX = useMotionValue(-10000)
  const mouseY = useMotionValue(-10000)

  const magnetic = variant !== 'simple' && !flat

  const onMouseMove = (e: React.MouseEvent) => {
    if (!magnetic) return
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  const onMouseLeave = () => {
    if (!magnetic) return
    mouseX.set(-10000)
    mouseY.set(-10000)
  }

  const card = (item: CollectionItem, i: number) =>
    renderCard ? (
      renderCard(item, i)
    ) : (
      <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
    )

  return (
    <section
      className={`surf${flat ? ' surf--flat' : ''}${
        className ? ` ${className}` : ''
      }`}
      ref={sectionRef}
      aria-labelledby={labelledBy}
      style={flat ? undefined : { height: `calc(100vh + ${travel}px)` }}
    >
      <div
        className="surf__pin"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {flat ? (
          <ul className="surf__rail">
            {items.map((item, i) => (
              <li className="surf__railItem" key={item.id}>
                {card(item, i)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="surf__scene">
            <motion.div
              className="surf__track"
              style={{ x, y, z, transformStyle: 'preserve-3d' }}
            >
              {items.map((item, i) => (
                <SurferCard
                  key={item.id}
                  item={item}
                  i={i}
                  last={last}
                  progress={progress}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  variant={variant}
                >
                  {card(item, i)}
                </SurferCard>
              ))}
            </motion.div>
          </div>
        )}

        {overlay ? <div className="surf__overlay">{overlay}</div> : null}
      </div>
    </section>
  )
}

function SurferCard({
  item,
  i,
  last,
  progress,
  mouseX,
  mouseY,
  variant,
  children,
}: {
  item: CollectionItem
  i: number
  last: number
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  variant: CollectionSurferVariant
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  /* Distance from the pointer to this card's centre on screen. `progress` is in
     the dependency list only so the value recomputes while the ribbon moves —
     the card slides out from under a stationary cursor otherwise. */
  const distance = useTransform([mouseX, mouseY, progress], ([px, py]) => {
    if (!ref.current || variant === 'simple') return 400
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.sqrt(
      Math.pow(Number(px) - cx, 2) + Math.pow(Number(py) - cy, 2),
    )
  })

  const targetScale = useTransform(distance, [0, 400], [1.42, 1])
  const springScale = useSpring(targetScale, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  })

  const targetUplift = useTransform(distance, [0, 400], [-90, 0])
  const springUplift = useSpring(targetUplift, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  })

  const transform = useTransform([springScale, springUplift], ([s, u]) => {
    const scale = variant === 'magnetic' ? Number(s) : 1
    const uplift = variant === 'uplift' ? Number(u) : 0

    return `translate3d(${i * STEP_X}px, ${i * STEP_Y + uplift}px, ${
      i * STEP_Z
    }px) rotateY(${CARD_TURN}deg) scale(${scale})`
  })

  /* How far this card is from the one in front: negative once it has been
     surfed past, positive while it is still to come. */
  const away = useTransform(progress, (value) => i - value * last)

  /* Cards still to come stay fully opaque — these are product shots, and a
     washed-out one misrepresents the product. Depth is carried by scale and
     perspective alone.

     Behind the front card, a fast dissolve. A card that has been surfed past
     keeps coming toward the camera, and at full opacity it fills the frame and
     clips against its edges — that reads as a mistake rather than as depth. It
     is gone by the time the next card lands. */
  const opacity = useTransform(away, (value) =>
    value < 0 ? Math.max(0, 1 + value / 1.1) : 1,
  )

  /* Once past the camera plane a card projects to tens of thousands of pixels
     wide. It is already at zero opacity by then, but a layer that size is
     still composited every frame, so take it out of the scene entirely. */
  const visibility = useTransform(away, (value) =>
    value < -1.15 ? 'hidden' : 'visible',
  )

  return (
    <motion.div
      ref={ref}
      className="surf__card"
      style={{ transform, opacity, visibility, transformStyle: 'preserve-3d' }}
    >
      <span className="surf__index" aria-hidden="true">
        {String(i + 1).padStart(2, '0')}
      </span>
      {children}
      <span className="sr-only">{item.title}</span>
    </motion.div>
  )
}

export default CollectionSurfer
