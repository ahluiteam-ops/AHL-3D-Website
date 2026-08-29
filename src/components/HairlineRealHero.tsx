import { GuideHero } from './GuideHero'
import {
  hairlineRealHeroEyebrow,
  hairlineRealHeroLede,
  hairlineRealHeroMedia,
  hairlineRealHeroTitle,
} from '../site'

/**
 * Hero for the "Will My Hairline Look Real?" guide.
 *
 * Same component as the Hair Patch vs Hair System hero; only the content and
 * the eyebrow mark differ. The mark is applied as a CSS mask, so the supplied
 * file's black fill is discarded and the brand blue is painted through its
 * shape — no recolouring of the asset was needed.
 */
export function HairlineRealHero() {
  return (
    <GuideHero
      titleId="hairline-real-title"
      eyebrow={hairlineRealHeroEyebrow}
      eyebrowIcon="/icons/hair-skin.svg"
      title={hairlineRealHeroTitle}
      lede={hairlineRealHeroLede}
      media={hairlineRealHeroMedia}
    />
  )
}
