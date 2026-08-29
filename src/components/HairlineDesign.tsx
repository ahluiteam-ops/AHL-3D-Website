import { Checklist } from './Checklist'
import {
  hairlineDesignLede,
  hairlineDesignPoints,
  hairlineDesignTitle,
  hairlineDesignVideo,
} from '../site'

/**
 * "How We Design The World's Most Natural Hairline".
 *
 * **This is `Checklist`, with different content.** It was first built as its
 * own light-themed card to match a supplied design, then asked to look like the
 * homepage's 21-point checklist instead — at which point it was no longer a
 * section that borrowed the checklist's mechanism, it was the checklist. Rather
 * than restyle two hundred lines of CSS to converge on `.checklist`, `Checklist`
 * was given optional props defaulting to the homepage's own data, so both
 * sections are literally the same component and the many bare `<Checklist />`
 * call sites carry on unchanged.
 *
 * Seven points instead of twenty-one. The progress rail divides by
 * `--checklist-count`, which `Checklist` now sets from `points.length` rather
 * than leaving at the 21 the stylesheet defaults to.
 */
export function HairlineDesign() {
  return (
    <Checklist
      titleId="hairline-design-title"
      title={hairlineDesignTitle}
      lede={hairlineDesignLede}
      points={hairlineDesignPoints}
      video={hairlineDesignVideo}
    />
  )
}
