import { Check } from 'lucide-react'
import { StackRow, useScrollStack } from './ScrollStack'
import { useReveal } from '../hooks'
import { naturalFrontCards, naturalFrontTitle } from '../site'

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
 * "If You Want To Use Your Natural Hair In The Front…"
 *
 * The last section before the footer, and a companion to `BrushBackFlow`: the
 * tree answers yes or no, this grades the middle ground into three density
 * scenarios.
 *
 * **Same mechanism as `Story` on the homepage**, which is what was asked for —
 * the heading holds still on the left while the cards stack in on the right one
 * at a time, each preceded by a narrower slab of itself peeking from under the
 * card above. That lives in `ScrollStack`, extracted from `Story` when this
 * section needed it, so the move exists once rather than twice.
 *
 * Three rows here against `Story`'s six, which is the only thing that changes
 * in the timing: the ramps divide by `last`, so a shorter stack simply spends
 * longer on each card.
 *
 * The A/B/C labels are part of each heading's text rather than a CSS counter —
 * the copy refers to them by letter, so they have to survive into the
 * accessible name.
 */
export function NaturalFront() {
  const { sectionRef, still, progress, last } = useScrollStack(
    naturalFrontCards.length,
  )
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()

  return (
    <section
      className={`nfront${still ? ' nfront--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="natural-front-title"
    >
      <div className="nfront__pin">
        <div
          className="nfront__in wrap"
          ref={revealRef}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="nfront__title" id="natural-front-title">
            {naturalFrontTitle.map((line) => (
              /* Real trailing space: these are blocks, so it collapses
                 visually, but without it the three lines run together in the
                 accessible name. */
              <span key={line}>{line} </span>
            ))}
          </h2>

          <ol className="nfront__rows">
            {naturalFrontCards.map((card, i) => (
              <StackRow
                key={card.label}
                index={i}
                last={last}
                progress={progress}
                still={still}
                className="nfront__row"
                innerClassName="nfront__rowIn"
              >
                <h3 className="nfront__cardTitle">
                  <span className="nfront__label">{card.label}</span>{' '}
                  {card.title}
                </h3>
                <ul className="nfront__points">
                  {card.points.map((point) => (
                    <li className="nfront__point" key={point}>
                      <span className="nfront__mark" aria-hidden="true">
                        <Check size={11} strokeWidth={3.6} />
                      </span>
                      <p className="nfront__pointText">
                        <Emphasised text={point} />
                      </p>
                    </li>
                  ))}
                </ul>
              </StackRow>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
