import { Nav } from '../components/Nav'
import { ClipOnHero } from '../components/ClipOnHero'
import { ClipFears } from '../components/ClipFears'
import { ClipPillars } from '../components/ClipPillars'
import { ClipPerfectFor } from '../components/ClipPerfectFor'
import { Checklist } from '../components/Checklist'
import { Achievements } from '../components/Achievements'
import { Backed } from '../components/Backed'
import { HairlineTruth } from '../components/HairlineTruth'
import { ClipZyconRange } from '../components/ClipZyconRange'
import { Comparison } from '../components/Comparison'
import { ClientStories } from '../components/ClientStories'
import { Faq } from '../components/Faq'
import { ClipZyconCta } from '../components/ClipZyconCta'
import { ClipLearnStickOn } from '../components/ClipLearnStickOn'
import { Footer } from '../components/Footer'
import { clipComparisonTitle, clipOnFaqGroup, clipWhyPoints, clipWhyTitle, storyReels } from '../site'
import { StoryReels } from '../components/StoryReels'

/**
 * "Clip-On Hair System" — the product page at `#/clip-on-hair-system`.
 *
 * Distinct from `#/clip-on-lifespan`, which answers how long one lasts. This
 * page argues the case for the method itself, and runs objection first:
 * `ClipFears` states what men are afraid of, `ClipPillars` answers those three
 * fears in the same order — invisible, safe, secure — and `ClipPerfectFor` then
 * says who it suits.
 *
 * **Most of this page is shared components.** `Checklist`, `Achievements`,
 * `Backed`, `ClientStories` and `Faq` are rendered bare; `HairlineTruth` and
 * `Comparison` take their content as props, which they gained here rather than
 * being copied. Seven sections are its own, including the Zycon teaser/dialog.
 *
 * `Comparison` already held exactly this table — the same five rows, Stick-On
 * column first. Only its heading differs between the two pages that use it, so
 * only the heading is passed.
 *
 * All supplied photography is installed. `Photo` remains the common image
 * wrapper so a missing or renamed file degrades to a labelled frame rather
 * than a broken-image glyph. The nav points directly to this route.
 */
export function ClipOnHairSystem() {
  return (
    <>
      <Nav />
      <main className="clipSystemPage">
        <ClipOnHero />
        <ClipFears />
        <ClipPillars />
        <ClipPerfectFor />
        <Checklist />
        <Achievements />
        <Backed />
        <HairlineTruth
          titleId="clip-why-title"
          title={clipWhyTitle}
          points={clipWhyPoints}
        />
        <ClipZyconRange />
        <Comparison title={clipComparisonTitle} />
        <ClientStories />
        <Faq groups={[clipOnFaqGroup]} />
        <ClipZyconCta />
        <StoryReels set={storyReels.clipOn} />
        <ClipLearnStickOn />
      </main>
      <Footer />
    </>
  )
}
