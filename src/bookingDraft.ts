/* What the visitor has chosen so far on `#/book-consultation`, so a refresh or
 * a trip back through the browser history does not lose it. `sessionStorage`
 * only: it dies with the tab and never reaches the URL or a referrer.
 *
 * Also carries the one-shot flag that says the booking page was opened from a
 * page of this site, so Close can step back to that page rather than jump home. */
import { emptyDetails, type BookingDetails, type ConsultationMode } from './bookingPayment'
import { isBookableDate, isSlotBooked } from './bookingSlots'

export const bookingPageRoute = '#/book-consultation'

export type BookingDraft = {
  mode: ConsultationMode | null
  date: string | null
  slot: string | null
  details: BookingDetails
}

const draftKey = 'ah-booking-draft'
const originKey = 'ah-booking-from-site'

export const emptyDraft: BookingDraft = { mode: null, date: null, slot: null, details: emptyDetails }

export function saveBookingDraft(draft: BookingDraft) {
  try {
    window.sessionStorage.setItem(draftKey, JSON.stringify(draft))
  } catch {
    /* storage blocked: the flow still works, it just will not survive a refresh */
  }
}

export function clearBookingDraft() {
  try {
    window.sessionStorage.removeItem(draftKey)
  } catch {
    /* nothing to clear */
  }
}

/* A stored date that has since closed, or a time that is booked on it, is
   dropped rather than carried into a booking that cannot be made. */
export function readBookingDraft(now: Date = new Date()): BookingDraft {
  try {
    const raw = window.sessionStorage.getItem(draftKey)
    if (!raw) return emptyDraft
    const value = JSON.parse(raw) as Partial<BookingDraft>
    const mode = value.mode === 'online' || value.mode === 'in-person' ? value.mode : null
    const date = typeof value.date === 'string' && isBookableDate(value.date, now) ? value.date : null
    const slot = date && typeof value.slot === 'string' && !isSlotBooked(date, value.slot) ? value.slot : null
    const stored = (value.details ?? {}) as Partial<BookingDetails>
    return {
      mode,
      date,
      slot,
      details: {
        name: typeof stored.name === 'string' ? stored.name : '',
        phone: typeof stored.phone === 'string' ? stored.phone : '',
        email: typeof stored.email === 'string' ? stored.email : '',
      },
    }
  } catch {
    return emptyDraft
  }
}

export function markOpenedFromSite() {
  try {
    window.sessionStorage.setItem(originKey, '1')
  } catch {
    /* Close will fall back to the homepage */
  }
}

/* Read once and cleared, so a later direct visit is not mistaken for one that
   came from a page of this site. */
export function takeOpenedFromSite(): boolean {
  try {
    const flag = window.sessionStorage.getItem(originKey) === '1'
    window.sessionStorage.removeItem(originKey)
    return flag
  } catch {
    return false
  }
}
