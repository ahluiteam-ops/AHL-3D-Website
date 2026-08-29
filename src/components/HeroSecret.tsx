import { useCallback, useEffect, useRef } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks'
import { unifiedHairVideo } from '../site'
import { Hero } from './Hero'
import { Secret } from './Secret'

const VIDEO_DURATION_FALLBACK = 15.041995
const HERO_FILM_END = 7
const FRAME_INTERVAL = 1 / 24

/** One video element travels from Hero orbit into Secret detail. */
export function HeroSecret() {
  const journeyRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const secretRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(VIDEO_DURATION_FALLBACK)
  const targetTimeRef = useRef(0)
  const activeRef = useRef(false)
  const seekFrameRef = useRef<number | null>(null)
  const reduced = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 900px)')

  const { scrollYProgress: heroRaw } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const { scrollYProgress: secretRaw } = useScroll({
    target: secretRef,
    offset: ['start start', 'end end'],
  })

  const heroProgress = useSpring(heroRaw, {
    stiffness: 105,
    damping: 30,
    mass: 0.42,
    restDelta: 0.00025,
  })
  const secretProgress = useSpring(secretRaw, {
    stiffness: 92,
    damping: 28,
    mass: 0.45,
    restDelta: 0.00025,
  })
  const objectPosition = useTransform(
    secretProgress,
    [0, 0.12],
    ['50% 50%', '50% 50%'],
  )
  const filmOpacity = useTransform(
    heroProgress,
    [0, 0.5, 0.68],
    compact && !reduced ? [0, 0, 1] : [1, 1, 1],
  )
  const filmX = useTransform(
    secretProgress,
    [0, 0.82, 1],
    reduced
      ? ['0vw', '0vw', '0vw']
      : ['0vw', '0vw', compact ? '32vw' : '20vw'],
  )

  const applyLatestSeek = useCallback(() => {
    const video = videoRef.current
    if (!video || reduced || !activeRef.current || video.readyState < 1 || video.seeking) return

    const target = targetTimeRef.current
    if (Math.abs(video.currentTime - target) < FRAME_INTERVAL) return
    video.currentTime = target
  }, [reduced])

  const scheduleSeek = useCallback(() => {
    if (seekFrameRef.current !== null) return
    seekFrameRef.current = requestAnimationFrame(() => {
      seekFrameRef.current = null
      applyLatestSeek()
    })
  }, [applyLatestSeek])

  useMotionValueEvent(heroProgress, 'change', (progress) => {
    if (reduced || secretRaw.get() > 0) return
    targetTimeRef.current = Math.min(1, Math.max(0, progress)) * HERO_FILM_END
    scheduleSeek()
  })

  useMotionValueEvent(secretProgress, 'change', (progress) => {
    if (reduced || heroRaw.get() < 1) return
    const lastFrame = Math.max(HERO_FILM_END, durationRef.current - FRAME_INTERVAL)
    targetTimeRef.current = HERO_FILM_END + Math.min(1, Math.max(0, progress)) *
      (lastFrame - HERO_FILM_END)
    scheduleSeek()
  })

  useEffect(() => {
    const journey = journeyRef.current
    const video = videoRef.current
    if (!journey || !video) return

    video.pause()

    const onMetadata = () => {
      if (Number.isFinite(video.duration)) durationRef.current = video.duration
      if (reduced) {
        video.currentTime = 0
        return
      }
      scheduleSeek()
    }
    const onSeeked = () => scheduleSeek()

    video.addEventListener('loadedmetadata', onMetadata)
    video.addEventListener('seeked', onSeeked)
    if (video.readyState >= 1) onMetadata()

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting
        if (entry.isIntersecting) scheduleSeek()
      },
      { threshold: 0.01 },
    )
    observer.observe(journey)

    return () => {
      activeRef.current = false
      observer.disconnect()
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('seeked', onSeeked)
      if (seekFrameRef.current !== null) cancelAnimationFrame(seekFrameRef.current)
      seekFrameRef.current = null
    }
  }, [reduced, scheduleSeek])

  return (
    <div
      className={`heroSecret${reduced ? ' heroSecret--still' : ''}`}
      ref={journeyRef}
    >
      <div className="heroSecret__filmFrame" aria-hidden="true">
        <motion.div className="heroSecret__filmMotion" style={{ x: filmX }}>
          <motion.video
            className="heroSecret__film"
            ref={videoRef}
            src={unifiedHairVideo}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            style={{ objectPosition, opacity: filmOpacity }}
          />
        </motion.div>
      </div>

      <Hero rootRef={heroRef} />
      <Secret sectionRef={secretRef} progress={secretProgress} />
    </div>
  )
}
