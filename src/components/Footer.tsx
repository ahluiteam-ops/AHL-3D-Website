import { useCallback } from 'react'
import { ChevronsUp, Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react'
import {
  footerBlurb,
  footerColumns,
  footerContact,
  footerLegal,
  footerMarquee,
  footerSocials,
  footerWordmark,
  type SocialIcon,
} from '../site'

/** X has no lucide glyph, so it is drawn here rather than approximated with
 *  one that means something else. */
function XMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M17.6 3h3.2l-7 8 8.2 10h-6.4l-5-6.1-5.7 6.1H1.7l7.5-8.6L1.3 3h6.6l4.5 5.6L17.6 3Zm-1.1 16.2h1.8L7.6 4.7H5.7l10.8 14.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

const socialIcons: Record<SocialIcon, () => JSX.Element> = {
  facebook: () => <Facebook size={18} strokeWidth={0} fill="currentColor" />,
  instagram: () => <Instagram size={18} strokeWidth={2} />,
  x: () => <XMark />,
  youtube: () => <Youtube size={18} strokeWidth={0} fill="currentColor" />,
}

/**
 * The footer.
 *
 * Built to the reference recording's treatment: the site's name set enormous
 * across the top as **outlined type**, wide enough that it runs off both edges
 * and is cropped by the viewport, with a looping marquee directly beneath it.
 * The client's own footer content — blurb, socials, link columns, contact and
 * the legal line — sits under that arrangement rather than being replaced by
 * it, which is what "the same, with more content" asks for.
 *
 * The reference loops one phrase; this loops six, alternating consultative
 * invitations with the brand's proof numbers, separated by an asterisk.
 *
 * The marquee is two identical copies of the same list translated by exactly
 * -50%. That is the whole trick: at -50% the second copy sits precisely where
 * the first began, so the restart is invisible and there is no measuring and
 * no JavaScript. It pauses on hover, and `prefers-reduced-motion` stops it
 * outright — a permanent horizontal crawl is one of the clearest things that
 * setting is asking you not to do.
 */
export function Footer() {
  const toTop = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  return (
    <footer className="foot">
      {/* Outlined, oversized, and clipped by the section on purpose. */}
      <div className="foot__wordmark" aria-hidden="true">
        <span>{footerWordmark}</span>
      </div>

      <div className="foot__marquee">
        {[0, 1].map((copy) => (
          <ul
            className="foot__marqueeTrack"
            key={copy}
            aria-hidden={copy === 1 || undefined}
          >
            {footerMarquee.map((phrase) => (
              <li key={phrase}>
                {phrase}
                <span className="foot__star" aria-hidden="true">
                  ✱
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="foot__body wrap">
        <div className="foot__brand">
          <img
            className="foot__logo"
            src="/brand/logo.png"
            alt="American Hairline"
            width={416}
            height={164}
            loading="lazy"
          />
          <p className="foot__blurb">{footerBlurb}</p>

          <ul className="foot__socials">
            {footerSocials.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <li key={social.label}>
                  <a href={social.href} aria-label={social.label}>
                    <Icon />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {footerColumns.map((column) => (
          <nav className="foot__col" key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="foot__col foot__col--contact">
          <h2>{footerContact.title}</h2>
          <ul>
            <li>
              <a href={`tel:${footerContact.phone}`}>
                <Phone size={15} strokeWidth={2} aria-hidden="true" />
                {footerContact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${footerContact.email}`}>
                <Mail size={15} strokeWidth={2} aria-hidden="true" />
                {footerContact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot__legal wrap">
        <p>{footerLegal}</p>
      </div>

      <button type="button" className="foot__top" onClick={toTop}>
        <ChevronsUp size={20} strokeWidth={2.4} aria-hidden="true" />
        <span className="sr-only">Back to top</span>
      </button>
    </footer>
  )
}
