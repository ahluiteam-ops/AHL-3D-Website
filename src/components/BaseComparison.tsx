import { Star } from 'lucide-react'
import {
  baseComparisonHeads,
  baseComparisonMax,
  baseComparisonRows,
  baseComparisonTitle,
} from '../site'

/**
 * A rating cell.
 *
 * **The stars are one labelled image, not five decorative ones.** A row of
 * shapes is the only thing carrying the score here, so the group takes
 * `role="img"` with the score written out and the individual stars are hidden
 * from the accessible tree — otherwise a screen reader announces nothing at all
 * for the cell, or five meaningless graphics.
 *
 * The design draws only the earned stars rather than five with some greyed out,
 * which is why the name states the denominator.
 *
 * No `size` prop: the stylesheet sizes these with a `clamp()` so they scale with
 * the viewport, and a `size` attribute would fight it at one end of the range.
 */
function Rating({ score }: { score: number }) {
  return (
    <span
      className="rateCompare__stars"
      role="img"
      aria-label={`${score} out of ${baseComparisonMax}`}
    >
      {Array.from({ length: score }, (_, i) => (
        <Star key={i} className="rateCompare__star" aria-hidden="true" />
      ))}
    </span>
  )
}

/**
 * "Thin Base Vs. Thick Base".
 *
 * Page 5, below the hero.
 *
 * The section's ground is a prop: the Stick-On page asked for white, the
 * Clip-On page for the `#f4f5f8` its neighbours carry. Both pages render this
 * one component, so a global change would move whichever page was not asking.
 *
 * **This is the `.compare` table page 3 uses**, with a `rateCompare` variant for
 * the cells: same card, same dark header row, same scroller and same responsive
 * behaviour. Only the cell contents differ — a rating out of five instead of a
 * sentence — so the two comparison sections stay one piece of table CSS rather
 * than two that drift apart.
 *
 * The two-line column heads are separate elements with a real trailing space:
 * without it "Thin Base +" and "Low Density" concatenate in the header's
 * accessible name, which is the run-on bug this codebase has now hit in eight
 * components.
 */
export type BaseComparisonProps = {
  /* Which ground the section sits on. `'white'` is the Stick-On page's, asked
     for explicitly; `'tint'` matches the `#f4f5f8` its neighbours use and is
     what the Clip-On page wants. A prop rather than a global change because
     both pages render this one component. */
  ground?: 'white' | 'tint'
}

export function BaseComparison({ ground = 'white' }: BaseComparisonProps = {}) {
  return (
    <section
      className="compare rateCompare"
      data-ground={ground}
      aria-labelledby="base-compare-title"
    >
      <div className="wrap">
        <div className="compare__header">
          <h2 className="compare__title" id="base-compare-title">
            {baseComparisonTitle}
          </h2>
        </div>

        <div className="compare__tableCard">
          <div className="compare__tableScroller">
            <table className="compare__table">
              <thead>
                <tr>
                  <th className="compare__th compare__thFeature" scope="col">
                    Feature
                  </th>
                  <th className="compare__th compare__thStick" scope="col">
                    {baseComparisonHeads.thin.map((line) => (
                      <span key={line}>{line} </span>
                    ))}
                  </th>
                  <th className="compare__th compare__thClip" scope="col">
                    {baseComparisonHeads.thick.map((line) => (
                      <span key={line}>{line} </span>
                    ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {baseComparisonRows.map((row) => (
                  <tr key={row.feature} className="compare__tr">
                    <td className="compare__td compare__tdFeature">
                      <strong>{row.feature}</strong>
                    </td>
                    <td className="compare__td compare__tdStick">
                      <Rating score={row.thin} />
                    </td>
                    <td className="compare__td compare__tdClip">
                      <Rating score={row.thick} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
