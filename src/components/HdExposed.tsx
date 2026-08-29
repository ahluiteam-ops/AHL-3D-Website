import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Info, X } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { hdExposedCards, hdExposedTitle } from '../site'

/** `**` marks the bold, as everywhere else on this page. */
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
 * "HD Exposed Hairline — Brush Back Hairstyle".
 *
 * Four cards on a rail, immediately before the brush-back decision tree: this
 * describes the style, the tree then asks whether the reader qualifies for it.
 *
 * **The rail is a native scrolling element, not a transform carousel.** That is
 * the whole design of this component. `overflow-x: auto` with `scroll-snap`
 * gives touch momentum, trackpad gestures, a real scrollbar, keyboard arrow
 * scrolling and the browser's own overscroll behaviour — none of which a
 * `translateX` carousel gets without reimplementing them, usually badly. The
 * buttons are a convenience on top: they call `scrollBy`, and the rail is fully
 * usable if they are never touched.
 *
 * What that costs is bookkeeping, and it is worth being explicit about it:
 *
 * - **The scrollable region takes `tabindex="0"` and a label.** Browsers only
 *   make an overflow container keyboard-scrollable automatically when it has no
 *   focusable children — relying on that is fragile, and a keyboard user who
 *   cannot reach the rail cannot read cards two through four.
 * - **The buttons disable at the ends**, computed from real scroll position
 *   rather than from an index, because a touch drag moves the rail without the
 *   buttons knowing.
 * - **A polite live region announces the position**, since scrolling a rail
 *   gives a screen-reader user no other signal that the content changed.
 *
 * **Above 900px it is not a rail at all.** Four cards on one row left most of
 * the section empty to the right, so the stylesheet turns it into a three-column
 * grid with the fourth card spanning the full width underneath. The component
 * does not need to know: it reads overflow from the element, finds none, and
 * drops the controls and the tab stop on its own.
 *
 * The controls hide themselves when the rail does not overflow — and so does
 * the rail's own focusability, since a focus stop that scrolls nothing is worse
 * than none.
 *
 * Keyboard note: arrow keys scroll a focused horizontal container, `Home` and
 * `End` do not. That is browser behaviour, not a gap here — a check that tests
 * `Home` will wrongly report the rail as unreachable.
 *
 * Under `prefers-reduced-motion` the button scroll is instant rather than
 * smooth, and the entrance renders in place.
 */
export function HdExposed() {
  const railRef = useRef<HTMLUListElement>(null)
  const still = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [scrollable, setScrollable] = useState(true)
  const [current, setCurrent] = useState(1)

  let wordIndex = 0

  /* Read from the element rather than tracking an index: a touch drag or a
     trackpad swipe moves the rail without going through the buttons. */
  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    /* 8px, not 1: the rail carries padding and `scroll-snap-align: start`
       settles a few pixels in, which left Prev live while the reader was still
       looking at the first card. */
    const edge = 8
    setAtStart(rail.scrollLeft <= edge)
    setAtEnd(rail.scrollLeft >= max - edge)
    /* On a wide screen all four cards fit and there is nothing to page
       through. Two permanently disabled buttons look broken; no buttons is the
       honest state, and the rail is still there if the viewport narrows. */
    setScrollable(max > 2)

    const card = rail.querySelector<HTMLElement>('.hd__card')
    if (!card) return
    const step = card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || '0')
    setCurrent(Math.min(hdExposedCards.length, Math.round(rail.scrollLeft / step) + 1))
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    sync()
    rail.addEventListener('scroll', sync, { passive: true })
    /* The card width is a clamp, so the end position moves with the viewport. */
    const observer = new ResizeObserver(sync)
    observer.observe(rail)
    return () => {
      rail.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  const page = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>('.hd__card')
    if (!card) return
    const step = card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || '0')
    rail.scrollBy({
      left: step * direction,
      behavior: still ? 'auto' : 'smooth',
    })
  }

  return (
    <section className="hd" aria-labelledby="hd-exposed-title">
      <div className="wrap">
        <div className="hd__in" ref={ref} data-shown={shown ? 'true' : 'false'}>
          {/* Wipes word by word out of a mask, the same idiom `HairlineTruth`
              and `BrushBackFlow` use on this page — it was the one section head
              here that simply appeared.

              Spaces are real text nodes, between the words and between the two
              lines: these are inline-block, so without them the heading
              announces as one run-on word. */}
          <h2 className="hd__title" id="hd-exposed-title">
            {hdExposedTitle.map((line) => (
              <span className="hd__titleLine" key={line}>
                {line.split(' ').map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    {i > 0 ? ' ' : null}
                    <span className="hd__wordMask">
                      <span
                        className="hd__word"
                        style={{ transitionDelay: `${wordIndex++ * 0.05}s` }}
                      >
                        {word}
                      </span>
                    </span>
                  </Fragment>
                ))}{' '}
              </span>
            ))}
          </h2>

          {/* Focusable and labelled only while it actually scrolls. Above
              900px this is a plain grid, and a `tabindex="0"` there is a tab
              stop that does nothing — which is worse than no tab stop. */}
          <ul
            className="hd__rail"
            ref={railRef}
            {...(scrollable
              ? {
                  tabIndex: 0,
                  role: 'group',
                  'aria-label': 'Brush-back hairstyle details, scrollable',
                }
              : {})}
          >
            {hdExposedCards.map((card, i) => (
              <li
                className="hd__card"
                key={card.title}
                data-tone={card.tone}
                style={{ transitionDelay: `${i * 0.09}s` }}
              >
                <h3 className="hd__cardTitle">{card.title}</h3>
                <ul className="hd__points">
                  {card.points.map((point) => (
                    <li className="hd__point" key={point}>
                      {/* Three glyphs, not one in three colours: a reader who
                          cannot separate the hues still gets tick / info /
                          cross, and each card's heading states its tone
                          besides. */}
                      <span className="hd__mark" aria-hidden="true">
                        {card.tone === 'yes' ? (
                          <Check size={11} strokeWidth={3.6} />
                        ) : card.tone === 'care' ? (
                          <Info size={11} strokeWidth={3.2} />
                        ) : (
                          <X size={11} strokeWidth={3.6} />
                        )}
                      </span>
                      <p className="hd__pointText">
                        <Emphasised text={point} />
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="hd__controls" hidden={!scrollable}>
            <p className="sr-only" aria-live="polite">
              Card {current} of {hdExposedCards.length}
            </p>
            <button
              type="button"
              className="hd__btn"
              onClick={() => page(-1)}
              disabled={atStart}
            >
              <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
              <span className="sr-only">Previous card</span>
            </button>
            <button
              type="button"
              className="hd__btn hd__btn--next"
              onClick={() => page(1)}
              disabled={atEnd}
            >
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              <span className="sr-only">Next card</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
