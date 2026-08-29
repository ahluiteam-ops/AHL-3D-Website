import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { useReveal } from '../hooks'
import { hairlineTruthPoints, hairlineTruthTitle } from '../site'

/** The copy marks its emphasis with `**`, the convention `choiceHeroLede` and
 *  `patchFailData` already use. */
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
 * "The Truth Behind Ultra Natural Hairline".
 *
 * Page 4, immediately above the benefits card: five short claims, each half
 * bold, in the 2-2-1 grid the design draws.
 *
 * **The heading reveals word by word out of a mask** — each word sits in an
 * `overflow: hidden` span and rises into it, so the line wipes upward rather
 * than fading. Driven by entry rather than by scroll: the section is a compact
 * band, and a scrub would need a tall pinned stage to be legible, which is more
 * scroll than five one-line claims are worth. The cards then stagger in behind
 * it.
 *
 * **The spaces between words are real text nodes**, not margins. Six components
 * in this codebase have shipped a split headline that announced as one run-on
 * word — the fix is either a real space, where the words are inline, or an
 * `aria-label`, where they sit in a flex row. These are inline-block, so a
 * space is the right one and no label is needed.
 *
 * `useReveal` already handles `prefers-reduced-motion`: everything renders in
 * place with no transform and no stagger.
 */
export type HairlineTruthProps = {
  /* Default to page 4's own content, so its bare call site needs no edit. The
     Clip-On page passes its own five claims. */
  titleId?: string
  title?: readonly string[]
  points?: readonly string[]
}

export function HairlineTruth({
  titleId = 'hairline-truth-title',
  title = hairlineTruthTitle,
  points = hairlineTruthPoints,
}: HairlineTruthProps = {}) {
  const { ref, shown } = useReveal<HTMLDivElement>()

  let wordIndex = 0

  return (
    <section className="truth" aria-labelledby={titleId}>
      <div className="wrap">
        <div
          className="truth__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="truth__title" id={titleId}>
            {title.map((line) => (
              <span className="truth__line" key={line}>
                {line.split(' ').map((word, i) => {
                  const delay = wordIndex++ * 0.055
                  return (
                    <Fragment key={`${word}-${i}`}>
                      {i > 0 ? ' ' : null}
                      <span className="truth__wordMask">
                        <span
                          className="truth__word"
                          style={{ transitionDelay: `${delay}s` }}
                        >
                          {word}
                        </span>
                      </span>
                    </Fragment>
                  )
                })}
                {/* Between the lines as well as between the words. The words
                    inside a line already carry real spaces, but the two line
                    blocks had none between them, so the heading announced as
                    "The Truth Behind UltraNatural Hairline". `.truth__line` is
                    a block, so this collapses visually. */}{' '}
              </span>
            ))}
          </h2>

          <ul className="truth__grid">
            {points.map((point, i) => (
              <li
                className="truth__item"
                key={point}
                /* The last claim is the odd one out and centres under the two
                   columns, exactly as the design draws it. */
                data-last={i === points.length - 1 ? 'true' : 'false'}
                style={{ transitionDelay: `${0.34 + i * 0.075}s` }}
              >
                <span className="truth__check" aria-hidden="true">
                  <Check size={13} strokeWidth={3.4} />
                </span>
                <p className="truth__copy">
                  <Emphasised text={point} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
