import { Fragment, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ArrowUpRight, Heart, Sparkles, Timer } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import {
  balanceCta,
  balanceNote,
  balanceOptions,
  balanceTitle,
  balanceTitleBreaks,
  type BalanceTrait,
} from '../site'

/* The design uses 🍀 ❤️ ⏰; these are the lucide equivalents, as every other
   section on this site does. `Clover` was the literal match for the emoji but
   read as an unrecognisable knot at 16px and says nothing about *looking*
   natural — `Sparkles` does, and the three now read apart at a glance: look,
   comfort, lifespan. */
const icons: Record<BalanceTrait['icon'], typeof Heart> = {
  look: Sparkles,
  comfort: Heart,
  lifespan: Timer,
}

/** `**` marks the bold, as everywhere else on these pages. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  )
}

/**
 * One headline word, lit as the section is scrubbed.
 *
 * The same technique as `StillConfused`'s `IlluminatedWord` — the dark-stage
 * reveal idiom on this site — with the sweep spanning whatever headline this
 * instance was given rather than a fixed count.
 */
function LitWord({
  word,
  index,
  total,
  progress,
  still,
}: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
  still: boolean
}) {
  const start = 0.05 + (index / total) * 0.62
  const end = Math.min(0.86, start + 0.13)

  const opacity = useTransform(progress, [start, end], [0.24, 1])
  const y = useTransform(progress, [start, end], [8, 0])
  const color = useTransform(
    progress,
    [start, end],
    ['rgba(255, 255, 255, 0.24)', 'rgba(255, 255, 255, 1)'],
  )

  return (
    <motion.span
      className="balance__word"
      style={still ? undefined : { opacity, y, color }}
    >
      {word}
    </motion.span>
  )
}

/**
 * A glass panel that tilts toward the pointer.
 *
 * **Entrance and tilt are one owner, deliberately.** The entrance used to be a
 * CSS `transform` on this element; adding a pointer-driven rotation would have
 * meant two rules writing `transform`, and an inline one always wins — the card
 * would have snapped to its final position the moment the pointer arrived.
 * Both now run through motion, which composes individual transform properties
 * rather than overwriting a shorthand.
 *
 * `transformPerspective` is set here rather than as a `perspective` on the grid
 * so each card has its own vanishing point. Shared perspective makes the card
 * furthest from centre look sheared instead of tilted.
 *
 * **Tilt is skipped entirely without a hover-capable pointer**, not merely left
 * unused: on a touchscreen `pointermove` fires during a scroll-drag, so a card
 * would tip as the reader scrolls past it and stay tipped.
 */
function TiltCard({
  option,
  index,
  shown,
  still,
}: {
  option: { title: string; traits: BalanceTrait[] }
  index: number
  shown: boolean
  still: boolean
}) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 260, damping: 22, mass: 0.4 })
  const rotateY = useSpring(ry, { stiffness: 260, damping: 22, mass: 0.4 })

  const canTilt = () =>
    !still && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!canTilt()) return
    const b = e.currentTarget.getBoundingClientRect()
    /* -0.5 to 0.5 from the card's centre, so the sign falls out of the maths
       rather than needing a branch. */
    const px = (e.clientX - b.left) / b.width - 0.5
    const py = (e.clientY - b.top) / b.height - 0.5
    /* 7 degrees. Enough to read as depth on a glass panel, small enough that
       the text stays square to the eye. */
    ry.set(px * 14)
    rx.set(py * -14)
  }

  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      className="balance__card"
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={false}
      animate={
        shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={
        still
          ? { duration: 0 }
          : {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + index * 0.1,
            }
      }
    >
      <h3 className="balance__cardTitle">{option.title}</h3>
      <ul className="balance__traits">
        {option.traits.map((trait) => {
          const Icon = icons[trait.icon]
          return (
            <li className="balance__trait" key={trait.label}>
              <Icon
                className="balance__mark"
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <span>{trait.label}</span>
            </li>
          )
        })}
      </ul>
    </motion.article>
  )
}

/**
 * "Choose Your Perfect Balance: Look, Comfort, Or Lifespan?"
 *
 * Page 5, directly below the hero. It states the trade-off the rest of the page
 * then details: three things are on offer, no system delivers all of them, and
 * the reader has to pick a side. Option A carries two of the three and Option B
 * the remaining one, which is why the closing line reads "only 1 out of 2" — one
 * *option*, not one quality.
 *
 * **The glass needs something behind it, so the section paints its own field.**
 * `backdrop-filter` over a flat ground is an invisible effect at a real paint
 * cost: with nothing but one colour behind the panel there is nothing for a blur
 * to blur. Three soft colour orbs drift across the dark stage and the panels
 * frost *those*. Delete the orbs and the glass stops being glass — that is the
 * one thing to know before editing this section.
 *
 * The headline is scrubbed word by word, the same dark-stage idiom
 * `StillConfused` uses. Under `prefers-reduced-motion` every word renders lit
 * and nothing transforms.
 */
export function BalanceChoice() {
  const sectionRef = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'center 42%'],
  })
  const eased = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  })

  const words = balanceTitle.split(' ')

  return (
    <section
      className="balance"
      ref={sectionRef}
      aria-labelledby="balance-title"
    >
      {/* The field the panels frost. Decorative, so it is hidden rather than
          described. */}
      <div className="balance__field" aria-hidden="true">
        <span className="balance__orb balance__orb--a" />
        <span className="balance__orb balance__orb--b" />
        <span className="balance__orb balance__orb--c" />
      </div>

      <div className="wrap">
        <div
          className="balance__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          {/* Each word is its own span so it can be lit individually, and
              `.balance__line` spaces them with a flex `column-gap` — so there is
              no whitespace in the markup and the heading announced as
              "ChooseYourPerfectBalance:Look,Comfort,OrLifespan?". Text nodes
              are not the fix inside a flex row: they become anonymous flex items
              and gain their own gaps. Naming the heading is, and it leaves the
              scrub untouched. Ninth component in this codebase to need one of
              the two fixes for this. */}
          <h2
            className="balance__title"
            id="balance-title"
            aria-label={balanceTitle}
          >
            {/* One wrapping row, not one element per line. The phone's grouping
                puts "Look," and "Comfort," together and those sit either side of
                the desktop break, so separate line elements could not produce
                both without duplicating every word. A word flagged for a
                breakpoint takes `flex-basis: 100%` there and starts a new line.

                The words are flex items spaced by a `column-gap`, so there is no
                whitespace between them — the heading's accessible name comes from
                the `aria-label` above. */}
            <span className="balance__line">
              {words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                  {/* A zero-height full-width flex item forces everything after
                      it onto a new line while leaving the following word free to
                      share that line. Flagging the *word* with
                      `flex-basis: 100%` instead gives it the whole row to
                      itself — measured five lines on a phone where three were
                      wanted. */}
                  {balanceTitleBreaks.wide.includes(i) ? (
                    <span className="balance__break" data-at="wide" aria-hidden="true" />
                  ) : null}
                  {balanceTitleBreaks.narrow.includes(i) ? (
                    <span className="balance__break" data-at="narrow" aria-hidden="true" />
                  ) : null}
                  <LitWord
                    word={word}
                    index={i}
                    total={words.length}
                    progress={eased}
                    still={still}
                  />
                </Fragment>
              ))}
            </span>
          </h2>

          <div className="balance__grid">
            {balanceOptions.map((option, i) => (
              <TiltCard
                key={option.title}
                option={option}
                index={i}
                shown={shown}
                still={still}
              />
            ))}
          </div>

          <p className="balance__note">
            <Emphasised text={balanceNote} />
          </p>

          <a className="balance__cta" href={balanceCta.href}>
            <span>{balanceCta.label}</span>
            <span className="balance__ctaIcon" aria-hidden="true">
              <ArrowUpRight size={14} strokeWidth={2.6} />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
