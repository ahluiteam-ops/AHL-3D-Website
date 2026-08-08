import { useState } from 'react'
import { LayoutGrid, X } from 'lucide-react'
import { nav } from '../site'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="wrap">
        <div className="nav__in">
          <a className="nav__mark" href="#home" aria-label="American Hairline — home">
            <img src="/brand/logo.png" alt="American Hairline" width={416} height={164} />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.current ? 'page' : undefined}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="btn btn--sm" href="#book">
              Book Now
            </a>

            {/* One menu control at every width: the bar's links collapse into
                this panel on small screens, and it stays the "all sections"
                menu on large ones. */}
            <button
              className="nav__grid"
              type="button"
              aria-expanded={open}
              aria-controls="nav-panel"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} strokeWidth={2.5} /> : <LayoutGrid size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        <div className="nav__panel" id="nav-panel" data-open={open}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--sm" href="#book" onClick={() => setOpen(false)}>
            Book Now
          </a>
        </div>
      </div>
    </header>
  )
}
