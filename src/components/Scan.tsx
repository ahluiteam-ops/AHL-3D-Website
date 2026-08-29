import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { scanImage, scanTitle } from '../site'

type Rect = { left: number; top: number; width: number; height: number }

const ZERO: Rect = { left: 0, top: 0, width: 0, height: 0 }

/**
 * "Uses Advanced 3D Scan Technology".
 *
 * Built to the reference recording's move: the headline holds still while the
 * picture set inline within it grows out of its own slot until it covers the
 * viewport, dimming the type it is passing over.
 *
 * The picture is **not** scaled. It is an absolutely positioned panel whose
 * `left/top/width/height` are interpolated from the slot's measured rect to
 * the stage's, which is what a scale transform cannot give: the panel changes
 * aspect as it grows, so `object-fit: cover` re-crops the photograph on the
 * way out, and the corner radius stays a real radius instead of being
 * magnified by the same factor as everything else.
 *
 * The slot itself is an empty inline-block inside the heading. It reserves the
 * space and is never painted; measuring it is how the panel knows where the
 * word it replaces sits, at any type size, in any wrap.
 *
 * Below 901px and for reduced motion the pin is dropped, the slot collapses so
 * the heading reads as two plain lines, and the picture sits under it as an
 * ordinary block.
 */
export function Scan() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()
  const [still, setStill] = useState(true)
  const [slot, setSlot] = useState<Rect>(ZERO)
  const [stage, setStage] = useState<Rect>(ZERO)

  /* The slot's rect is read relative to the pin, because that is the box the
     panel is positioned inside. */
  const measure = useCallback(() => {
    const pin = pinRef.current
    const el = slotRef.current
    if (!pin || !el) return
    const p = pin.getBoundingClientRect()
    const s = el.getBoundingClientRect()

    /* The grown panel stops at the pin's padding box, not at its edges, so the
       picture keeps air on all four sides. The inset lives in the stylesheet
       as `.scan__pin`'s padding and is read back here; there is no second
       number to keep in step. The panel is absolutely positioned against the
       padding box, which with no border is the border box, so these
       coordinates and the slot's below are already in the same space. */
    const cs = getComputedStyle(pin)
    const padX = parseFloat(cs.paddingLeft) || 0
    const padY = parseFloat(cs.paddingTop) || 0

    setStage({
      left: padX,
      top: padY,
      width: Math.max(0, p.width - padX * 2),
      height: Math.max(0, p.height - padY * 2),
    })
    setSlot({
      left: s.left - p.left,
      top: s.top - p.top,
      width: s.width,
      height: s.height,
    })
  }, [])

  useEffect(() => {
    const read = () => {
      setStill(reduced || !window.matchMedia('(min-width: 901px)').matches)
      measure()
    }
    read()

    /* Type reflows after the webfont lands and the slot moves with it, so one
       measurement at mount is not enough. */
    const ro = new ResizeObserver(measure)
    if (pinRef.current) ro.observe(pinRef.current)
    if (slotRef.current) ro.observe(slotRef.current)
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', read)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [measure, reduced])

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

  /* One value drives the whole growth. It rests for a moment before starting,
     so the headline is read as a headline first. */
  const t = useTransform(eased, [0.08, 0.78], [0, 1], { clamp: true })

  /* Written out rather than pushed through a helper: a helper that called
     `useTransform` would be a hook wearing a plain function's clothes. */
  const left = useTransform(t, [0, 1], [slot.left, stage.left])
  const top = useTransform(t, [0, 1], [slot.top, stage.top])
  const width = useTransform(t, [0, 1], [slot.width, stage.width])
  const height = useTransform(t, [0, 1], [slot.height, stage.height])
  /* It stays a card. The radius used to run to 0 because the panel used to
     finish flush with the viewport, where a corner would have been cut off by
     the edge anyway; inset, a squared-off rectangle would just look unfinished. */
  const radius = useTransform(t, [0, 1], [12, 20], { clamp: true })
  /* The type dims rather than disappearing: the panel is passing in front of
     it, not deleting it. */
  const titleOpacity = useTransform(t, [0.12, 0.72], [1, 0.28], { clamp: true })
  const imageScale = useTransform(t, [0, 1], [1.12, 1])

  return (
    <section
      className={`scan${still ? ' scan--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="scan-title"
    >
      <div className="scan__pin" ref={pinRef}>
        <div className="scan__in wrap" ref={revealRef}>
          <motion.h2
            className="scan__title"
            id="scan-title"
            data-shown={shown ? 'true' : 'false'}
            style={still ? undefined : { opacity: titleOpacity }}
          >
            {/* The spaces are real, not the slot's margin: the slot is
                `aria-hidden`, so without them the heading is announced as
                "Uses Advanced3D Scan Technology". */}
            <span className="scan__line">
              {`${scanTitle.before} `}
              <span className="scan__slot" ref={slotRef} aria-hidden="true" />
              {` ${scanTitle.after}`}
            </span>
            <span className="scan__line">{scanTitle.second}</span>
          </motion.h2>
        </div>

        <motion.div
          className="scan__panel"
          data-shown={shown ? 'true' : 'false'}
          style={still ? undefined : { left, top, width, height, borderRadius: radius }}
        >
          <motion.img
            src={scanImage.src}
            alt={scanImage.alt}
            style={still ? undefined : { scale: imageScale }}
            loading="lazy"
            decoding="async"
          />
          <span className="scan__sweep" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}
