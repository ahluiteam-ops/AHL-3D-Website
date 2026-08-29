import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, Check, Plus, X } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { Photo } from './Photo'
import {
  baseOptions,
  baseOptionsTitle,
  type StickOnBaseOption,
} from '../site'

export type BaseOptionsProps = {
  /** Defaults to the Stick-On page's own content, so its bare `<BaseOptions />`
   *  call site needs no edit. The Clip-On page passes its own. */
  title?: readonly string[]
  options?: StickOnBaseOption[]
}

/**
 * Two base-option teaser cards and their detail sheets.
 *
 * Interaction matches `HairBenefits`: the full card is the trigger, the page
 * behind blurs, Escape and the scrim close the sheet, focus is trapped while it
 * is open and returns to the exact card that opened it, and document scrolling
 * is locked without shifting the page sideways.
 *
 * Content is a prop defaulting to the Stick-On page's own, so the Clip-On page
 * is the same component with its own copy rather than a second modal to keep in
 * step. Photographs go through `Photo`, which falls back to a labelled frame
 * when a file is not served — the Clip-On page is built ahead of its imagery.
 */
export function BaseOptions({
  title = baseOptionsTitle,
  options = baseOptions,
}: BaseOptionsProps = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const still = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()
  const openerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const close = useCallback(() => setActiveIndex(null), [])

  useEffect(() => {
    if (activeIndex === null) return

    const opener = openerRefs.current[activeIndex]
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !sheetRef.current) return

      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const focused = document.activeElement

      if (event.shiftKey && focused === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const root = document.documentElement
    const scrollbarGap = window.innerWidth - root.clientWidth
    const { overflow, paddingRight } = root.style
    root.style.overflow = 'hidden'
    if (scrollbarGap > 0) root.style.paddingRight = `${scrollbarGap}px`

    document.addEventListener('keydown', onKey)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
      root.style.overflow = overflow
      root.style.paddingRight = paddingRight
      opener?.focus()
    }
  }, [activeIndex, close])

  const active = activeIndex === null ? null : options[activeIndex]
  const spring = still
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.7 }

  return (
    <section className="baseOptions" aria-labelledby={titleId}>
      <div className="wrap">
        <div className="baseOptions__in" ref={ref}>
          <motion.h2
            className="baseOptions__title"
            id={titleId}
            aria-label={title.join(' ')}
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={
              still
                ? { duration: 0 }
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.h2>

          <div className="baseOptions__grid">
            {options.map((option, index) => (
              <motion.div
                className="baseOptions__cardShell"
                key={option.tag}
                initial={false}
                animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={
                  still
                    ? { duration: 0 }
                    : {
                        duration: 0.62,
                        delay: 0.08 + index * 0.11,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              >
                <button
                  type="button"
                  className="baseOptions__card"
                  ref={(node) => {
                    openerRefs.current[index] = node
                  }}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={activeIndex === index}
                  aria-haspopup="dialog"
                >
                  <span className="baseOptions__tag">
                    <BadgeCheck size={13} strokeWidth={2.4} aria-hidden="true" />
                    {option.tag}
                  </span>
                  <span className="baseOptions__cardTitle">{option.title}</span>
                  <span className="baseOptions__description">
                    {option.description}
                  </span>
                  <span className="baseOptions__cardArt">
                    <Photo slot={option.cardMedia} />
                  </span>
                  <span className="baseOptions__plus" aria-hidden="true">
                    <Plus size={21} strokeWidth={2.8} />
                  </span>
                  <span className="sr-only">Open {option.tag} details</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && activeIndex !== null ? (
          <div className="benefits__layer baseOptions__layer">
            <motion.div
              className="benefits__scrim"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: still ? 0 : 0.28 }}
            />

            <motion.div
              className="baseOptions__sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${titleId}-sheet`}
              initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
              transition={spring}
            >
              <button
                type="button"
                className="benefits__close"
                ref={closeRef}
                onClick={close}
              >
                <X size={20} strokeWidth={2.6} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>

              <div className="baseOptions__sheetIn">
                <div className="baseOptions__sheetCopy">
                  <h2 className="baseOptions__sheetTitle" id={`${titleId}-sheet`}>
                    {active.sheetTitleLead}
                    <span>{active.sheetTitleTail}</span>
                  </h2>
                  <p className="baseOptions__intro">{active.intro}</p>

                  <ul className="baseOptions__list">
                    {active.points.map((point) => (
                      <li className="baseOptions__item" key={point.title}>
                        <span className="baseOptions__check" aria-hidden="true">
                          <Check size={12} strokeWidth={3.2} />
                        </span>
                        <h3>{point.title}</h3>
                        <p>{point.note}</p>
                      </li>
                    ))}
                  </ul>

                  <p className="baseOptions__conclusion">
                    <span>{active.conclusion.lead} </span>
                    <strong>{active.conclusion.strong}</strong>
                  </p>
                </div>

                <div className="baseOptions__sheetArt">
                  <Photo slot={active.sheetMedia} loading="eager" />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
