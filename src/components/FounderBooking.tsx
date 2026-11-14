import { ArrowUpRight, Send } from 'lucide-react'
import { useReveal } from '../hooks'
import { bookingPageRoute, markOpenedFromSite } from '../bookingDraft'

/**
 * "Looking for Expert Advice from the Founder?" — the dark teaser panel.
 *
 * The button opens the booking as a full page at `#/book-consultation`
 * (`pages/BookConsultation.tsx`); it used to open a popup. It is a link, not a
 * button, so it can be opened in a new tab and works before any script runs.
 * It leaves a one-shot flag so the booking page's Close can step back onto the
 * page this was clicked on, rather than always jumping to the homepage.
 */
export function FounderBooking() {
  const { ref, shown } = useReveal<HTMLElement>()

  return (
    <section
      className="founderBooking"
      aria-labelledby="founder-booking-title"
      ref={ref}
      data-shown={shown ? 'true' : 'false'}
    >
      <div className="wrap">
        <div className="founderBooking__panel">
          <div className="founderBooking__copy">
            <p className="founderBooking__eyebrow"><Send aria-hidden="true" />Expert Consultation</p>
            <h2 id="founder-booking-title">Looking for Expert Advice from the Founder?</h2>
            <p className="founderBooking__lede">
              Speak directly with <strong>Vinitt Dessai</strong>, Founder and Hair Expert,
              before you commit to a treatment or hair system.
            </p>
            <a className="founderBooking__cta" href={bookingPageRoute} onClick={markOpenedFromSite}>
              <span>Consult with the Founder</span><ArrowUpRight aria-hidden="true" />
            </a>
            <p className="founderBooking__meta">45–60 minutes · Online or in person</p>
          </div>
        </div>
      </div>
    </section>
  )
}
