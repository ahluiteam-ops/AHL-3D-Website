const phone = '9222666111'
const whatsappHref = `https://wa.me/91${phone}?text=${encodeURIComponent('Hi American Hairline, I would like to know more.')}`

export function FloatingContact() {
  return (
    <aside className="floatingContact" aria-label="Quick contact options">
      <a
        className="floatingContact__button floatingContact__button--whatsapp"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with American Hairline on WhatsApp"
      >
        <img src="/contact/whatsapp.svg" alt="" width={76} height={76} />
        <span>WhatsApp</span>
      </a>
      <a
        className="floatingContact__button floatingContact__button--call"
        href={`tel:+91${phone}`}
        aria-label="Call American Hairline at 9222666111"
      >
        <img src="/contact/call.svg" alt="" width={76} height={76} />
        <span>Call us</span>
      </a>
    </aside>
  )
}
