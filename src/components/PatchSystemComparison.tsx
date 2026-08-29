import { patchSystemComparisonRows, patchSystemComparisonTitle } from '../site'

/** Responsive comparison table for page 3, sharing page 2 table language. */
export function PatchSystemComparison() {
  return (
    <section className="compare patchCompare" aria-labelledby="patch-compare-title">
      <div className="wrap">
        <div className="compare__header">
          <h2 className="compare__title" id="patch-compare-title">
            {patchSystemComparisonTitle}
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
                    Hair Patch
                  </th>
                  <th className="compare__th compare__thClip" scope="col">
                    Hair System
                  </th>
                </tr>
              </thead>
              <tbody>
                {patchSystemComparisonRows.map((row) => (
                  <tr key={row.feature} className="compare__tr">
                    <td className="compare__td compare__tdFeature">
                      <strong>{row.feature}</strong>
                    </td>
                    <td className="compare__td compare__tdStick">{row.patch}</td>
                    <td className="compare__td compare__tdClip">{row.system}</td>
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
