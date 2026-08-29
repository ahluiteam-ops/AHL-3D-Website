import { ArrowUpRight, Check } from 'lucide-react'
import { useReveal } from '../hooks'
import {
  clipZyconChips,
  clipZyconCtaAction,
  clipZyconCtaFoot,
  clipZyconCtaKicker,
  clipZyconCtaLede,
  clipZyconCtaTitle,
} from '../site'

/**
 * "Don't Just Hide Hair Loss. Reverse It Instantly."
 *
 * The page's closing ask, and the only place Zycon™ is named as a product
 * rather than described. The six chips restate the claims the page has already
 * evidenced, so this is a summary the reader can check rather than a new set of
 * assertions.
 *
 * The card carries the blue cap the design draws across its top edge, clipped
 * to the card's own radius so it reads as part of the card.
 */
export function ClipZyconCta() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="zyconCta" aria-labelledby="clip-zycon-title">
      <div className="wrap">
        <div
          className="zyconCta__card"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="zyconCta__title" id="clip-zycon-title">
            {clipZyconCtaTitle.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>

          <p className="zyconCta__lede">{clipZyconCtaLede}</p>

          <ul className="zyconCta__chips">
            {clipZyconChips.map((chip, i) => (
              <li
                className="zyconCta__chip"
                key={chip}
                style={{ transitionDelay: `${0.12 + i * 0.05}s` }}
              >
                <span className="zyconCta__check" aria-hidden="true">
                  <Check size={10} strokeWidth={3.6} />
                </span>
                {chip}
              </li>
            ))}
          </ul>

          <p className="zyconCta__kicker">{clipZyconCtaKicker}</p>

          <a className="zyconCta__btn" href={clipZyconCtaAction.href}>
            <span>{clipZyconCtaAction.label}</span>
            <span className="zyconCta__btnIcon" aria-hidden="true">
              <ArrowUpRight size={15} strokeWidth={2.6} />
            </span>
          </a>

          <p className="zyconCta__foot">{clipZyconCtaFoot}</p>
        </div>
      </div>
    </section>
  )
}
