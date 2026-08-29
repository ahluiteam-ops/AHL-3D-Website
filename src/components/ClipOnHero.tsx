import { GuideHero } from './GuideHero'
import {
  clipOnHeroEyebrow,
  clipOnHeroLede,
  clipOnHeroMedia,
  clipOnHeroTitle,
} from '../site'

/**
 * Hero for the Clip-On Hair System page.
 *
 * Fifth wrapper around `GuideHero`. The eyebrow mark is the layers icon the
 * design draws, painted as a CSS mask so the brand blue comes through its
 * shape.
 */
export function ClipOnHero() {
  return (
    <GuideHero
      titleId="clip-on-system-title"
      eyebrow={clipOnHeroEyebrow}
      eyebrowIcon="/icons/layers.svg"
      title={clipOnHeroTitle}
      lede={clipOnHeroLede}
      media={clipOnHeroMedia}
      /* A photograph, not a video still — no play mark. */
      showPlay={false}
    />
  )
}
