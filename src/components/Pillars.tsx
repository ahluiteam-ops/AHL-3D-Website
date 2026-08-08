import { useEffect, useRef, useState } from 'react'
import { Cpu, Medal, ShieldCheck, Sparkles } from 'lucide-react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { pillars, pillarsTitle, type Pillar, type PillarIcon } from '../site'

const icons: Record<PillarIcon, typeof Medal> = {
  medal: Medal,
  cpu: Cpu,
  sparkles: Sparkles,
  shield: ShieldCheck,
}

/** Where each column's reveal starts, as a fraction of the pinned scroll. The
 *  columns arrive strictly left to right, which is what the reference does —
 *  the empty grid stands first and fills one bay at a time. */
const START = [0.08, 0.28, 0.48, 0.68]
const WINDOW = 0.17

/** The client's copy marks its emphasis with `**`, so the bold survives in
 *  `site.ts` as plain readable text instead of markup. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  )
}

function Column({
  pillar,
  index,
  progress,
}: {
  pillar: Pillar
  index: number
  progress: MotionValue<number>
}) {
  const Icon = icons[pillar.icon]
  const from = START[index]
  const opacity = useTransform(progress, [from, from + WINDOW], [0, 1])
  const y = useTransform(progress, [from, from + WINDOW], [30, 0])
  /* The icon leads its own column by a hair, so a bay reads as filling rather
     than switching on. */
  const iconOpacity = useTransform(progress, [from, from + 0.07], [0, 1])
  const iconY = useTransform(progress, [from, from + 0.07], [16, 0])

  return (
    <li className="pillars__col">
      <motion.span className="pillars__icon" style={{ opacity: iconOpacity, y: iconY }}>
        <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
      </motion.span>

      <motion.div className="pillars__copy" style={{ opacity, y }}>
        <h3>{pillar.title}</h3>
        <p>
          <Emphasised text={pillar.body} />
        </p>
      </motion.div>
    </li>
  )
}

/**
 * "Why Thousands Of Men Choose American Hairline".
 *
 * Built to the reference recording's pattern: a light stage that pins, a
 * left-aligned heading that holds still, and four columns divided by hairline
 * rules that fill one bay at a time, left to right, as the scroll advances.
 * The grid itself — the rules and the bays — is drawn before anything lands in
 * it, which is what makes the filling read as a sequence rather than four
 * separate fades.
 *
 * The client's artwork carried the same four pillars as a card carousel with
 * prev/next controls. The reference governs the presentation here, so the
 * cards became the reference's open columns and the controls went with them:
 * every pillar is on screen at once and scroll is the only control.
 *
 * Icons stay monochrome. The artwork tinted them blue, but `tokens.css`
 * reserves blue for the active link, the two buttons, the eyebrow and the
 * slider controls, and four decorative tiles are none of those.
 *
 * Below 901px and for reduced motion the pin is dropped: the columns stack as
 * a plain list with every one already present.
 */
export function Pillars() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [still, setStill] = useState(true)
  const { ref: headRef, shown } = useReveal<HTMLDivElement>()

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

  return (
    <section
      className={`pillars${still ? ' pillars--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="pillars-title"
    >
      <div className="pillars__pin">
        <div className="pillars__in wrap">
          <div
            className="pillars__head"
            data-shown={shown ? 'true' : 'false'}
            ref={headRef}
          >
            <h2 className="pillars__title" id="pillars-title">
              {pillarsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <ol className="pillars__grid">
            {pillars.map((pillar, i) => (
              <Column
                key={pillar.title}
                pillar={pillar}
                index={i}
                progress={eased}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
