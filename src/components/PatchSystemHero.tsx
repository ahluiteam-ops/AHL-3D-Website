import { GuideHero } from './GuideHero'
import {
  patchSystemHeroEyebrow,
  patchSystemHeroLede,
  patchSystemHeroMedia,
  patchSystemHeroTitle,
} from '../site'

/**
 * Hero for the Hair Patch vs Hair System guide.
 *
 * The markup and motion live in `GuideHero`, shared with the "Will My Hairline
 * Look Real?" guide — both pages open identically, so they are one component
 * rather than two near-copies. This wrapper exists only to bind the page's
 * content to it, which keeps `HairPatchVsSystem.tsx` reading as a list of
 * sections rather than a list of props.
 */
export function PatchSystemHero() {
  return (
    <GuideHero
      titleId="patch-system-title"
      eyebrow={patchSystemHeroEyebrow}
      eyebrowIcon="/icons/burst.svg"
      title={patchSystemHeroTitle}
      lede={patchSystemHeroLede}
      media={{ ...patchSystemHeroMedia, width: 2240, height: 1260 }}
    />
  )
}
