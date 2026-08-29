import { comparisonTitle, comparisonRows } from '../site'

/**
 * "Clip-On Vs. Stick-On Hair Systems"
 *
 * Clean, uncluttered comparison table matching the client's reference visual.
 * Features:
 * - Centered bold headline: "Clip-On Vs. Stick-On / Hair Systems"
 * - Crisp card with black header and clean white data rows
 * - Centered cell alignment and subtle column/row dividing lines
 * - Mobile keeps the three-column table compact without horizontal scrolling
 */
export type ComparisonProps = {
  /* The Stick-On or Clip-On page names it "Clip-On Vs. Stick-On"; the Clip-On
     Hair System page's design names it the other way round. The columns are
     Stick-On then Clip-On in both, so only the heading differs. */
  title?: readonly string[]
}

export function Comparison({ title = comparisonTitle }: ComparisonProps = {}) {
  return (
    <section className="compare" aria-labelledby="compare-title">
      <div className="wrap">
        <div className="compare__header">
          <h2 className="compare__title" id="compare-title">
            {/* Real trailing space below. These spans are blocks so it
                collapses visually, but without it the heading announced as
                "Stick-On Vs. Clip-OnHair Systems". */}
            {title.map((line) => (
              <span className="compare__titleLine" key={line}>
                {line}{' '}
              </span>
            ))}
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
                    Stick-On System
                  </th>
                  <th className="compare__th compare__thClip" scope="col">
                    Clip-On System
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="compare__tr">
                    <td
                      className="compare__td compare__tdFeature"
                      data-label="Feature"
                    >
                      <strong>{row.feature}</strong>
                    </td>
                    <td
                      className="compare__td compare__tdStick"
                      data-label="Stick-On"
                    >
                      <span className="compare__valPrimary">{row.stickOn.primary}</span>
                      {row.stickOn.sub && (
                        <span className="compare__valSub">{row.stickOn.sub}</span>
                      )}
                    </td>
                    <td
                      className="compare__td compare__tdClip"
                      data-label="Clip-On"
                    >
                      <span className="compare__valPrimary">{row.clipOn.primary}</span>
                      {row.clipOn.sub && (
                        <span className="compare__valSub">{row.clipOn.sub}</span>
                      )}
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
