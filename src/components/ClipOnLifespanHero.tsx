import { GuideHero } from './GuideHero'
import {
  clipOnLifespanHeroEyebrow,
  clipOnLifespanHeroLede,
  clipOnLifespanHeroMedia,
  clipOnLifespanHeroTitle,
} from '../site'

/**
 * Hero for the "Clip-On System Lifespan" guide.
 *
 * Fourth wrapper around `GuideHero`, alongside `PatchSystemHero`,
 * `HairlineRealHero` and `StickOnLifespanHero`. Content only.
 *
 * It shares the Stick-On page's calendar mark: the two pages are a pair and the
 * eyebrow reads "Stick-On System Lifespan" / "Clip-On System Lifespan", so the
 * same mark is the point rather than an oversight. The mark is painted as a CSS
 * mask, so the brand blue comes through the icon's shape.
 *
 * The poster has not been supplied yet; `GuideHero` renders it through `Photo`,
 * which falls back to a labelled frame naming the file it expects.
 */
export function ClipOnLifespanHero() {
  return (
    <GuideHero
      titleId="clip-on-lifespan-title"
      eyebrow={clipOnLifespanHeroEyebrow}
      eyebrowIcon="/icons/calendar.svg"
      title={clipOnLifespanHeroTitle}
      lede={clipOnLifespanHeroLede}
      media={clipOnLifespanHeroMedia}
    />
  )
}
