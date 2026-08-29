import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Lightbulb, Plus, X } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks'
import { hairBenefitsData, type BenefitPoint } from '../site'

/* Declared structurally rather than as `typeof hairBenefitsData`. Both data
 * objects are `as const`, so deriving the type from one of them makes every
 * string a literal and the other object fails to assign — the page-4 poster
 * path is not the string `'/hair-benefits/card.png'`. */
export type BenefitsData = {
  tag: string
  titleLead: string
  titleTail: string
  cardTitleLines: readonly string[]
  intro: string
  points: readonly BenefitPoint[]
  cta: { label: string; href: string }
  media: { card: Slot; sheet: Slot }
  /* Page 4 drops the callout and stands its CTA full width under the list
     instead, and its intro ends in a link. Everything else — the card, the
     dialog, the focus contract, the scroll lock — is identical, so the two are
     one component rather than two copies of a modal. */
  philosophy?: { label: string; body: string }
  introLink?: { label: string; href?: string }
  /* How the card's photograph is framed. `'bleed'` fills the whole card and is
     right for Page 3, whose file is a wide annotated scene at nearly the card's
     own ratio. `'right'` stands a portrait cut-out on the right-hand side,
     which is what Page 4 needs — `cover` on a 1400x1152 cut-out in a 2.03-ratio
     card crops it to a face filling the frame. */
  cardArt?: 'bleed' | 'right'
}

export type HairBenefitsProps = { data?: BenefitsData }

type Slot = {
  src: string
  alt: string
  width: number
  height: number
  /* An alternative file for narrow screens. Art direction, not a resolution
     swap: the desktop cut-out is framed for a tall column and gets clipped in
     the short box the phone layout gives it, so the phone is served a different
     crop of the same man rather than a smaller copy of the same file. */
  mobileSrc?: string
}

/**
 * A photograph that has not been supplied yet.
 *
 * The client's two images are still outstanding, and the honest placeholder for
 * a missing photograph is an empty frame that says so — not a stock face, and
 * not a different client borrowed from elsewhere on the site, which under a
 * heading about *this* man's results would be a claim the brand cannot make.
 *
 * `onError` is what makes the swap free: the real `<img>` is always rendered,
 * and only falls back to the frame when the file genuinely is not there. Drop
 * the file in at the declared path and this component stops appearing on its
 * own.
 */
function Photo({ slot, className }: { slot: Slot; className?: string }) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <span className={`benefits__slot ${className ?? ''}`} aria-hidden="true">
        <span className="benefits__slotName">{slot.src.split('/').pop()}</span>
        <span className="benefits__slotSize">
          {slot.width}×{slot.height}
        </span>
      </span>
    )
  }

  const img = (
    <img
      className={className}
      src={slot.src}
      alt={slot.alt}
      width={slot.width}
      height={slot.height}
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
    />
  )

  /* `<picture>` rather than two images toggled by CSS: the browser picks one
     source and downloads only that, where a CSS toggle would fetch both and
     throw one away. The breakpoint matches the stylesheet's own 900px, where
     the sheet's layout changes. */
  if (!slot.mobileSrc) return img

  return (
    <picture>
      <source media="(max-width: 900px)" srcSet={slot.mobileSrc} />
      {img}
    </picture>
  )
}

/**
 * "Benefits of a Natural Looking Hair System".
 *
 * A teaser card, and a separate overlay that opens above it.
 *
 * **The card does not morph into the sheet, by request.** It used to: card and
 * sheet shared a `layoutId`, so motion interpolated the real geometry between
 * them and the card read as opening into the sheet — the shared-element move in
 * `reference/Recording 2026-08-21 125404.mp4`. The card was also hidden while
 * the sheet was up, which left a hole behind the blur where it had been. What
 * was asked for instead is a distinct panel arriving over a card that stays put,
 * so the `layoutId` is gone and the sheet has its own scale-and-fade entrance.
 * If the Apple morph is ever wanted back, it is those two `layoutId`s and
 * hiding the card again — nothing else here depends on it.
 *
 * What is kept from the reference: **the page behind blurs.** The scrim carries
 * `backdrop-filter`, so it blurs whatever is actually behind it without any
 * other section having to know this component exists.
 *
 * Everything a dialog owes the keyboard is here: `Escape` closes, focus moves
 * to the close button on open and returns to the `+` on close, `Tab` cycles
 * inside the sheet, and the page behind cannot scroll while it is open.
 *
 * Under `prefers-reduced-motion` the sheet still opens — it is the content, not
 * decoration — but it appears and disappears without the morph.
 */
export function HairBenefits({ data = hairBenefitsData }: HairBenefitsProps = {}) {
  const { philosophy, introLink } = data
  const [open, setOpen] = useState(false)
  const still = usePrefersReducedMotion()
  const openerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const close = useCallback(() => setOpen(false), [])

  /* Escape, the focus trap, and the scroll lock are one concern: they only
     apply while the sheet is open, so they live and die together. */
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !sheetRef.current) return

      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    /* Lock the element that actually scrolls. `body` carries `overflow: hidden
       auto` from the site's own CSS, but `document.scrollingElement` here is
       `html` — locking `body` looks right in devtools and lets the page scroll
       behind the sheet anyway. Measured: it did.

       Compensating for the scrollbar keeps the page behind from jolting
       sideways as it locks — the jolt is what gives a modal away. */
    const root = document.documentElement
    const gap = window.innerWidth - root.clientWidth
    const { overflow, paddingRight } = root.style
    root.style.overflow = 'hidden'
    if (gap > 0) root.style.paddingRight = `${gap}px`

    document.addEventListener('keydown', onKey)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
      root.style.overflow = overflow
      root.style.paddingRight = paddingRight
      openerRef.current?.focus()
    }
  }, [open, close])

  const spring = still
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.7 }

  return (
    <section
      className={`benefits${data.cardArt === 'right' ? ' benefits--rightArt' : ''}`}
      aria-labelledby={`${titleId}-card`}
    >
      <div className="wrap">
        {/* The card is a button in its own right, so the whole surface opens
            the sheet; the `+` is the affordance, not the only target. */}
        <button
          type="button"
          className="benefits__card"
          ref={openerRef}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className="benefits__cardCopy">
            <span className="benefits__tag">{data.tag}</span>
            <span className="benefits__cardTitle" id={`${titleId}-card`}>
              {/* Trailing space is a real text node. These spans are blocks so
                  it collapses visually, but without it the lines concatenate in
                  the button's accessible name — "Benefits of a NaturalLooking
                  Hairline". Fourth component in this codebase with the same
                  bug; the shape is always a title-lines array mapped to
                  sibling spans. */}
              {data.cardTitleLines.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </span>
          </span>

          {/* One photograph, full bleed. It already carries the dashed
              hairline, the arrow and the circular scalp inset, so there is
              nothing for the component to draw on top. */}
          <span className="benefits__cardArt">
            <Photo
              slot={data.media.card}
              className="benefits__cardPhoto"
            />
          </span>

          <span className="benefits__plus" aria-hidden="true">
            <Plus size={22} strokeWidth={2.6} />
          </span>
          <span className="sr-only">
            Read the benefits of a natural looking hair system
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="benefits__layer">
            <motion.div
              className="benefits__scrim"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: still ? 0 : 0.28 }}
            />

            <motion.div
              className="benefits__sheet"
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

              {/* The content cross-fades rather than stretching with the
                  morph — scaled text is the tell that a layout animation is
                  happening, and Apple's sheet does not show it either. */}
              <div className="benefits__sheetIn">
                <div className="benefits__sheetCopy">
                  <h2 className="benefits__sheetTitle" id={`${titleId}-sheet`}>
                    {data.titleLead}
                    <span>{data.titleTail}</span>
                  </h2>

                  <p className="benefits__intro">
                    {data.intro}
                    {/* No film supplied, so the label renders as text rather
                        than as a link that goes nowhere — same convention the
                        guide heroes and `ChecklistMedia` follow. Give it an
                        `href` and it becomes a real link with no other change. */}
                    {introLink ? (
                      <>
                        {' '}
                        {introLink.href ? (
                          <a
                            className="benefits__introLink"
                            href={introLink.href}
                          >
                            {introLink.label}
                          </a>
                        ) : (
                          <span className="benefits__introLink benefits__introLink--pending">
                            {introLink.label}
                          </span>
                        )}
                      </>
                    ) : null}
                  </p>

                  <ul className="benefits__list">
                    {data.points.map((point) => (
                      <li className="benefits__item" key={point.title}>
                        <span className="benefits__check" aria-hidden="true">
                          <Check size={13} strokeWidth={3.4} />
                        </span>
                        <h3 className="benefits__itemTitle">{point.title}</h3>
                        <p className="benefits__itemNote">{point.note}</p>
                      </li>
                    ))}
                  </ul>

                  {philosophy ? (
                    <div className="benefits__philosophy">
                      <Lightbulb
                        className="benefits__bulb"
                        size={34}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="benefits__philosophyLabel">
                          {philosophy.label}
                        </h3>
                        <p className="benefits__philosophyBody">
                          {philosophy.body}
                        </p>
                        <a className="benefits__cta" href={data.cta.href}>
                          <span>{data.cta.label}</span>
                          <span className="benefits__ctaIcon" aria-hidden="true">
                            <ArrowUpRight size={14} strokeWidth={2.6} />
                          </span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Without the callout the CTA has nothing to sit inside, so
                       it stands full width under the list. */
                    <a
                      className="benefits__cta benefits__cta--wide"
                      href={data.cta.href}
                    >
                      <span>{data.cta.label}</span>
                      <span className="benefits__ctaIcon" aria-hidden="true">
                        <ArrowUpRight size={14} strokeWidth={2.6} />
                      </span>
                    </a>
                  )}
                </div>

                <div className="benefits__sheetArt">
                  <Photo slot={data.media.sheet} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
