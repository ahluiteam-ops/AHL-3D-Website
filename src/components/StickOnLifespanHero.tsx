import { GuideHero } from './GuideHero'
import {
  stickOnLifespanHeroEyebrow,
  stickOnLifespanHeroLede,
  stickOnLifespanHeroMedia,
  stickOnLifespanHeroTitle,
} from '../site'

/**
 * Hero for the "Stick-On System Lifespan" guide.
 *
 * Third wrapper around `GuideHero`, alongside `PatchSystemHero` and
 * `HairlineRealHero`. Only the content and the eyebrow mark differ.
 *
 * The mark is painted as a CSS mask, so the supplied file's own fill is
 * discarded and the brand blue is painted through its shape — the icon needed
 * no recolouring to arrive in the primary colour.
 *
 * The calendar is shared with the Clip-On Lifespan hero on purpose: the two
 * pages are a pair and both answer "how long does it last?". A tape mark was
 * tried here and moved to the Stick-On Hair System page, where it belongs.
 */
export function StickOnLifespanHero() {
  return (
    <GuideHero
      titleId="stick-on-lifespan-title"
      eyebrow={stickOnLifespanHeroEyebrow}
      eyebrowIcon="/icons/calendar.svg"
      title={stickOnLifespanHeroTitle}
      lede={stickOnLifespanHeroLede}
      media={stickOnLifespanHeroMedia}
    />
  )
}
