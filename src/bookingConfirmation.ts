/* What the founder-consultation dialog hands to `#/consultation-booked`.
 *
 * The dialog and the page are different routes, so the booking has to travel
 * somewhere. `sessionStorage` is enough: it survives a refresh of the thank-you
 * page, it dies with the tab, and nothing about a private consultation lingers
 * in the browser afterwards. Nothing is read from the URL, so a phone number
 * never ends up in history, a shared link or a referrer header. */

export type BookingConfirmation = {
  mode: 'online' | 'in-person'
  /** Preferred calendar date, `YYYY-MM-DD`. Absent in older stored bookings. */
  date?: string
  slot: string
  name: string
  phone: string
  email: string
  fee: string
  /** Server-issued, present only after a verified Razorpay payment. */
  reference?: string
  /** True while Razorpay is not connected: no payment was taken. */
  preview?: boolean
}

export const bookingConfirmationRoute = '#/consultation-booked'

const storageKey = 'ah-booking-confirmation'

export function saveBookingConfirmation(booking: BookingConfirmation) {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(booking))
  } catch {
    /* storage blocked — the page falls back to its generic wording */
  }
}

export function readBookingConfirmation(): BookingConfirmation | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<BookingConfirmation>
    if (
      (value.mode !== 'online' && value.mode !== 'in-person')
      || typeof value.slot !== 'string'
      || typeof value.name !== 'string'
      || typeof value.phone !== 'string'
    ) return null
    return value as BookingConfirmation
  } catch {
    return null
  }
}
