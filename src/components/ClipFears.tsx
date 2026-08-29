import { ArrowUpRight } from 'lucide-react'
import { Photo } from './Photo'
import { useReveal } from '../hooks'
import {
  clipFears,
  clipFearsCta,
  clipFearsLede,
  clipFearsMedia,
  clipFearsTitle,
} from '../site'


/**
 * "The Real Fears Men Have".
 *
 * The objections stated plainly before anything is sold — the page's own
 * "honesty first" move, and the reason the sections under it read as answers
 * rather than as claims.
 *
 * The design sets each fear behind an emoji. Those became lucide marks and then,
 * by request, plain bullets: five different glyphs beside five sentences of the
 * same kind was decoration competing with the copy, and the sentences already
 * carry all the meaning.
 */
export function ClipFears() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="fears" aria-labelledby="clip-fears-title">
      <div className="wrap">
        <div className="fears__in" ref={ref} data-shown={shown ? 'true' : 'false'}>
          <h2 className="fears__title" id="clip-fears-title">
            {clipFearsTitle}
          </h2>

          <div className="fears__grid">
            <div className="fears__art">
              <Photo slot={clipFearsMedia} className="fears__photo" />
            </div>

            <div className="fears__col">
              <div className="fears__card">
                <p className="fears__lede">{clipFearsLede}</p>
                <ul className="fears__list">
                  {clipFears.map((fear, i) => (
                    <li
                      className="fears__item"
                      key={fear.text}
                      style={{ transitionDelay: `${0.1 + i * 0.07}s` }}
                    >
                      {/* A drawn bullet rather than `list-style`, so it can be
                          sized and coloured against the text beside it. The
                          list is still a real `<ul>`. */}
                      <span className="fears__dot" aria-hidden="true" />
                      <span>{fear.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a className="fears__cta" href={clipFearsCta.href}>
                <span>{clipFearsCta.label}</span>
                <span className="fears__ctaIcon" aria-hidden="true">
                  <ArrowUpRight size={14} strokeWidth={2.6} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
