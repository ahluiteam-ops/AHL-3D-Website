import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  ShieldCheck,
  Video,
  X,
} from 'lucide-react'
import { bookingConfirmationRoute, saveBookingConfirmation } from '../bookingConfirmation'
import {
  clearBookingDraft,
  readBookingDraft,
  saveBookingDraft,
  takeOpenedFromSite,
} from '../bookingDraft'
import {
  consultationFee,
  createOrderUrl,
  loadRazorpay,
  validEmail,
  validPhone,
  verifyPaymentUrl,
  type BookingDetails,
  type ConsultationMode,
} from '../bookingPayment'
import {
  formatLongDate,
  getBookingWindow,
  getMonthCells,
  isSlotBooked,
  monthIndex,
  monthTitle,
  openingHours,
  shiftMonth,
  slotTimes,
  weekdayInitials,
  type MonthView,
} from '../bookingSlots'

type BookingStep = 1 | 2 | 3

/* Each step is its own history entry, so the browser and phone Back buttons
   walk Step 3, Step 2, Step 1 and then leave, instead of dumping the visitor
   out of a half-finished booking. `bookingDepth` counts the entries pushed on
   top of the one that opened the page; `fromSite` says a page of this site sits
   underneath, so Close can step back onto it. */
type NavState = { bookingDepth: number; step: BookingStep; fromSite: boolean }

function readNav(): NavState | null {
  const state = window.history.state as Partial<NavState> | null
  return state && typeof state.bookingDepth === 'number'
    ? { bookingDepth: state.bookingDepth, step: (state.step ?? 1) as BookingStep, fromSite: Boolean(state.fromSite) }
    : null
}

const monthOf = (iso: string): MonthView => ({ year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)) - 1 })

const stepTitles: Record<BookingStep, string> = {
  1: 'Choose how and when',
  2: 'Your details',
  3: 'Review and pay',
}

/**
 * `#/book-consultation` — the founder consultation booking as a full page.
 *
 * It replaces the popup that "Consult with the Founder" used to open: the same
 * three steps and the same rules (hours, closed Mondays, tentative dates), now
 * with room for a calendar and a live summary, and with the browser's own Back
 * button working between steps. Pay ends on `#/consultation-booked`.
 *
 * ⚠ Razorpay is not connected yet. While `VITE_RAZORPAY_*` is unset, Pay goes
 * to the thank-you page flagged `preview: true`, which says so on screen.
 */
export function BookConsultation() {
  const initial = useMemo(() => readBookingDraft(), [])
  const now = useMemo(() => new Date(), [])
  const bookingWindow = useMemo(() => getBookingWindow(now), [now])

  const [stepState, setStepState] = useState<BookingStep>(() => readNav()?.step ?? 1)
  const [mode, setMode] = useState<ConsultationMode | null>(initial.mode)
  const [date, setDate] = useState<string | null>(initial.date)
  const [slot, setSlot] = useState<string | null>(initial.slot)
  const [details, setDetails] = useState<BookingDetails>(initial.details)
  const [view, setView] = useState<MonthView>(() => (initial.date ? monthOf(initial.date) : bookingWindow.firstMonth))
  const [showErrors, setShowErrors] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const cells = useMemo(() => getMonthCells(view, now), [view, now])
  const detailsAreValid = details.name.trim().length >= 2 && validPhone(details.phone) && validEmail(details.email)
  const planned = Boolean(mode && date && slot)
  /* A refresh or a history jump can land on a step whose earlier answers are
     gone; fall back to the last step that is actually complete. */
  const step: BookingStep = !planned ? 1 : stepState === 3 && !detailsAreValid ? 2 : stepState

  // Give this history entry a state the first time the page opens.
  useEffect(() => {
    if (readNav()) return
    const fromSite = takeOpenedFromSite()
    window.history.replaceState({ ...(window.history.state ?? {}), bookingDepth: 0, step: 1, fromSite }, '')
  }, [])

  useEffect(() => {
    const onPop = () => {
      const nav = readNav()
      if (nav) setStepState(nav.step)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    saveBookingDraft({ mode, date, slot, details })
  }, [mode, date, slot, details])

  useEffect(() => {
    const previous = document.title
    document.title = 'Book a consultation with the Founder | American Hairline'
    return () => {
      document.title = previous
    }
  }, [])

  // A new step starts at the top, with the heading announced to screen readers.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const goTo = (next: BookingStep) => {
    const nav = readNav()
    window.history.pushState({ bookingDepth: (nav?.bookingDepth ?? 0) + 1, step: next, fromSite: nav?.fromSite ?? false }, '')
    setStepState(next)
  }

  const goBack = () => {
    const nav = readNav()
    if (nav && nav.bookingDepth > 0 && nav.step === step) window.history.back()
    else setStepState((step - 1) as BookingStep)
  }

  const close = () => {
    const nav = readNav()
    if (nav?.fromSite) window.history.go(-(nav.bookingDepth + 1))
    else window.location.hash = '#/'
  }

  /* Booked times differ by date, so a time picked on one day may not exist on
     the next: drop it rather than carry a booked slot forward. */
  const selectDate = (iso: string) => {
    setDate(iso)
    if (slot && isSlotBooked(iso, slot)) setSlot(null)
  }

  const continueFromDetails = () => {
    setShowErrors(true)
    if (detailsAreValid) {
      setPaymentError('')
      goTo(3)
    }
  }

  /* Hands the booking to the thank-you route. */
  const goToConfirmation = (extra: { reference?: string; preview?: boolean }) => {
    if (!mode || !date || !slot) return
    saveBookingConfirmation({ mode, date, slot, fee: consultationFee, ...details, ...extra })
    clearBookingDraft()
    window.location.hash = bookingConfirmationRoute
  }

  const startPayment = async () => {
    if (!mode || !date || !slot || !detailsAreValid || paying) return
    setPaymentError('')

    if (!createOrderUrl || !verifyPaymentUrl) {
      // Razorpay is not connected: show the thank-you page as a visual preview,
      // flagged so it says no payment was taken. Verified bookings never set it.
      goToConfirmation({ preview: true })
      return
    }

    setPaying(true)
    try {
      const orderResponse = await fetch(createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, date, slot, ...details }),
      })
      if (!orderResponse.ok) throw new Error('We could not start the secure payment. Please try again.')

      const order = await orderResponse.json() as {
        keyId?: string
        orderId?: string
        amount?: number
        currency?: string
      }
      if (!order.keyId || !order.orderId || !order.amount || !order.currency) {
        throw new Error('The payment order was incomplete. Please try again.')
      }

      if (!await loadRazorpay() || !window.Razorpay) {
        throw new Error('Razorpay could not load. Check your connection and try again.')
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'American Hairline',
        description: 'Private consultation with Vinitt Dessai',
        order_id: order.orderId,
        prefill: details,
        notes: { mode, tentativeDate: date, tentativeSlot: slot },
        theme: { color: '#1769ff' },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (payment) => {
          try {
            const verificationResponse = await fetch(verifyPaymentUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment, booking: { mode, date, slot, ...details } }),
            })
            if (!verificationResponse.ok) throw new Error('Payment verification is pending.')
            const result = await verificationResponse.json() as {
              verified?: boolean
              bookingReference?: string
            }
            if (!result.verified) throw new Error('Payment verification is pending.')
            goToConfirmation({ reference: result.bookingReference })
          } catch (error) {
            setPaymentError(
              error instanceof Error
                ? `${error.message} Please call 9222666111 before retrying payment.`
                : 'Payment verification is pending. Please call 9222666111.',
            )
          } finally {
            setPaying(false)
          }
        },
      })

      checkout.on('payment.failed', (response) => {
        setPaymentError(response.error?.description ?? 'Payment did not complete. Please try again.')
        setPaying(false)
      })
      checkout.open()
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment could not start. Please try again.')
      setPaying(false)
    }
  }

  const modeLabel = mode === 'online' ? 'Online video call' : mode === 'in-person' ? 'In person at a salon' : null
  const longDate = date ? formatLongDate(date) : null
  const nameError = showErrors && details.name.trim().length < 2
  const phoneError = showErrors && !validPhone(details.phone)
  const emailError = showErrors && !validEmail(details.email)

  return (
    <div className="bookPage">
      <header className="bookPage__bar">
        <a className="bookPage__logo" href="#/" aria-label="American Hairline — home">
          <img src="/brand/logo.png" alt="American Hairline" width={416} height={164} />
        </a>
        <button type="button" className="bookPage__close" onClick={close}>
          <X aria-hidden="true" />
          <span>Close</span>
        </button>
      </header>

      <main className="bookPage__main">
        <div className="bookPage__layout">
          <section className="bookFlow" aria-labelledby="book-title">
            <header className="bookFlow__head">
              <p className="bookFlow__step">{`Step ${step} of 3`}</p>
              <h1 id="book-title" ref={headingRef} tabIndex={-1}>Book your private consultation</h1>
              <p className="bookFlow__lede">
                A private 45–60 minute conversation with <strong>Vinitt Dessai</strong>, Founder and Hair Expert.
              </p>
            </header>

            <div className="bookFlow__progress" aria-hidden="true">
              {[1, 2, 3].map((item) => <span key={item} data-active={item <= step ? 'true' : 'false'} />)}
            </div>
            <p className="bookFlow__stepTitle" aria-live="polite">{stepTitles[step]}</p>

            {step === 1 && (
              <div className="bookFlow__body">
                <fieldset>
                  <legend>How would you like to meet?</legend>
                  <div className="bookFlow__choices bookFlow__choices--mode">
                    <button type="button" aria-pressed={mode === 'online'} onClick={() => setMode('online')}>
                      <Video aria-hidden="true" /><span><strong>Online</strong><small>Private video call</small></span>{mode === 'online' && <Check aria-hidden="true" />}
                    </button>
                    <button type="button" aria-pressed={mode === 'in-person'} onClick={() => setMode('in-person')}>
                      <Building2 aria-hidden="true" /><span><strong>In person</strong><small>At an American Hairline salon</small></span>{mode === 'in-person' && <Check aria-hidden="true" />}
                    </button>
                  </div>
                </fieldset>

                <div className="bookFlow__when">
                  <fieldset className="bookFlow__cal">
                    <legend>Choose a tentative date</legend>
                    <div className="bookFlow__calNav">
                      <button
                        type="button"
                        onClick={() => setView(shiftMonth(view, -1))}
                        disabled={monthIndex(view) <= monthIndex(bookingWindow.firstMonth)}
                        aria-label="Previous month"
                      ><ChevronLeft aria-hidden="true" /></button>
                      <p aria-live="polite">{monthTitle(view)}</p>
                      <button
                        type="button"
                        onClick={() => setView(shiftMonth(view, 1))}
                        disabled={monthIndex(view) >= monthIndex(bookingWindow.lastMonth)}
                        aria-label="Next month"
                      ><ChevronRight aria-hidden="true" /></button>
                    </div>
                    <div className="bookFlow__calWeek" aria-hidden="true">
                      {weekdayInitials.map((initial, index) => <span key={index}>{initial}</span>)}
                    </div>
                    <div className="bookFlow__calDays">
                      {cells.map((cell, index) => cell ? (
                        <button
                          type="button"
                          key={cell.iso}
                          data-state={cell.state}
                          disabled={cell.state !== 'open'}
                          aria-pressed={date === cell.iso}
                          aria-label={cell.state === 'closed' ? `${cell.long}, closed` : cell.long}
                          onClick={() => selectDate(cell.iso)}
                        >{cell.day}</button>
                      ) : <span key={`pad-${index}`} aria-hidden="true" />)}
                    </div>
                    <p className="bookFlow__hours">Open {openingHours} · Closed on Mondays</p>
                  </fieldset>

                  <fieldset className="bookFlow__time">
                    <legend>Choose a tentative time</legend>
                    {date ? (
                      <div className="bookFlow__choices bookFlow__choices--slots">
                        {slotTimes.map((time) => {
                          const booked = isSlotBooked(date, time)
                          return (
                            <button
                              type="button"
                              key={time}
                              disabled={booked}
                              data-booked={booked ? 'true' : 'false'}
                              aria-pressed={slot === time}
                              aria-label={booked ? `${time}, booked` : time}
                              onClick={() => setSlot(time)}
                            >
                              <span>{time}</span>{booked && <small>Booked</small>}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="bookFlow__pick">Pick a date to see the times.</p>
                    )}
                  </fieldset>
                </div>

                <p className="bookFlow__hint">
                  <Clock3 aria-hidden="true" />
                  <span><strong>These are tentative dates.</strong> One of our team will call you back and give you a final confirmation.</span>
                </p>

                <div className="bookFlow__actions">
                  <button className="bookFlow__primary" type="button" disabled={!planned} onClick={() => goTo(2)}>
                    Continue <ArrowUpRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bookFlow__body">
                <div className="bookFlow__fields">
                  <label>Full name<input type="text" autoComplete="name" value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} aria-invalid={nameError} />{nameError && <small>Please enter your full name.</small>}</label>
                  <label>Phone number<input type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} aria-invalid={phoneError} />{phoneError && <small>Enter a valid 10-digit mobile number.</small>}</label>
                  <label>Email address<input type="email" autoComplete="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} aria-invalid={emailError} />{emailError && <small>Enter a valid email address.</small>}</label>
                </div>
                <div className="bookFlow__actions">
                  <button type="button" className="bookFlow__back" onClick={goBack}><ArrowLeft aria-hidden="true" />Back</button>
                  <button className="bookFlow__primary" type="button" onClick={continueFromDetails}>Review booking <ArrowUpRight aria-hidden="true" /></button>
                </div>
              </div>
            )}

            {step === 3 && mode && date && slot && (
              <div className="bookFlow__body">
                <dl className="bookFlow__review">
                  <div><dt>Consultation</dt><dd>{modeLabel}</dd></div>
                  <div><dt>Tentative date</dt><dd>{longDate}</dd></div>
                  <div><dt>Tentative time</dt><dd>{slot}</dd></div>
                  <div><dt>Consultation fee</dt><dd>{consultationFee}</dd></div>
                </dl>
                <p className="bookFlow__notice"><Clock3 aria-hidden="true" /><span>This is a preferred date and time, not a confirmed appointment. One of our team will call you after payment and give you a final confirmation.</span></p>
                {paymentError && <p className="bookFlow__paymentError" role="alert">{paymentError}</p>}
                <div className="bookFlow__actions">
                  <button type="button" className="bookFlow__back" onClick={goBack}><ArrowLeft aria-hidden="true" />Back</button>
                  <button className="bookFlow__primary" type="button" onClick={startPayment} disabled={paying}><CreditCard aria-hidden="true" />{paying ? 'Opening Razorpay…' : `Pay ${consultationFee} securely`}</button>
                </div>
                <p className="bookFlow__secure"><ShieldCheck aria-hidden="true" />Payment is processed securely by Razorpay.</p>
              </div>
            )}
          </section>

          <aside className="bookSummary" aria-label="Your booking">
            <img
              src="/book/founder-480.webp"
              srcSet="/book/founder-480.webp 480w, /book/founder-900.webp 900w"
              sizes="(min-width: 900px) 360px, 0px"
              alt="Vinitt Dessai, Founder and Hair Expert"
              width={900}
              height={675}
              decoding="async"
            />
            <div className="bookSummary__body">
              <p className="bookSummary__eyebrow">Your private consultation</p>
              <h2>Vinitt Dessai</h2>
              <p className="bookSummary__role">Founder and Hair Expert</p>
              <dl>
                <div><dt>Format</dt><dd data-empty={modeLabel ? 'false' : 'true'}>{modeLabel ?? 'Not chosen yet'}</dd></div>
                <div><dt>Date</dt><dd data-empty={longDate ? 'false' : 'true'}>{longDate ?? 'Not chosen yet'}</dd></div>
                <div><dt>Time</dt><dd data-empty={slot ? 'false' : 'true'}>{slot ?? 'Not chosen yet'}</dd></div>
                <div><dt>Fee</dt><dd>{consultationFee}</dd></div>
              </dl>
              <p className="bookSummary__note"><Clock3 aria-hidden="true" />Tentative until our team calls you.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
