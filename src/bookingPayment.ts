/* Shared pieces of the founder-consultation flow that are not layout: the fee,
 * the Razorpay endpoints, the checkout loader and the field validators.
 *
 * The browser never creates or verifies a payment by itself. Live payment needs
 * two server endpoints supplied through Vite env variables; while either is
 * unset the flow ends on the thank-you page as a flagged preview. Never put a
 * Razorpay key secret in the browser. */

export type ConsultationMode = 'online' | 'in-person'

export type BookingDetails = {
  name: string
  phone: string
  email: string
}

export type RazorpaySuccess = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: BookingDetails
  notes: Record<string, string>
  theme: { color: string }
  modal: { ondismiss: () => void }
  handler: (response: RazorpaySuccess) => void
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export const consultationFee = '₹5,000'
export const createOrderUrl = import.meta.env.VITE_RAZORPAY_CREATE_ORDER_URL?.trim()
export const verifyPaymentUrl = import.meta.env.VITE_RAZORPAY_VERIFY_PAYMENT_URL?.trim()

export const emptyDetails: BookingDetails = { name: '', phone: '', email: '' }

export function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]')
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true })
      existing.addEventListener('error', () => resolve(false), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

export function validPhone(phone: string) {
  return phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').length === 10
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
