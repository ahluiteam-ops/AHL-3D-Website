import { Check, Lightbulb } from 'lucide-react'
import { useReveal } from '../hooks'
import {
  baseChoiceOptions,
  baseChoicePrompt,
  baseChoiceTitle,
  type BaseOption,
} from '../site'

/** `**` marks the bold, as everywhere else on these pages. */
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
 * One option card.
 *
 * **The questions are a plain bulleted list, by request.** They were briefly
 * real checkboxes with a running tally, so the reader could answer the five
 * things the copy tells them to ask themselves and the card would say whether
 * that option was theirs. That was removed in favour of the static list the
 * design draws.
 *
 * What went with it is worth knowing rather than rediscovering: the `fieldset`,
 * the `legend` and the polite live region were all there to serve form
 * controls. With no controls left they would be markup describing nothing, so
 * the prompt is an ordinary paragraph and the questions an ordinary `<ul>`.
 * Reinstating the interaction means bringing all of that back together.
 */
function OptionCard({ option, index }: { option: BaseOption; index: number }) {
  return (
    <article
      className="baseChoice__card"
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <h3 className="baseChoice__cardTitle">{option.title}</h3>

      <p className="baseChoice__prompt">
        <Lightbulb
          className="baseChoice__bulb"
          size={17}
          strokeWidth={2.2}
          aria-hidden="true"
        />
        {baseChoicePrompt}
      </p>

      <ul className="baseChoice__list">
        {option.questions.map((question) => (
          <li className="baseChoice__item" key={question}>
            {/* The marker is drawn rather than left to `list-style`, so it can
                be sized and coloured with the text it sits beside. The list is
                still a real `<ul>`, so it is still announced as a list of five
                items. */}
            <span className="baseChoice__dot" aria-hidden="true" />
            <span className="baseChoice__text">{question}</span>
          </li>
        ))}
      </ul>

      <p className="baseChoice__verdict">
        <span className="baseChoice__verdictMark" aria-hidden="true">
          <Check size={11} strokeWidth={3.6} />
        </span>
        <span>
          <Emphasised text={option.verdict} />
        </span>
      </p>
    </article>
  )
}

/**
 * "Still Confused Between Bases?"
 *
 * Above the range gallery on both lifespan pages: the rating table higher up
 * shows the trade-off in the abstract, this states which reader each side of it
 * suits. The questions are a prop because two of them state lifespans in
 * months, and the honest numbers differ between stick-on and clip-on — a shared
 * set had the Clip-On page contradicting its own overlays.
 *
 * The cards enter on a stagger via `useReveal`, which handles reduced motion
 * already.
 */
export type BaseChoiceProps = {
  /* Defaults to the Stick-On page's own questions, so its bare `<BaseChoice />`
     call site needs no edit. The Clip-On page passes its own set: two of the
     questions state lifespans, and clip-on lifespans differ. */
  options?: BaseOption[]
}

export function BaseChoice({ options = baseChoiceOptions }: BaseChoiceProps = {}) {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="baseChoice" aria-labelledby="base-choice-title">
      <div className="wrap">
        <div
          className="baseChoice__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <h2 className="baseChoice__title" id="base-choice-title">
            {baseChoiceTitle}
          </h2>

          <div className="baseChoice__grid">
            {options.map((option, i) => (
              <OptionCard key={option.title} option={option} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
