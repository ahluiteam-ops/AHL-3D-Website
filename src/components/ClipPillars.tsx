import { Eye, Lock, ShieldCheck } from 'lucide-react'
import { Photo } from './Photo'
import { useReveal } from '../hooks'
import { clipThreePillars, clipThreeTitle, type ClipPillar } from '../site'

const icons: Record<ClipPillar['icon'], typeof Eye> = {
  invisible: Eye,
  safe: ShieldCheck,
  secure: Lock,
}

/**
 * "A Hair System Gives You Three Things Every Man Wants:".
 *
 * Three cards, each a claim with the photograph that evidences it. Directly
 * answers the three fears stated above it — invisible, safe, secure — which is
 * why it follows that section rather than the hero.
 *
 * Each card's full photograph bleeds to the card's bottom edge, so the image is
 * the card's floor rather than a cropped banner or framed inset.
 */
export function ClipPillars() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="pillars3" aria-labelledby="clip-three-title">
      <div className="wrap">
        <div
          className="pillars3__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="pillars3__title" id="clip-three-title">
            {clipThreeTitle.map((line) => (
              /* Real trailing space: blocks, so it collapses visually, but
                 without it the two lines run together in the accessible name. */
              <span key={line}>{line} </span>
            ))}
          </h2>

          <ul className="pillars3__grid">
            {clipThreePillars.map((pillar, i) => {
              const Icon = icons[pillar.icon]
              return (
                <li
                  className="pillars3__card"
                  key={pillar.title}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <span className="pillars3__mark" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <h3 className="pillars3__cardTitle">{pillar.title}</h3>
                  <p className="pillars3__note">{pillar.note}</p>
                  <span className="pillars3__art">
                    <Photo slot={pillar.media} className="pillars3__photo" />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
