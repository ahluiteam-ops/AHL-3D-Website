import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks'
import {
  secretBenefits,
  secretClosingLines,
  secretTitleLines,
  secretVideo,
} from '../site'

type SecretPhase = 'intro' | 'model' | 'benefits' | 'closing'

function phaseAt(time: number): SecretPhase {
  if (time < 3) return 'intro'
  if (time < 4.25) return 'model'
  if (time < 8.65) return 'benefits'
  return 'closing'
}

/**
 * One-shot product film. Playback begins when the section first enters view,
 * pauses off-screen, resumes on return, and holds its final frame when done.
 */
export function Secret() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const visibleRef = useRef(false)
  const startedRef = useRef(false)
  const still = usePrefersReducedMotion()
  const [phase, setPhase] = useState<SecretPhase>('intro')

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || still) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35

        if (visible && !visibleRef.current) {
          if (!startedRef.current) {
            video.currentTime = 0
            setPhase('intro')
            startedRef.current = true
          }

          if (!video.ended) void video.play()
        } else if (!visible) {
          video.pause()
        }

        visibleRef.current = visible
      },
      { threshold: [0, 0.35] },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [still])

  const updatePhase = (time: number) => {
    const next = phaseAt(time)
    setPhase((current) => (current === next ? current : next))
  }

  const introVisible = still || phase === 'intro'
  const benefitsVisible = still || phase === 'benefits'
  const closingVisible = still || phase === 'closing'

  return (
    <section
      className={`secret secret--autoplay secret--phase-${phase}${still ? ' is-static' : ''}`}
      ref={sectionRef}
      aria-labelledby="secret-title"
    >
      <div className="secret__pin">
        <div className="secret__stage" aria-hidden="true">
          <video
            className="secret__model"
            ref={videoRef}
            src={secretVideo}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            onTimeUpdate={(event) => updatePhase(event.currentTarget.currentTime)}
            onSeeked={(event) => updatePhase(event.currentTarget.currentTime)}
            onEnded={() => setPhase('closing')}
          />
        </div>

        <div
          className={`secret__scene secret__scene--intro${introVisible ? ' is-visible' : ''}`}
        >
          <h2 className="secret__title" id="secret-title">
            {secretTitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>

        <div
          className={`secret__scene secret__scene--benefits${benefitsVisible ? ' is-visible' : ''}`}
        >
          <div className="secret__benefitList">
            {secretBenefits.map((benefit) => (
              <div className="secret__benefit" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`secret__scene secret__scene--closing${closingVisible ? ' is-visible' : ''}`}
        >
          <p className="secret__title secret__title--closing">
            {secretClosingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
