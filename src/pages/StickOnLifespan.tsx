import { Nav } from '../components/Nav'
import { StickOnLifespanHero } from '../components/StickOnLifespanHero'
import { BalanceChoice } from '../components/BalanceChoice'
import { BaseOptions } from '../components/BaseOptions'
import { CarExample } from '../components/CarExample'
import { BaseComparison } from '../components/BaseComparison'
import { BaseChoice } from '../components/BaseChoice'
import { Systems } from '../components/Systems'
import { Form } from '../components/Form'
import { Footer } from '../components/Footer'
import { StoryReels } from '../components/StoryReels'
import { storyReels } from '../site'

/**
 * "Stick-On System Lifespan" — the guide page at `#/stick-on-lifespan`, under
 * "Confused? We'll Guide You".
 *
 * **The route was already in the nav before this page existed.** `site.ts` has
 * linked `#/stick-on-lifespan` since the navigation was written, so the path is
 * fixed by that link rather than chosen here — picking a different one would
 * have left the menu item pointing at nothing.
 *
 * `BalanceChoice` follows the hero and frames everything under it: three things
 * are on offer, no system delivers all of them, so the reader picks a side.
 * Option A carries two of the three and Option B the remaining one, which is
 * why its closing line reads "only 1 out of 2" — one option, not one quality.
 *
 * `BaseComparison` later quantifies the choice: the hero asks how long a
 * stick-on system lasts, and the table is the trade-off behind the answer — a
 * thin base wins on realism, comfort and look, and loses on system life. It is
 * the `.compare` table page 3 uses, with a variant for the rating cells.
 *
 * `CarExample` sits immediately before that table. It translates the same
 * trade-off into a familiar sports-car-versus-SUV analogy before the ratings
 * name it directly.
 *
 * `BaseOptions` sits immediately above `CarExample`: it introduces the two
 * actual base constructions first, then the car analogy explains their
 * realism-versus-lifespan trade-off in familiar terms.
 *
 * `BaseChoice` follows the trade-off table: the table shows the trade-off in
 * the abstract, this asks the reader which side of it they are on. Its
 * questions are a static bulleted self-assessment list, keeping the cards
 * informational rather than implying that an answer is submitted.
 *
 * `Systems` is the shared circular gallery used on the homepage and other guide
 * pages, reused unchanged, keeping the product range and its
 * responsive/reduced-motion fallbacks consistent across the site. It now sits
 * after the trade-off table rather than directly after the hero: once the
 * reader has seen what base thickness costs, the range is what those choices
 * are made from.
 *
 * `Form` is the homepage's own component, reused unchanged — it is
 * self-contained and takes no props. It closes the page above the footer, the
 * same job it does on the homepage.
 *
 * More sections follow as their designs arrive.
 */
export function StickOnLifespan() {
  return (
    <>
      <Nav />
      <main>
        <StickOnLifespanHero />
        <BalanceChoice />
        <BaseOptions />
        <CarExample />
        <BaseComparison />
        <BaseChoice />
        <Systems />
        <Form />
        <StoryReels set={storyReels.stickOnLifespan} ground="tint" />
      </main>
      <Footer />
    </>
  )
}
