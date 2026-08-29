import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks'
import {
  twoMethodsTitle,
  twoMethodsCards,
  type TwoMethodCard,
} from '../site'

/* Small badge icons — inline SVG keeps them sharp at every resolution and avoids
   an extra network request for two 14px pictograms. */
function BadgeIcon({ type }: { type: 'puzzle' | 'clip' }) {
  if (type === 'puzzle') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.535 1.065 1.03a2.5 2.5 0 1 0 3.259-3.259c-.494-.19-.953-.55-1.03-1.065a1.025 1.025 0 0 1 .303-.917l1.525-1.525A2.402 2.402 0 0 1 11.975 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
      </svg>
    )
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

/**
 * A single method card whose image grows as it scrolls into view, reproducing
 * the reference video's zoom-on-scroll effect. Desktop tracks each card;
 * phones share the section progress so stacked cards stay visually equal.
 *
 * The card is a rounded rectangle with a brand-blue gradient background, laid
 * out in two columns: copy on the left, photograph on the right, flush to the
 * card's bottom-right corner. As the user scrolls, the photograph smoothly
 * scales up out of that corner.
 */
function MethodCard({
  card,
  index,
  useSharedMobileMotion,
  sharedScale,
  sharedY,
}: {
  card: TwoMethodCard
  index: number
  useSharedMobileMotion: boolean
  sharedScale: MotionValue<number>
  sharedY: MotionValue<number>
}) {
  const cardRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 92%', 'center 38%'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0005,
  })

  /* Image scale: smooth spring zoom-in on scroll */
  const imgScale = useTransform(smooth, [0, 1], [0.75, 1])
  const imgY = useTransform(smooth, [0, 1], [35, 0])

  /* Phone cards stack vertically, so independent card triggers leave one
     image large and the other small in the same view. Share one section-based
     transform there; desktop keeps its original per-card motion untouched. */
  const activeScale = useSharedMobileMotion ? sharedScale : imgScale
  const activeY = useSharedMobileMotion ? sharedY : imgY

  return (
    <article
      className={`twoMethods__card twoMethods__card--${card.id}`}
      ref={cardRef}
    >
      {/* ── Text content ── */}
      <div className="twoMethods__content">
        <span className="twoMethods__badge">
          <BadgeIcon type={card.badgeIcon} />
          {card.badge}
        </span>

        <p className="twoMethods__desc">{card.description}</p>

        <a className="twoMethods__cta" href={card.href}>
          {card.cta}
          <ChevronRight size={14} strokeWidth={2.6} aria-hidden="true" />
        </a>
      </div>

      {/* ── Image with scroll-driven scale ── */}
      <div className="twoMethods__imageWrap">
        <motion.div
          className="twoMethods__imageInner"
          style={
            reduced
              ? undefined
              : {
                  scale: activeScale,
                  y: activeY,
                }
          }
        >
          <img
            src={card.image}
            alt={card.alt}
            width={card.width}
            height={card.height}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </motion.div>
      </div>
    </article>
  )
}

/**
 * "Two Easy Methods To Get Your Hair Back"
 *
 * Section on the Stick-On or Clip-On page.
 * Features a static clean heading followed by two compact side-by-side
 * blue-gradient cards with smooth scroll-driven image scaling.
 */
export function TwoMethods() {
  const sectionRef = useRef<HTMLElement>(null)
  const useSharedMobileMotion = useMediaQuery('(max-width: 480px)')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'center 38%'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0005,
  })

  const sharedScale = useTransform(smooth, [0, 1], [0.75, 1])
  const sharedY = useTransform(smooth, [0, 1], [35, 0])

  return (
    <section
      className="twoMethods"
      aria-labelledby="two-methods-title"
      ref={sectionRef}
    >
      <div className="wrap">
        <h2 className="twoMethods__title" id="two-methods-title">
          {twoMethodsTitle}
        </h2>

        <div className="twoMethods__grid">
          {twoMethodsCards.map((card, i) => (
            <MethodCard
              card={card}
              index={i}
              key={card.id}
              useSharedMobileMotion={useSharedMobileMotion}
              sharedScale={sharedScale}
              sharedY={sharedY}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
