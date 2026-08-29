import { Boxes, ChevronRight } from 'lucide-react'
import { Photo } from './Photo'
import { useReveal } from '../hooks'
import { clipLearnCard, clipLearnTitle } from '../site'

/**
 * "Learn How The Stick-On Hair System Works".
 *
 * The way out of this page. A reader who has read the whole clip-on case and
 * decided against it should not be left at a dead end, so the last thing before
 * the footer is the other method.
 *
 * The link is a real route — `#/stick-on-hair-system` — not one of the
 * `#consult` placeholders the CTAs elsewhere carry.
 */
export function ClipLearnStickOn() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="learnSo" aria-labelledby="clip-learn-title">
      <div className="wrap">
        <div className="learnSo__in" ref={ref} data-shown={shown ? 'true' : 'false'}>
          <h2 className="learnSo__title" id="clip-learn-title">
            {clipLearnTitle.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>

          <a className="learnSo__card" href={clipLearnCard.href}>
            <span className="learnSo__copy">
              <span className="learnSo__tag">
                <Boxes size={14} strokeWidth={2.2} aria-hidden="true" />
                {clipLearnCard.tag}
              </span>
              <span className="learnSo__body">{clipLearnCard.body}</span>
              <span className="learnSo__more">
                {clipLearnCard.action}
                <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
              </span>
            </span>

            <span className="learnSo__art">
              <Photo slot={clipLearnCard.media} className="learnSo__photo" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
