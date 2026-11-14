import { Nav } from '../components/Nav'
import { HairlineRealHero } from '../components/HairlineRealHero'
import { Systems } from '../components/Systems'
import { HairlineDesign } from '../components/HairlineDesign'
import { ClientStories } from '../components/ClientStories'
import { HairlineTruth } from '../components/HairlineTruth'
import { HairlineBenefits } from '../components/HairlineBenefits'
import { HairlineConfused } from '../components/HairlineConfused'
import { HdExposed } from '../components/HdExposed'
import { NaturalFront } from '../components/NaturalFront'
import { BrushBackFlow } from '../components/BrushBackFlow'
import { Footer } from '../components/Footer'
import { FounderBooking } from '../components/FounderBooking'
import { StoryReels } from '../components/StoryReels'
import { storyReels } from '../site'

/**
 * "Will My Hairline Look Real?" — the guide page at
 * `#/will-my-hairline-look-real`, under "Confused? We'll Guide You".
 *
 * `Systems` is the Stick-On or Clip-On page's own component, reused unchanged —
 * it is self-contained and takes no props. It follows the hero because the hero
 * claims the hairline is undetectable and the range is the evidence: thirteen
 * systems the claim has to hold across.
 *
 * `HairlineDesign` follows the range: once the reader has seen thirteen
 * systems, the question is how any of them passes for real, and that section is
 * the answer. It uses `Checklist`'s pinned-scrub mechanism, mirrored and
 * lightened to its own design.
 *
 * `ClientStories` is the homepage's own component, reused unchanged — it is
 * self-contained and takes no props. It closes the argument the page has been
 * making: the hero claims the hairline is undetectable, `Systems` shows the
 * range, `HairlineDesign` shows the craft, and this shows men it actually
 * worked for. Page 3 orders its equivalent run the same way.
 *
 * `HairlineTruth` sits directly above the benefits card: five short claims that
 * state the position, then the card that expands on it.
 *
 * `HairlineBenefits` is `HairBenefits` with page-4 content — the same card and
 * overlay component Page 3 uses, so the dialog contract is identical by
 * construction rather than by imitation.
 *
 * `HairlineConfused` closes the page: it is `StillConfused` from the Stick-On or
 * Clip-On page with its own headline, so the dark scrub stage above the footer
 * reads the same on both guides.
 *
 * `BrushBackFlow` and `HdExposed` are a pair. By request the tree comes first
 * and the detail cards follow it: the reader decides whether a brush-back is
 * open to them, then reads what living with one involves.
 *
 * `BrushBackFlow` follows the closing scrub: a reader who is still weighing it
 * up gets a decision tree to answer the one question the page has not, which is
 * whether their own front hair is enough.
 *
 * `NaturalFront` closes the page above the footer. It is the companion to
 * `BrushBackFlow` — the tree answers yes or no, this grades the middle ground
 * into three density scenarios — and it uses the homepage `Story` section's
 * scroll-built card stack, shared via `ScrollStack`.
 *
 * More sections may still be to come. The "Free eBook" section in the supplied
 * design is deliberately excluded by request.
 */
export function WillMyHairlineLookReal() {
  return (
    <>
      <Nav />
      <main>
        <HairlineRealHero />
        <Systems />
        <HairlineDesign />
        <ClientStories />
        <HairlineTruth />
        <HairlineBenefits />
        <FounderBooking />
        <HairlineConfused />
        <StoryReels set={storyReels.hairline} />
        <BrushBackFlow />
        <HdExposed />
        <NaturalFront />
      </main>
      <Footer />
    </>
  )
}
