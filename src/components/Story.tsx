import { ArrowUpRight, EyeOff, Frown, Pill, ShieldCheck, Smile, Syringe } from 'lucide-react'
import { StackRow, useScrollStack } from './ScrollStack'
import { useReveal } from '../hooks'
import { storyCta, storyPoints, storyTitle, type StoryIcon } from '../site'

const icons: Record<StoryIcon, typeof Frown> = {
  frown: Frown,
  'eye-off': EyeOff,
  pill: Pill,
  syringe: Syringe,
  shield: ShieldCheck,
}

/* One row per point, plus the closing card. */
const ROWS = storyPoints.length + 1

/**
 * "This Might Sound Like Your Story".
 *
 * Built on TRIONN's "Our values" pattern from
 * `reference/Recording 2026-08-06 182025.mp4`: the heading holds still on the
 * left while the cards stack in on the right one at a time, each one preceded
 * by a narrower slab of itself peeking out from under the card above.
 *
 * The mechanism itself lives in `ScrollStack`, shared with `NaturalFront` on
 * page 4. Only the appearance is here.
 *
 * Below 901px and for reduced motion the pin is dropped and every card is
 * simply open — the content is five short lines and an offer, and none of it
 * depends on the animation to make sense.
 */
export function Story() {
  const { sectionRef, still, progress, last } = useScrollStack(ROWS)
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()

  return (
    <section
      className={`story${still ? ' story--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="story-title"
    >
      <div className="story__pin">
        <div
          className="story__in wrap"
          ref={revealRef}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="story__title" id="story-title">
            {storyTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <ol className="story__rows">
            {storyPoints.map((point, i) => {
              const Icon = icons[point.icon]
              return (
                <StackRow
                  key={point.text}
                  index={i}
                  last={last}
                  progress={progress}
                  still={still}
                  className="story__row"
                  innerClassName="story__rowIn"
                >
                  <span className="story__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <p>{point.text}</p>
                </StackRow>
              )
            })}

            <StackRow
              index={last}
              last={last}
              progress={progress}
              still={still}
              className="story__row story__row--cta"
              innerClassName="story__rowIn"
            >
              <Smile
                className="story__ctaMark"
                size={30}
                strokeWidth={2}
                aria-hidden="true"
              />
              <h3>{storyCta.title}</h3>
              <p>{storyCta.body}</p>
              <a className="story__ctaBtn" href={storyCta.href}>
                {storyCta.action}
                <ArrowUpRight size={15} strokeWidth={2.4} />
              </a>
            </StackRow>
          </ol>
        </div>
      </div>
    </section>
  )
}
