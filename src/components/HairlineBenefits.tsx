import { HairBenefits } from './HairBenefits'
import { hairlineBenefitsData } from '../site'

/**
 * "Benefits of a Natural Looking Hairline" — page 4's card and overlay.
 *
 * **This is `HairBenefits`, with different content.** Rather than clone a modal
 * — and with it the focus trap, the scroll lock, the Escape handling and the
 * scrim blur — `HairBenefits` was given an optional `data` prop defaulting to
 * Page 3's own, so both sections are the same component and Page 3's bare
 * `<HairBenefits />` call site is untouched.
 *
 * Two differences the component allows for: this variant has no philosophy
 * callout, so the CTA stands full width under the list, and its intro ends in a
 * link.
 */
export function HairlineBenefits() {
  return <HairBenefits data={hairlineBenefitsData} />
}
