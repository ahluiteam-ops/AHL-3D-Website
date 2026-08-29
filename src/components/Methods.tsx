import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Layers, Sticker } from 'lucide-react'
import { useReveal, useTilt } from '../hooks'
import { methods, methodsAction, methodsTitle, type Method } from '../site'

const icons: Record<Method['icon'], typeof Layers> = {
  sticker: Sticker,
  clips: Layers,
}

/**
 * "Our Trusted Methods For A Natural Look".
 *
 * The client's artwork: heading top-left, accordion bottom-left, one
 * photograph filling the right column. The gap between heading and accordion
 * is the composition, not slack — the same arrangement the Services section
 * used before it was rebuilt as full-width rows, which is why the two no
 * longer collide.
 *
 * Each method has its own photograph, and the panel cross-fades to whichever
 * one is open. Note `shownMedia`: closing every row is a legal state, so the
 * picture holds on the last method that was open rather than blanking. An
 * empty panel would leave the right-hand column as a grey rectangle, which
 * reads as a broken image rather than as a closed accordion.
 *
 * Depth is on the photograph and nowhere else. The panel takes a small
 * pointer tilt and the picture inside it moves against its own frame, so the
 * media has a front and a back; the copy beside it stays flat, because type
 * that rotates is type that is harder to read.
 *
 * Answers open with the `grid-template-rows: 0fr → 1fr` transition used
 * elsewhere.
 */
export function Methods() {
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()
  const { ref: tiltRef, onMove, onLeave } = useTilt<HTMLDivElement>(4)
  const [open, setOpen] = useState(0)
  const [shownMedia, setShownMedia] = useState(0)

  const toggle = (index: number) => {
    setOpen((current) => (current === index ? -1 : index))
    setShownMedia(index)
  }

  return (
    <section className="methods" aria-labelledby="methods-title">
      <div
        className="methods__in wrap"
        data-shown={shown ? 'true' : 'false'}
        ref={revealRef}
      >
        <div className="methods__col">
          <h2 className="methods__title" id="methods-title">
            {methodsTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <ul className="methods__list">
            {methods.map((method, i) => {
              const Icon = icons[method.icon]
              const expanded = i === open

              return (
                <li
                  className="methods__item"
                  data-open={expanded ? 'true' : 'false'}
                  key={method.title}
                >
                  <h3>
                    <button
                      type="button"
                      className="methods__head"
                      onClick={() => toggle(i)}
                      aria-expanded={expanded}
                    >
                      <Icon size={19} strokeWidth={2} aria-hidden="true" />
                      <span>{method.title}</span>
                      <ChevronDown
                        className="methods__chevron"
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <div className="methods__body">
                    <div className="methods__bodyIn">
                      <p>{method.body}</p>
                      <a className="methods__cta" href={method.href}>
                        {methodsAction}
                        <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div
          className="methods__media"
          ref={tiltRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {methods.map((method, i) => {
            const current = i === shownMedia
            return (
              <img
                key={method.image}
                src={method.image}
                /* Only the visible photograph is described. The other is
                   decorative while it is hidden, and announcing both would
                   describe a picture nobody is looking at. */
                alt={current ? method.alt : ''}
                data-current={current ? 'true' : 'false'}
                aria-hidden={current ? undefined : true}
                loading="lazy"
                decoding="async"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
