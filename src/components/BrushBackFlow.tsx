import { Fragment } from 'react'
import { useReveal } from '../hooks'
import { brushBackFlow, brushBackTitle, type FlowNode } from '../site'

/** `**` marks the bold, as everywhere else on this page. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  )
}

function Node({ node, step }: { node: FlowNode; step: number }) {
  return (
    <div className="flow__node" style={{ transitionDelay: `${step * 0.13}s` }}>
      <p className="flow__text">
        <Emphasised text={node.text} />
        {node.note ? (
          <>
            <br />
            <span className="flow__note">{node.note}</span>
          </>
        ) : null}
      </p>
    </div>
  )
}

/**
 * "Can You Use Your Own Front Hair For A Brush-Back Style?"
 *
 * Page 4's decision tree, below the closing scrub block.
 *
 * **The connectors are CSS, not SVG.** Every line is a positioned element with
 * a background and a border-drawn arrowhead, laid out on the same grid as the
 * nodes. An SVG overlay would need measured coordinates for every breakpoint,
 * and this diagram reflows — the nodes change width continuously between 360px
 * and 1440px. Grid-placed bars follow the layout for free.
 *
 * That choice is also what makes the reveal cheap: a line draws itself by going
 * `scaleY(0)` to `scaleY(1)` from its top edge, which is a compositor-only
 * transform. The arrowheads fade in behind their line so a head never appears
 * before the line that carries it.
 *
 * The heading wipes word by word out of a mask, the same idiom as
 * `HairlineTruth`, with real spaces between the words *and* between the two
 * lines — seven components in this codebase have shipped a split headline that
 * announced as one run-on word.
 *
 * `useReveal` handles `prefers-reduced-motion`: every node, line and head
 * renders in place with no transform and no stagger.
 */
export function BrushBackFlow() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  let wordIndex = 0

  /* One shared clock, so the lines draw between the nodes they connect rather
     than on their own schedule. */
  const line = (step: number) => ({ transitionDelay: `${step * 0.13 + 0.06}s` })

  return (
    <section className="flow" aria-labelledby="brush-back-title">
      <div className="wrap">
        <div className="flow__in" ref={ref} data-shown={shown ? 'true' : 'false'}>
          <h2 className="flow__title" id="brush-back-title">
            {brushBackTitle.map((lineText) => (
              <span className="flow__titleLine" key={lineText}>
                {lineText.split(' ').map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    {i > 0 ? ' ' : null}
                    <span className="flow__wordMask">
                      <span
                        className="flow__word"
                        style={{ transitionDelay: `${wordIndex++ * 0.045}s` }}
                      >
                        {word}
                      </span>
                    </span>
                  </Fragment>
                ))}{' '}
              </span>
            ))}
          </h2>

          {/* The diagram is a two-column grid. Centred nodes span both columns;
              the branch nodes take one each. Connectors are grid children too,
              so they stretch with whatever the nodes measure. */}
          <div className="flow__chart">
            <div className="flow__row flow__row--full">
              <Node node={brushBackFlow.start} step={0} />
            </div>

            <span className="flow__link" style={line(0)} aria-hidden="true">
              <span className="flow__lineV" />
              <span className="flow__head" />
            </span>

            <div className="flow__row flow__row--full">
              <Node node={brushBackFlow.density} step={1} />
            </div>

            {/* The split: a stub down from the density node, a bar across, and
                a leg down into each branch. */}
            <span className="flow__split" style={line(1)} aria-hidden="true">
              <span className="flow__splitStem" />
              <span className="flow__splitBar" />
              {/* No heads on these legs: they run *into* the pills, and the
                  arrow belongs on the step after, pointing at the node. */}
              <span className="flow__splitLeg flow__splitLeg--left" />
              <span className="flow__splitLeg flow__splitLeg--right" />
            </span>

            <div className="flow__row flow__row--pills">
              <span className="flow__pill flow__pill--yes" style={line(2)}>
                {brushBackFlow.yes.label}
              </span>
              <span className="flow__pill flow__pill--no" style={line(2)}>
                {brushBackFlow.no.label}
              </span>
            </div>

            {/* Pill to node, one short arrow per column. */}
            <span className="flow__legs" style={line(2)} aria-hidden="true">
              <span className="flow__leg flow__leg--left">
                <span className="flow__head" />
              </span>
              <span className="flow__leg flow__leg--right">
                <span className="flow__head" />
              </span>
            </span>

            <div className="flow__row flow__row--branch">
              <Node node={brushBackFlow.yes.node} step={3} />
              <Node node={brushBackFlow.no.node} step={3} />
            </div>

            {/* The merge: only the yes branch continues, so this drops from the
                left column and turns in to the centre. */}
            <span className="flow__merge" style={line(3)} aria-hidden="true">
              <span className="flow__mergeDrop" />
              <span className="flow__mergeBar" />
              <span className="flow__mergeStem">
                <span className="flow__head" />
              </span>
            </span>

            <div className="flow__row flow__row--full">
              <Node node={brushBackFlow.fibre} step={4} />
            </div>

            <span className="flow__link" style={line(4)} aria-hidden="true">
              <span className="flow__lineV" />
              <span className="flow__head" />
            </span>

            <div className="flow__row flow__row--full">
              <Node node={brushBackFlow.outcome} step={5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
