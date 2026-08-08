import { Fragment, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'
import {
  checklistLede,
  checklistPoints,
  checklistTitle,
  checklistVideo,
  type ChecklistPoint,
} from '../site'

const LAST = checklistPoints.length - 1

/* The scrubbed section is one long sticky stage. `--cursor` is the only value
 * that travels: the track reads it to translate itself, the progress rail
 * reads it for its width, and every row reads its own distance from it. It is
 * written as a bare number so CSS `calc()` can multiply it by the row pitch,
 * which keeps the pitch a responsive `clamp()` in the stylesheet instead of a
 * measured pixel constant in here. */
type RowProps = {
  point: ChecklistPoint
  index: number
  cursor: MotionValue<number>
  active: boolean
  still: boolean
}

function ChecklistRow({ point, index, cursor, active, still }: RowProps) {
  /* Signed distance from the focused row: 0 when this row is the one in
   * focus, ±1 for its immediate neighbours. */
  const distance = useTransform(cursor, (value) => value - index)

  const opacity = useTransform(
    distance,
    [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3],
    [0, 0.13, 0.3, 0.62, 1, 0.62, 0.3, 0.13, 0],
  )

  /* Depth of field, exactly as the reference does it — sharpness is what marks
   * the active item, not size. Rows past the third neighbour are already at
   * zero opacity, so their blur is dropped to keep the filter count down. */
  const filter = useTransform(distance, (value) => {
    const away = Math.min(Math.abs(value), 3)
    if (away < 0.1) return 'none'
    if (away >= 2.9) return 'none'
    return `blur(${(away * 3.4).toFixed(2)}px)`
  })

  const noteOpacity = useTransform(
    distance,
    [-0.45, -0.16, 0, 0.16, 0.45],
    [0, 1, 1, 1, 0],
  )

  const words = point.title.split(' ')

  return (
    <motion.li
      className="checklist__row"
      data-active={active ? 'true' : 'false'}
      style={still ? undefined : { opacity, filter }}
    >
      <h3 className="checklist__rowTitle">
        {words.map((word, i) => (
          /* The space is deliberately a real text node between the masks, not
           * a margin: an inline-block with no whitespace around it would join
           * the words together in the accessible name. */
          <Fragment key={`${word}-${i}`}>
            {i > 0 ? ' ' : null}
            <span className="checklist__wordMask">
              <span
                className="checklist__word"
                style={{ animationDelay: `${i * 0.045}s` }}
              >
                {word}
              </span>
            </span>
          </Fragment>
        ))}
      </h3>
      <motion.p
        className="checklist__note"
        style={still ? undefined : { opacity: noteOpacity }}
      >
        {point.note}
      </motion.p>
    </motion.li>
  )
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/* Two-digit odometer. Each column is a full 0-9 reel translated to the digit it
 * should be showing, so 09 → 10 rolls both columns while 12 → 13 rolls only the
 * second, and the roll direction falls out of the arithmetic — climbing on the
 * way down the page, falling on the way back up.
 *
 * An earlier version swapped one glyph for another inside `AnimatePresence`.
 * It measured wrong: after 20 → 21 the entering digit sat permanently at its
 * initial state (opacity 0, translated a full row down) and the number read as
 * a single digit. A reel has no mount/unmount bookkeeping to get stuck on. */
function Odometer({ value }: { value: number }) {
  const digits = String(value).padStart(2, '0').split('')

  return (
    <span className="checklist__index" aria-hidden="true">
      {digits.map((digit, i) => (
        <span className="checklist__digit" key={i}>
          <motion.span
            className="checklist__reel"
            animate={{ y: `${Number(digit) * -10}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {DIGITS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function ChecklistMedia() {
  const [playing, setPlaying] = useState(false)
  const playable = checklistVideo.src !== ''

  if (playable && playing) {
    return (
      <div className="checklist__media">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className="checklist__video"
          src={checklistVideo.src}
          poster={checklistVideo.poster}
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
        src={checklistVideo.poster}
        alt={playable ? '' : checklistVideo.alt}
        loading="lazy"
        decoding="async"
      />
      <span className="checklist__play">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
        </svg>
        {checklistVideo.label}
      </span>
    </>
  )

  /* No film supplied yet, so the block is a figure rather than a dead button —
   * a control that cannot do anything is worse than no control. */
  return playable ? (
    <button
      type="button"
      className="checklist__media checklist__media--playable"
      onClick={() => setPlaying(true)}
    >
      {inner}
    </button>
  ) : (
    <figure className="checklist__media">{inner}</figure>
  )
}

/**
 * "Our 21-Point Checklist For A Perfect Hair System".
 *
 * A pinned dark stage carrying the studio film on the left and the checklist
 * on the right. Scrolling scrubs one point into focus at a time: the row in
 * focus is sharp and white, its neighbours grey and progressively blurred, and
 * the index at the right edge rolls over as the focus moves. Reduced-motion
 * users get the same content as a plain static list with no pin at all.
 */
export function Checklist() {
  const sectionRef = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const eased = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  })

  /* Progress becomes a cursor over the 21 points, with two shaping steps.
   *
   * A little dead air at each end keeps the first and last points on screen
   * rather than reachable only at the exact scroll extremes. Then each step is
   * given a plateau: roughly two thirds of the scroll between two points is
   * spent parked on one of them, and the travel happens quickly in the middle.
   * A straight linear cursor leaves the list resting half-way between two rows
   * at most scroll positions, which means nothing is ever properly in focus. */
  const cursor = useTransform(eased, (progress) => {
    const raw = Math.min(1, Math.max(0, (progress - 0.02) / 0.96)) * LAST
    const point = Math.floor(raw)
    const t = Math.min(1, Math.max(0, (raw - point - 0.32) / 0.36))
    const step = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2
    return Math.min(LAST, point + step)
  })

  useMotionValueEvent(cursor, 'change', (value) => {
    setActive(Math.min(LAST, Math.max(0, Math.round(value))))
  })

  return (
    <section
      className={`checklist${still ? ' checklist--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="checklist-title"
    >
      <div className="checklist__pin">
        <motion.div
          className="checklist__in wrap"
          style={still ? undefined : ({ '--cursor': cursor } as MotionStyle)}
        >
          <div className="checklist__aside">
            <h2 id="checklist-title" className="checklist__title">
              {checklistTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="checklist__lede">{checklistLede}</p>

            <ChecklistMedia />

            <div className="checklist__progress" aria-hidden="true">
              <span className="checklist__rail">
                <span className="checklist__railFill" />
              </span>
              <span className="checklist__tally">
                {String(active + 1).padStart(2, '0')} / {checklistPoints.length}
              </span>
            </div>
          </div>

          <div className="checklist__viewport">
            <ol className="checklist__track">
              {checklistPoints.map((point, i) => (
                <ChecklistRow
                  key={point.title}
                  point={point}
                  index={i}
                  cursor={cursor}
                  active={!still && i === active}
                  still={still}
                />
              ))}
            </ol>

            {still ? null : <Odometer value={active + 1} />}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
