import { useCallback, useEffect, useRef, useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { backedFoot, backedProof, backedTitle } from '../site'

/** 4.9 is four whole stars and a half, not five. Rounding a rating up is the
 *  one thing a rating must not do, so the glyphs are derived from the number
 *  rather than handed over as a count. */
function Stars({ rating, lit }: { rating: number; lit: number }) {
  const whole = Math.floor(rating)
  const half = rating - whole >= 0.25
  const glyphs = whole + (half ? 1 : 0)

  return (
    <span className="backed__stars" aria-hidden="true">
      {Array.from({ length: glyphs }, (_, i) => {
        const Glyph = i < whole ? Star : StarHalf
        return (
          <Glyph
            key={i}
            size={17}
            strokeWidth={0}
            fill="currentColor"
            data-lit={i < lit ? 'true' : 'false'}
          />
        )
      })}
    </span>
  )
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Counts to the figure once the panel is on screen.
 *
 * A trust band's whole job is the number, so the number is what moves. It runs
 * on `requestAnimationFrame` rather than a transition because the thing being
 * animated is the text itself, not a style. Anyone who asked for reduced
 * motion is handed the final value immediately — the point is the figure, and
 * they still get it.
 */
function useCount(target: number, run: boolean, ms = 1100) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    if (!run) return

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setValue(target * easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, run, ms, reduced])

  return value
}

function ProofCard({
  item,
  run,
}: {
  item: (typeof backedProof)[number]
  run: boolean
}) {
  const count = useCount(item.count, run)
  const cardRef = useRef<HTMLLIElement>(null)

  /* The light already falling across the panel, made to follow the pointer.
     Written as custom properties so the card's own transform stays free —
     the same split `useTilt` makes elsewhere. */
  const onMove = useCallback((e: React.PointerEvent<HTMLLIElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])

  const onLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '0%')
  }, [])

  const shown = item.decimals ? count.toFixed(item.decimals) : Math.round(count)

  return (
    <li
      className="backed__card"
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="backed__spot" aria-hidden="true" />

      <div className="backed__top">
        <img
          className="backed__icon"
          src={item.icon}
          alt={item.alt}
          width={168}
          height={168}
          loading="lazy"
        />
        <span className="backed__note">{item.note}</span>
      </div>

      <p className="backed__value">
        {/* The animated figure is hidden from screen readers and the settled
            one is read instead, so nobody is announced a number mid-count. */}
        <span aria-hidden="true">
          {shown}
          {item.suffix ?? ''}
        </span>
        <span className="sr-only">{item.value}</span>
        {item.unit ? <span className="backed__unit">{item.unit}</span> : null}
        {item.stars ? (
          <Stars
            rating={item.stars}
            lit={Math.ceil((count / item.count) * Math.ceil(item.stars))}
          />
        ) : null}
      </p>

      <p className="backed__label">{item.label}</p>
    </li>
  )
}

/**
 * "Backed By Thousands Of Confident Men".
 *
 * The client's artwork is a dark rounded panel carrying two proof cards. The
 * treatment is the FAQ's, because both were built to the same reference image:
 * a dark ground with a light falling across it and translucent glass cards on
 * top. Unlike the FAQ this is a contained panel, which is what the artwork
 * shows.
 *
 * Rebuilt after review. The first version stretched two short cards across the
 * full container, which at 1440px made each one a 790×110 letterbox with its
 * qualifier — "300+ reviews" — stranded 450px from the figure it qualifies.
 * Three things fixed that: the content is capped at 900px so the cards stop
 * spanning the panel; each card is now stacked rather than a single row, with
 * the figure as the largest thing on it; and the qualifier moved up beside the
 * icon, where it reads as metadata about the figure rather than as an
 * unrelated fragment.
 *
 * It is also no longer inert. The figures count up when the panel arrives, the
 * stars light in sequence behind them, and a soft spotlight follows the
 * pointer across each card. All three are dropped for reduced motion, where
 * the settled values are simply present.
 *
 * The artwork's "HAPPY CLIENTS" pill above the heading is not here. §3's
 * visual system removed eyebrow tags site-wide in favour of one heading per
 * section, the same call made in the Pillars section.
 */
export function Backed() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="backed" aria-labelledby="backed-title">
      <div className="wrap">
        <div
          className="backed__panel"
          data-shown={shown ? 'true' : 'false'}
          ref={ref}
        >
          <div className="backed__in">
            <h2 className="backed__title" id="backed-title">
              {backedTitle}
            </h2>

            <ul className="backed__proof">
              {backedProof.map((item) => (
                <ProofCard key={item.label} item={item} run={shown} />
              ))}
            </ul>

            <p className="backed__foot">{backedFoot}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
