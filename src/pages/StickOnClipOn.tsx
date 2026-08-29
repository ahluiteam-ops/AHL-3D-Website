import { Nav } from '../components/Nav'
import { ChoiceHero } from '../components/ChoiceHero'
import { WhichOption } from '../components/WhichOption'
import { Comparison } from '../components/Comparison'
import { TwoMethods } from '../components/TwoMethods'
import { Transformations } from '../components/Transformations'
import { Systems } from '../components/Systems'
import { StillConfused } from '../components/StillConfused'
import { Footer } from '../components/Footer'

/**
 * "Stick-On or Clip-On" — the second page of the site, reached at
 * `#/stick-on-or-clip-on`. It sits under "Confused? We'll Guide You" in the
 * client's own navigation.
 */
export function StickOnClipOn() {
  return (
    <>
      <Nav />
      <main>
        <ChoiceHero />
        <WhichOption />
        <Systems />
        <Comparison />
        <TwoMethods />
        <Transformations />
        <StillConfused />
      </main>
      <Footer />
    </>
  )
}
