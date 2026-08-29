import {
  ArrowUpRight,
  RefreshCw,
  Scissors,
  Smile,
  Sparkles,
  Syringe,
  Waves,
} from 'lucide-react'
import { StackRow, useScrollStack } from './ScrollStack'
import { useReveal } from '../hooks'
import {
  clipPerfectCta,
  clipPerfectRows,
  clipPerfectTitle,
  type ClipPerfectRow,
} from '../site'

const icons: Record<ClipPerfectRow['icon'], typeof Waves> = {
  crown: Waves,
  freedom: RefreshCw,
  razor: Scissors,
  treatment: Syringe,
  confidence: Sparkles,
}

/**
 * "Clip-On Is Perfect For Men Who…".
 *
 * **The homepage `Story` stack, third use.** Heading holds still on the left
 * while the rows build in on the right, each preceded by a narrower slab of
 * itself. The mechanism is `ScrollStack`, shared with `Story` and
 * `NaturalFront`; only the appearance lives here.
 *
 * Six rows — five criteria and the closing offer — so the step is `Story`'s own
 * 30vh rather than the longer one `NaturalFront` needed for three.
 */
export function ClipPerfectFor() {
  const { sectionRef, still, progress, last } = useScrollStack(
    clipPerfectRows.length + 1,
  )
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()

  return (
    <section
      className={`perfect${still ? ' perfect--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="clip-perfect-title"
    >
      <div className="perfect__pin">
        <div
          className="perfect__in wrap"
          ref={revealRef}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="perfect__title" id="clip-perfect-title">
            {clipPerfectTitle.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>

          <ol className="perfect__rows">
            {clipPerfectRows.map((row, i) => {
              const Icon = icons[row.icon]
              return (
                <StackRow
                  key={row.text}
                  index={i}
                  last={last}
                  progress={progress}
                  still={still}
                  className="perfect__row"
                  innerClassName="perfect__rowIn"
                >
                  <span className="perfect__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <p>{row.text}</p>
                </StackRow>
              )
            })}

            <StackRow
              index={last}
              last={last}
              progress={progress}
              still={still}
              className="perfect__row perfect__row--cta"
              innerClassName="perfect__rowIn"
            >
              <Smile
                className="perfect__ctaMark"
                size={26}
                strokeWidth={2}
                aria-hidden="true"
              />
              <h3>{clipPerfectCta.title}</h3>
              <p>{clipPerfectCta.body}</p>
              <a className="perfect__ctaBtn" href={clipPerfectCta.href}>
                {clipPerfectCta.action}
                <ArrowUpRight size={14} strokeWidth={2.4} />
              </a>
            </StackRow>
          </ol>
        </div>
      </div>
    </section>
  )
}
