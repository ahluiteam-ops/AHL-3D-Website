import { Nav } from '../components/Nav'
import { ClipOnLifespanHero } from '../components/ClipOnLifespanHero'
import { BaseComparison } from '../components/BaseComparison'
import { BaseOptions } from '../components/BaseOptions'
import { BaseChoice } from '../components/BaseChoice'
import { Systems } from '../components/Systems'
import { Form } from '../components/Form'
import { Footer } from '../components/Footer'
import {
  clipOnBaseChoiceOptions,
  clipOnBaseOptions,
  clipOnBaseOptionsTitle,
} from '../site'

/**
 * "Clip-On System Lifespan" — the guide page at `#/clip-on-lifespan`, the
 * fourth entry under "Confused? We'll Guide You" and the sibling of the
 * Stick-On page.
 *
 * **Almost all of this page is the Stick-On page's own components.**
 * `BaseComparison` and `BaseChoice` carry identical content on both pages, so
 * they are rendered bare; `BaseOptions` is the same component with clip-on copy
 * passed in. Only the hero is a new file, and that is a wrapper around
 * `GuideHero`. Nothing here was copied.
 *
 * The Stick-On page's `BalanceChoice` and `CarExample` are deliberately absent —
 * they are not in this page's designs.
 *
 * ⚠ **No photography yet.** Every image on this page points at a file that has
 * not been supplied, and `Photo` renders a labelled frame naming each one.
 * Dropping the files in at the declared paths is the only step needed.
 */
export function ClipOnLifespan() {
  return (
    <>
      <Nav />
      <main>
        <ClipOnLifespanHero />
        {/* Tinted, not white: on this page the table sits in a run of
            `#f4f5f8` sections and a white band broke it. The Stick-On page
            keeps white, which is what it asked for. */}
        <BaseComparison ground="tint" />
        <BaseOptions
          title={clipOnBaseOptionsTitle}
          options={clipOnBaseOptions}
        />
        {/* Its own questions, not the shared set: two of them state lifespans
            and the clip-on numbers differ from the stick-on ones. */}
        <BaseChoice options={clipOnBaseChoiceOptions} />
        <Systems />
        <Form />
      </main>
      <Footer />
    </>
  )
}
