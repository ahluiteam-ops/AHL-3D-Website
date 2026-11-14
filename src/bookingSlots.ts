/* Dates and times offered by the founder-consultation dialog.
 *
 * Opening hours: Tuesday to Sunday, 11 AM to 8 PM; closed on Mondays. Slots
 * run hourly from 12 PM to 7 PM, so each one ends inside opening hours.
 *
 * ⚠ The "booked" state is presentational. There is no calendar behind it: the
 * team phones every visitor to confirm the final slot, so the grid only has to
 * look like a founder whose diary is genuinely busy. When a real availability
 * feed exists, replace `isSlotBooked` with a lookup and leave the rest alone. */

export const slotTimes = [
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
] as const

export const openingHours = '11 AM – 8 PM'

/* Days a visitor can pick, counted from tomorrow (today's hours may be gone). */
const bookingWindowDays = 30

const closedWeekday = 1 // Monday

/* Always shown as booked, on every date: the first and last of the day. */
const alwaysBooked = new Set<string>(['12:00 PM', '6:00 PM', '7:00 PM'])

/* The afternoon is the bookable core. Each date holds back up to two of these
   so neighbouring days do not look identical; at least three stay open. */
const openTimes = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const weekdayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const pad = (value: number) => String(value).padStart(2, '0')
const isoOf = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`

/* Parses `YYYY-MM-DD` as a calendar date with no time zone attached. */
function parseIso(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

export type MonthView = { year: number; month: number }

export type CalendarCell = {
  iso: string
  day: number
  /** `open` can be picked; `closed` is a Monday; `unavailable` is outside the booking window. */
  state: 'open' | 'closed' | 'unavailable'
  /** `Saturday, 14 November`, for accessible names. */
  long: string
}

/** First and last pickable day, as `YYYY-MM-DD`. */
export function getBookingWindow(now: Date = new Date()) {
  const first = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const last = new Date(now.getFullYear(), now.getMonth(), now.getDate() + bookingWindowDays)
  return {
    first: isoOf(first.getFullYear(), first.getMonth(), first.getDate()),
    last: isoOf(last.getFullYear(), last.getMonth(), last.getDate()),
    firstMonth: { year: first.getFullYear(), month: first.getMonth() } as MonthView,
    lastMonth: { year: last.getFullYear(), month: last.getMonth() } as MonthView,
  }
}

export const monthIndex = ({ year, month }: MonthView) => year * 12 + month

export function shiftMonth(view: MonthView, by: number): MonthView {
  const index = monthIndex(view) + by
  return { year: Math.floor(index / 12), month: index % 12 }
}

export function monthTitle(view: MonthView) {
  return `${months[view.month]} ${view.year}`
}

/** Sunday-first month grid: `null` pads the days before the 1st. */
export function getMonthCells(view: MonthView, now: Date = new Date()): (CalendarCell | null)[] {
  const { first, last } = getBookingWindow(now)
  const lead = new Date(view.year, view.month, 1).getDay()
  const length = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (CalendarCell | null)[] = Array.from({ length: lead }, () => null)

  for (let day = 1; day <= length; day += 1) {
    const iso = isoOf(view.year, view.month, day)
    const weekday = new Date(view.year, view.month, day).getDay()
    cells.push({
      iso,
      day,
      state: iso < first || iso > last ? 'unavailable' : weekday === closedWeekday ? 'closed' : 'open',
      long: `${weekdays[weekday]}, ${day} ${months[view.month]}`,
    })
  }
  return cells
}

/** `Saturday, 15 November 2026`, or null for anything that is not a real date. */
export function formatLongDate(iso: string | undefined): string | null {
  const date = iso ? parseIso(iso) : null
  if (!date) return null
  return `${weekdays[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function isSlotBooked(iso: string, time: string): boolean {
  const date = parseIso(iso)
  if (!date || date.getUTCDay() === closedWeekday) return true
  if (alwaysBooked.has(time)) return true
  const index = openTimes.indexOf(time)
  if (index === -1) return true
  const day = Math.floor(date.getTime() / 86_400_000)
  return index === day % 5 || index === (day * 2 + 3) % 5
}

/** True when `iso` is a real date inside the booking window and not a closed day. */
export function isBookableDate(iso: string, now: Date = new Date()): boolean {
  const date = parseIso(iso)
  if (!date || date.getUTCDay() === closedWeekday) return false
  const { first, last } = getBookingWindow(now)
  return iso >= first && iso <= last
}
