import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight, MessageSquare } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks'
import { stillConfusedData } from '../site'

export type StillConfusedData = {
  eyebrow: string
  headlineLines: readonly string[]
  subtext: string
  cta: string
  href: string
}

function IlluminatedWord({
  word,
  index,
  totalWords,
  progress,
  still,
}: {
  word: string
  index: number
  /* Passed in rather than read from a module constant: the sweep has to span
     whatever headline this instance was given, and page 4's is shorter than
     page 2's. A fixed total would leave the last words unlit. */
  totalWords: number
  progress: MotionValue<number>
  still: boolean
}) {
  /* Calculate the scrub window for this word:
     Words light up sequentially from 0.05 to 0.72 of progress */
  const start = 0.05 + (index / totalWords) * 0.65
  const end = Math.min(0.85, start + 0.12)

  const opacity = useTransform(progress, [start, end], [0.22, 1])
  const y = useTransform(progress, [start, end], [8, 0])
  const color = useTransform(
    progress,
    [start, end],
    ['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 1)'],
  )

  return (
    <motion.span
      className="stillConfused__word"
      style={
        still
          ? undefined
          : {
              opacity,
              y,
              color,
            }
      }
    >
      {word}
    </motion.span>
  )
}

/**
 * "Still Confused? Not Sure What Best For You? Let’s Find The Perfect Fit"
 *
 * Immersive dark section placed above the footer on the Stick-On or Clip-On page.
 * Matches the reference video `still confuse section refrence.mp4`:
 * - Dark ambient stage with subtle vertical capsule background and glow
 * - Chat-bubble eyebrow tag
 * - Scroll-driven word-by-word illumination scrub across the main headline
 * - Subtext and primary "Speak To An Expert ↗" CTA button revealing smoothly
 * - Full reduced-motion and mobile responsive fallbacks
 */
export function StillConfused({
  data = stillConfusedData,
  titleId = 'still-confused-title',
}: { data?: StillConfusedData; titleId?: string } = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const totalWords = data.headlineLines.reduce(
    (n, line) => n + line.split(/\s+/).length,
    0,
  )

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.35,
    restDelta: 0.0005,
  })

  /* Eyebrow appears early */
  const eyebrowOpacity = useTransform(smooth, [0, 0.12], [0.3, 1])
  const eyebrowY = useTransform(smooth, [0, 0.12], [-10, 0])

  /* Background capsule opacity and scale */
  const capsuleOpacity = useTransform(smooth, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.7])
  const capsuleScale = useTransform(smooth, [0, 0.5, 1], [0.92, 1, 1.04])

  /* Subtext and CTA appear toward the end of the text scrub */
  const subtextOpacity = useTransform(smooth, [0.65, 0.82], [0, 1])
  const subtextY = useTransform(smooth, [0.65, 0.82], [18, 0])

  const ctaOpacity = useTransform(smooth, [0.75, 0.92], [0, 1])
  const ctaY = useTransform(smooth, [0.75, 0.92], [22, 0])
  const ctaScale = useTransform(smooth, [0.75, 0.92], [0.94, 1])

  let globalWordIndex = 0

  return (
    <section
      className={`stillConfused${still ? ' is-static' : ''}`}
      ref={sectionRef}
      aria-labelledby={titleId}
    >
      <div className="stillConfused__pin">
        {/* Ambient background capsule matching reference */}
        <motion.div
          className="stillConfused__capsule"
          aria-hidden="true"
          style={
            still
              ? undefined
              : {
                  opacity: capsuleOpacity,
                  scale: capsuleScale,
                }
          }
        >
          <div className="stillConfused__capsuleGlow" />
          <div className="stillConfused__capsuleDot" />
        </motion.div>

        <div className="stillConfused__content wrap">
          {/* Eyebrow tag */}
          <motion.div
            className="stillConfused__eyebrow"
            style={
              still
                ? undefined
                : {
                    opacity: eyebrowOpacity,
                    y: eyebrowY,
                  }
            }
          >
            <MessageSquare size={13} strokeWidth={2.4} aria-hidden="true" />
            <span>{data.eyebrow}</span>
          </motion.div>

          {/* Word-by-word illuminated headline */}
          {/* The words are separate spans so each can be lit individually, and
              `.stillConfused__line` spaces them with a flex `column-gap` — so
              there is no whitespace in the markup and the accessible name came
              out as "WeUnderstandThisIsNotASmallDecision.". Text nodes are not
              the fix here: inside a flex row they would become anonymous flex
              items and gain their own gaps. Naming the heading is, and it
              leaves the layout untouched. */}
          <h2
            className="stillConfused__title"
            id={titleId}
            aria-label={data.headlineLines.join(' ')}
          >
            {data.headlineLines.map((line, lIdx) => (
              <span className="stillConfused__line" key={lIdx}>
                {line.split(/\s+/).map((word) => {
                  const currentIdx = globalWordIndex++
                  return (
                    <IlluminatedWord
                      key={currentIdx}
                      word={word}
                      index={currentIdx}
                      totalWords={totalWords}
                      progress={smooth}
                      still={still}
                    />
                  )
                })}
              </span>
            ))}
          </h2>

          {/* Subtext */}
          <motion.p
            className="stillConfused__subtext"
            style={
              still
                ? undefined
                : {
                    opacity: subtextOpacity,
                    y: subtextY,
                  }
            }
          >
            {data.subtext}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="stillConfused__ctaWrap"
            style={
              still
                ? undefined
                : {
                    opacity: ctaOpacity,
                    y: ctaY,
                    scale: ctaScale,
                  }
            }
          >
            <a className="stillConfused__btn" href={data.href}>
              <span>{data.cta}</span>
              <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
