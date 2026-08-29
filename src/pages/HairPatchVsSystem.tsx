import { Nav } from '../components/Nav'
import { PatchSystemHero } from '../components/PatchSystemHero'
import { PatchSystemComparison } from '../components/PatchSystemComparison'
import { HairBenefits } from '../components/HairBenefits'
import { Checklist } from '../components/Checklist'
import { ClientStories } from '../components/ClientStories'
import { SimplestWay } from '../components/SimplestWay'
import { PatchFail } from '../components/PatchFail'
import { BookConsultation } from '../components/BookConsultation'
import { Footer } from '../components/Footer'

/**
 * "Hair Patch vs Hair System" — the guide page at
 * `#/hair-patch-vs-hair-system`, under "Confused? We'll Guide You".
 *
 * The order is an argument: draw the distinction, show what choosing the system
 * buys, evidence how it is built, show men it worked for, resolve the confusion,
 * then close. `ClientStories` and `Checklist` are the homepage's own components,
 * reused unchanged — both are self-contained and take no props.
 *
 * `ClientStories` sits immediately before `SimplestWay` on purpose. SimplestWay
 * is the "Still confused?" analogy panel, so the proof lands just before the
 * explanation resolves. Page 2 orders its equivalent pair the same way.
 *
 * **`PatchFail` sits late, by request, and that is worth knowing.** It was built
 * to sit directly before `HairBenefits` — problem stated, then answered, which
 * is the order both the page's own logic and the landing-page research want.
 * Placed here instead it is a closing argument rather than a setup: the reader
 * meets the case against patches after they have already seen what a system
 * does. That reads as reinforcement before the ask rather than as the problem
 * the page is solving. If it is ever moved back, it belongs immediately above
 * `HairBenefits`.
 *
 * `BookConsultation` closes the page: once the distinction is drawn, evidenced
 * and resolved, the only thing left is to book.
 */
export function HairPatchVsSystem() {
  return (
    <>
      <Nav />
      <main>
        <PatchSystemHero />
        <PatchSystemComparison />
        <HairBenefits />
        <Checklist />
        <ClientStories />
        <SimplestWay />
        <PatchFail />
        <BookConsultation />
      </main>
      <Footer />
    </>
  )
}
