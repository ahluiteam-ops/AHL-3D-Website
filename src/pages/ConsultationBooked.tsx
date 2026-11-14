import { useEffect, useMemo } from 'react'
import { ArrowUpRight, Building2, Check, Clock3, Phone, Video } from 'lucide-react'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { readBookingConfirmation } from '../bookingConfirmation'
import { formatLongDate } from '../bookingSlots'

const phone = '9222666111'
const whatsappHref = `https://wa.me/91${phone}?text=${encodeURIComponent('Hi American Hairline, I have booked a consultation with the founder.')}`

/**
 * "Consultation booked" — the page `Pay ₹5,000 securely` leads to, at
 * `#/consultation-booked`.
 *
 * It is separate from the thank-you page the general guidance form uses: that
 * visitor asked to be called back, this one has chosen a format and a time and
 * paid for them, so the page repeats those back and says plainly what happens
 * next. A person who has just paid ₹5,000 should never wonder whether it
 * worked, so the summary comes first and the reassurance is specific.
 *
 * The slot is always called a *preferred* time. The team confirms the final
 * one by phone, as the dialog said one step earlier; this page must not
 * contradict it.
 *
 * ⚠ Razorpay is not connected yet. While `VITE_RAZORPAY_*` is unset the dialog
 * sends people here with `preview: true`, and the page says so in a banner so
 * nobody mistakes the preview for a real booking. The banner disappears with
 * no code change once payment is wired, because verified bookings never carry
 * the flag.
 */
export function ConsultationBooked() {
  const booking = useMemo(readBookingConfirmation, [])
  const firstName = booking?.name.trim().split(/\s+/)[0]
  const online = booking?.mode === 'online'
  const longDate = formatLongDate(booking?.date)

  useEffect(() => {
    const previous = document.title
    document.title = 'Consultation booked | American Hairline'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Nav />
      <main className="booked">
        <div className="wrap">
          {booking?.preview && (
            <p className="booked__preview" role="note">
              <strong>Preview only.</strong> Online payment is not connected yet, so no payment was taken.
            </p>
          )}

          <header className="booked__head">
            <span className="booked__tick" aria-hidden="true">
              <Check />
            </span>
            <p className="booked__eyebrow">Booking received</p>
            <h1>{firstName ? `Thank you, ${firstName}.` : 'Thank you.'}</h1>
            <p className="booked__lead">
              {booking ? (
                <>
                  Your private consultation with <strong>Vinitt Dessai</strong> is requested. Our team will call{' '}
                  <strong>{booking.phone}</strong> to confirm the final date and time.
                </>
              ) : (
                <>
                  Your private consultation with <strong>Vinitt Dessai</strong> is requested. Our team will call you
                  to confirm the final date and time.
                </>
              )}
            </p>
          </header>

          <div className="booked__grid">
            {booking && (
              <section className="booked__pass" aria-labelledby="booked-pass-title">
                <div className="booked__passTop">
                  <p id="booked-pass-title">Your booking</p>
                  <span className="booked__mode">
                    {online ? <Video aria-hidden="true" /> : <Building2 aria-hidden="true" />}
                    {online ? 'Online video call' : 'In person at a salon'}
                  </span>
                </div>
                {longDate && <p className="booked__date">{longDate}</p>}
                <p className="booked__time">{booking.slot}</p>
                <p className="booked__timeNote">
                  <Clock3 aria-hidden="true" />
                  Tentative {longDate ? 'date and time' : 'time'}. Our team will confirm the final one.
                </p>
                <dl className="booked__facts">
                  <div>
                    <dt>Name</dt>
                    <dd>{booking.name}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{booking.phone}</dd>
                  </div>
                  {booking.email && (
                    <div>
                      <dt>Email</dt>
                      <dd>{booking.email}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Consultation fee</dt>
                    <dd>{booking.fee}</dd>
                  </div>
                  {booking.reference && (
                    <div>
                      <dt>Booking reference</dt>
                      <dd>{booking.reference}</dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            <section className="booked__next" aria-labelledby="booked-next-title">
              <h2 id="booked-next-title">What happens next</h2>
              <ol>
                <li data-done="true">
                  <span aria-hidden="true">
                    <Check />
                  </span>
                  <div>
                    <h3>Booking received</h3>
                    <p>Your preferred date and time are saved with the team.</p>
                  </div>
                </li>
                <li>
                  <span aria-hidden="true" />
                  <div>
                    <h3>One of our team calls you back</h3>
                    <p>
                      They give you a final confirmation of the date and time{' '}
                      {online ? 'and send you the video-call details.' : 'and tell you which salon to visit.'}
                    </p>
                  </div>
                </li>
                <li>
                  <span aria-hidden="true" />
                  <div>
                    <h3>Your session with Vinitt</h3>
                    <p>A private 45–60 minute conversation, {online ? 'online' : 'in person'}, about your hair.</p>
                  </div>
                </li>
              </ol>
              <p className="booked__tip">
                <strong>Before the call:</strong> keep a few photos of your current hair situation ready. They help
                Vinitt give you a straight answer.
              </p>
            </section>
          </div>

          <div className="booked__actions">
            <a className="booked__home" href="#/">
              Back to home <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="booked__ghost" href={`tel:+91${phone}`}>
              <Phone aria-hidden="true" /> Call {phone}
            </a>
            <a className="booked__ghost" href={whatsappHref} target="_blank" rel="noreferrer">
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
