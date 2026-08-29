import { ArrowUpRight } from 'lucide-react'
import { useReveal } from '../hooks'
import { patchFailData } from '../site'

/** The client's copy marks its emphasis with `**`, the same convention
 *  `ChoiceHero` reads, so the bold survives in `site.ts` as readable text. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  )
}

/**
 * The warning diamond.
 *
 * Drawn rather than taken from lucide because the mark in the design is a
 * rotated rounded square, and lucide's alert icons are triangles and octagons —
 * close is worse than correct for something this prominent. The exclamation is
 * two shapes inside the same viewBox rather than a counter-rotated child, which
 * keeps it from drifting when the diamond scales.
 */
function WarningDiamond() {
  return (
    <svg
      className="patchFail__mark"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="11"
        transform="rotate(45 32 32)"
        fill="currentColor"
      />
      <rect x="29.2" y="19" width="5.6" height="17" rx="2.8" fill="#fff" />
      <circle cx="32" cy="42.5" r="3.2" fill="#fff" />
    </svg>
  )
}

/**
 * "Why Hair Patches Often Fail The Confidence Test".
 *
 * The case against patches. It was built to sit immediately before
 * `HairBenefits` — problem stated, then answered — which is what the page's own
 * logic and the landing-page research both want. By request it now sits late
 * instead, between `SimplestWay` and `BookConsultation`, where it reads as a
 * closing argument before the ask rather than as the problem being solved.
 * Nothing in this component depends on its neighbours either way.
 *
 * **On the orange.** The site's tokens carry one accent on purpose — "the page
 * carries no colour of its own, so the single blue gradient does all the
 * pointing". This breaks that, for the same reason `.faq__stars` and
 * `.backed__stars` already do: a warning rendered in the brand blue reads as
 * decoration rather than as a warning. Colour is never the only signal — the
 * heading, the label and the exclamation all say it too, so nothing is lost to
 * a reader who cannot separate the hues.
 *
 * The closing panel is built from the site's own gradient-plus-soft-highlights
 * recipe, the one `.backed__panel` and `.simplest__panel` use, rather than the
 * photographic sky in the design. That is what makes this section sit with the
 * others instead of beside them, and it costs no new asset.
 *
 * Entrance is `useReveal`, the idiom every other section here uses, which is
 * already reduced-motion aware.
 */
export function PatchFail() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="patchFail" aria-labelledby="patchfail-title">
      <div className="wrap">
        <div
          className="patchFail__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="patchFail__title" id="patchfail-title">
            {/* The trailing space matters. Below 620px these spans go inline so
                the two lines reflow as one paragraph, and without a separator
                they render — and are read aloud — as "Often FailThe". A CSS
                `::before` would fix the look but not `textContent`, which is
                what a screen reader gets. On desktop the spans are blocks and
                the space collapses away. */}
            {patchFailData.titleLines.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>

          <WarningDiamond />

          <h3 className="patchFail__label">{patchFailData.issue.label}</h3>

          <p className="patchFail__body">
            <Emphasised text={patchFailData.issue.body} />
          </p>

          <div className="patchFail__panel">
            <p className="patchFail__lead">{patchFailData.promise.lead}</p>
            <p className="patchFail__note">{patchFailData.promise.note}</p>

            <a className="patchFail__cta" href={patchFailData.cta.href}>
              <span>{patchFailData.cta.label}</span>
              <span className="patchFail__ctaIcon" aria-hidden="true">
                <ArrowUpRight size={14} strokeWidth={2.6} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
