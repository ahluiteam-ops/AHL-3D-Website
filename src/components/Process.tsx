import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import {
  processAction,
  processSteps,
  processTitle,
  processVideo,
  type ProcessStep,
} from '../site'

/** Where each step's reveal starts, as a fraction of the pinned scroll — the
 *  scroll spent on one step lives in CSS as `--process-step` (32vh), which is
 *  what builds the section's height. Nothing here needs to know that length,
 *  because `useScroll` reports the pin as 0 → 1 whatever it measures. The
 *  rule under each step draws just behind its copy, so the line reads as the
 *  thing carrying the eye to the next step. */
const START = [0.1, 0.36, 0.62]
const COPY_WINDOW = 0.16
const RULE_WINDOW = 0.22

function Step({
  step,
  index,
  progress,
  last,
}: {
  step: ProcessStep
  index: number
  progress: MotionValue<number>
  last: boolean
}) {
  const from = START[index]
  const opacity = useTransform(progress, [from, from + COPY_WINDOW], [0, 1])
  const y = useTransform(progress, [from, from + COPY_WINDOW], [26, 0])
  const scaleX = useTransform(
    progress,
    [from + 0.04, from + 0.04 + RULE_WINDOW],
    [0, 1],
  )
  const markIn = useTransform(progress, [from, from + 0.06], [0, 1])
  const markOut = useTransform(
    progress,
    [from + 0.02 + RULE_WINDOW, from + 0.08 + RULE_WINDOW],
    [0, 1],
  )

  return (
    <li className="process__step">
      <motion.div className="process__copy" style={{ opacity, y }}>
        <span className="process__label">{step.label}</span>
        <h3 className="process__stepTitle">{step.title}</h3>
        <p>{step.body}</p>
      </motion.div>

      {/* The rule is the animation's spine: it draws from its own `+` toward
          the next step, and the marker at the far end only lights once it has
          arrived. */}
      <div className="process__rule">
        <motion.span className="process__mark" style={{ opacity: markIn }}>
          +
        </motion.span>
        <span className="process__line">
          <motion.i style={{ scaleX }} />
        </span>
        {last ? (
          <motion.span
            className="process__mark process__mark--end"
            style={{ opacity: markOut }}
          >
            +
          </motion.span>
        ) : null}
      </div>
    </li>
  )
}

function ProcessMedia() {
  const [playing, setPlaying] = useState(false)
  const playable = processVideo.src !== ''

  if (playable && playing) {
    return (
      <div className="process__media">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className="process__video"
          src={processVideo.src}
          poster={processVideo.poster}
          controls
          autoPlay
          playsInline
        />
      </div>
    )
  }

  const inner = (
    <>
      <img
        src={processVideo.poster}
        alt={playable ? '' : processVideo.alt}
        loading="lazy"
        decoding="async"
      />
      <span className="process__play">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
        </svg>
        {processVideo.label}
      </span>
    </>
  )

  /* No film supplied yet, so the block is a figure rather than a dead button —
   * a control that cannot do anything is worse than no control. */
  return playable ? (
    <button
      type="button"
      className="process__media process__media--playable"
      onClick={() => setPlaying(true)}
    >
      {inner}
    </button>
  ) : (
    <figure className="process__media">{inner}</figure>
  )
}

/**
 * "The Step-By-Step Process To Natural Hair".
 *
 * Built to TRIONN's "How we work" pattern from the reference recording: a dark
 * stage that pins, a heading that holds still, and the steps arriving one at a
 * time across the bottom as the scroll advances — each one preceded by a `+`
 * and followed by a rule that draws toward the next.
 *
 * The reference has no film. The client's artwork does, so the top of the
 * stage is a two-column masthead: heading and consultation CTA at the left,
 * the process film at the right. That fills the empty upper-right the
 * reference leaves, keeps the heading on the same left edge as the steps
 * beneath it, and lets the film sit above the step it illustrates rather than
 * competing with the row for attention.
 *
 * Below 901px and for reduced motion the pin is dropped: masthead, film and
 * all three steps stack as a plain list with every rule already drawn.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [still, setStill] = useState(true)
  const { ref: topRef, shown } = useReveal<HTMLDivElement>()

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
      className={`process${still ? ' process--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <div className="process__pin">
        <div className="process__in wrap">
          <div
            className="process__top"
            data-shown={shown ? 'true' : 'false'}
            ref={topRef}
          >
            <div className="process__lead">
              <h2 className="process__title" id="process-title">
                {processTitle.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>

              <a className="btn btn--lg process__cta" href="#consult">
                {processAction}
                <ArrowUpRight
                  className="btn__arrow"
                  size={16}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </a>
            </div>

            <ProcessMedia />
          </div>

          <ol className="process__steps">
            {processSteps.map((step, i) => (
              <Step
                key={step.title}
                step={step}
                index={i}
                progress={eased}
                last={i === processSteps.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
