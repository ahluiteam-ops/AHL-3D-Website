import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Plus, X } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { clipZyconRange } from '../site'
import { Photo, type Slot } from './Photo'

export type ZyconRangeContent = {
  tag: string
  cardTitle: readonly [string, string]
  sheetTitleLead: string
  sheetTitleAccent: string
  body: readonly { text: string; strong?: boolean }[]
  action: { label: string; href: string }
  media: { background: Slot; card: Slot; overlay: Slot }
}

/**
 * Premium Zycon teaser and detail dialog on the Clip-On Hair System page.
 *
 * The card is one large button with a visible plus affordance. The dialog
 * follows the site's established overlay contract: focus moves to Close,
 * remains trapped in the sheet, returns to the opener, Escape and the scrim
 * close it, and the document does not scroll behind it.
 */
export function ClipZyconRange({
  content = clipZyconRange,
}: {
  content?: ZyconRangeContent
} = {}) {
  const [open, setOpen] = useState(false)
  const still = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()
  const openerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const sheetTitleId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

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
      openerRef.current?.focus()
    }
  }, [close, open])

  const spring = still
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.7 }

  return (
    <section className="zyconRange" aria-labelledby={titleId}>
      <div className="wrap">
        <div
          className="zyconRange__card"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <Photo
            slot={content.media.background}
            className="zyconRange__background"
          />

          <div className="zyconRange__copy">
            <span className="zyconRange__tag">{content.tag}</span>
            <h2 className="zyconRange__title" id={titleId}>
              <span>{content.cardTitle[0]} </span>
              <span>{content.cardTitle[1]}</span>
            </h2>
          </div>

          <div className="zyconRange__cardArt" aria-hidden="true">
            <Photo
              slot={content.media.card}
              className="zyconRange__cardPhoto"
            />
          </div>

          <button
            type="button"
            className="zyconRange__open"
            ref={openerRef}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={`Open details about ${content.cardTitle.join(' ')}`}
          >
            <span className="zyconRange__plus" aria-hidden="true">
              <Plus size={25} strokeWidth={2.8} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <div className="zyconRange__layer">
            <motion.div
              className="zyconRange__scrim"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: still ? 0 : 0.26 }}
            />

            <motion.div
              className="zyconRange__sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={sheetTitleId}
              initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
              transition={spring}
            >
              <button
                type="button"
                className="zyconRange__close"
                ref={closeRef}
                onClick={close}
              >
                <X size={22} strokeWidth={2.7} aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>

              <div className="zyconRange__sheetIn">
                <div className="zyconRange__sheetCopy">
                  <h2 className="zyconRange__sheetTitle" id={sheetTitleId}>
                    {content.sheetTitleLead}{' '}
                    <span>{content.sheetTitleAccent}</span>
                  </h2>
                  <p className="zyconRange__body">
                    {content.body.map((part, index) =>
                      'strong' in part && part.strong ? (
                        <strong key={index}>{part.text}</strong>
                      ) : (
                        <span key={index}>{part.text}</span>
                      ),
                    )}
                  </p>
                  <a className="zyconRange__more" href={content.action.href}>
                    {content.action.label}
                    <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
                  </a>
                </div>

                <div className="zyconRange__sheetArt">
                  <Photo
                    slot={content.media.overlay}
                    className="zyconRange__sheetPhoto"
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
