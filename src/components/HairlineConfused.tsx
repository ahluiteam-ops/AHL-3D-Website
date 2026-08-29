import { StillConfused } from './StillConfused'
import { hairlineConfusedData } from '../site'

/**
 * "We Understand This Is Not A Small Decision." — page 4's closing block.
 *
 * **This is `StillConfused`, with a different headline.** It was given an
 * optional `data` prop defaulting to the Stick-On or Clip-On page's own, so both
 * pages run the same dark stage, the same capsule, and the same word-by-word
 * illumination scrub — identical by construction rather than by imitation. Page
 * 2's bare `<StillConfused />` call site is untouched.
 *
 * `titleId` is passed because both headings would otherwise claim the same
 * `id`, and nothing guarantees the two sections never share a page.
 */
export function HairlineConfused() {
  return (
    <StillConfused
      data={hairlineConfusedData}
      titleId="hairline-confused-title"
    />
  )
}
