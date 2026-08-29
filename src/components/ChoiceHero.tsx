import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import {
  choiceHeroEyebrow,
  choiceHeroLede,
  choiceHeroMedia,
  choiceHeroTitle,
} from '../site'

/** The client's copy marks its emphasis with `**`, so the bold survives in `site.ts` as readable text. */
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
 * Hero of the "Stick-On or Clip-On" page.
 *
 * Matches the reference video `reference/svc_r.mp4`:
 * - Clean light theme matching homepage foundation
 * - Eyebrow pill in soft primary tint with exact primary-colored puzzle piece
 * - Natural scroll flow: Header scrolls away naturally without fixed stickiness
 * - Card smoothly expands/scales up as it scrolls into full view with spring physics
 * - 100% responsive and reduced-motion safe
 */
export function ChoiceHero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { ref: headerRef, shown } = useReveal<HTMLDivElement>()

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 92%', 'center 38%'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0005,
  })

  const scale = useTransform(smooth, [0, 1], [0.82, 1.04])
  const radius = useTransform(smooth, [0, 1], [36, 16])

  return (
    <section className="choice" aria-labelledby="choice-title">
      <div className="wrap">
        <div
          className="choice__header"
          ref={headerRef}
          data-shown={shown ? 'true' : 'false'}
        >
          {choiceHeroEyebrow && (
            <div className="choice__eyebrow">
              <span className="choice__eyebrowIcon" aria-hidden="true" />
              <span>{choiceHeroEyebrow.label}</span>
            </div>
          )}

          <h1 className="choice__title" id="choice-title">
            {choiceHeroTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <p className="choice__lede">
            <Emphasised text={choiceHeroLede} />
          </p>
        </div>

        <div className="choice__cardWrap" ref={cardRef}>
          <motion.figure
            className="choice__card"
            style={
              reduced
                ? undefined
                : {
                    scale,
                    borderRadius: radius,
                  }
            }
          >
            <img
              src={choiceHeroMedia.src}
              alt={choiceHeroMedia.alt}
              width={1920}
              height={1080}
              decoding="async"
            />
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
