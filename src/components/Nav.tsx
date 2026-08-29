import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, LayoutGrid, X } from 'lucide-react'
import { nav, NavDropdownItem, NavItem } from '../site'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/')
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleHash = () => setCurrentHash(window.location.hash || '#/')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const toggleMobileGroup = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isItemActive = (item: NavItem) => {
    if (item.href === currentHash || (item.href === '#/' && (currentHash === '' || currentHash === '#/' || currentHash === '#home'))) {
      return true
    }
    if (item.items) {
      return item.items.some(
        (sub) =>
          sub.href === currentHash ||
          (sub.subItems && sub.subItems.some((nested) => nested.href === currentHash)),
      )
    }
    return false
  }

  return (
    <header className="nav">
      <div className="wrap">
        <div className="nav__in">
          <a className="nav__mark" href="#/" aria-label="American Hairline — home">
            <img src="/brand/logo.png" alt="American Hairline" width={416} height={164} />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((item) => {
              const hasDropdown = Boolean(item.items && item.items.length > 0)
              const active = isItemActive(item)

              if (!hasDropdown) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`nav__link${active ? ' nav__link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <div key={item.label} className="nav__item nav__item--dropdown">
                  <a
                    href={item.href}
                    className={`nav__link nav__link--trigger${active ? ' nav__link--active' : ''}`}
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className="nav__chevron" />
                  </a>

                  <div className="nav__dropdown" role="menu">
                    <div className="nav__dropdownList">
                      {item.items?.map((subItem: NavDropdownItem) => {
                        const hasSubmenu = Boolean(subItem.subItems && subItem.subItems.length > 0)
                        const subActive =
                          subItem.href === currentHash ||
                          subItem.subItems?.some((n) => n.href === currentHash)

                        if (!hasSubmenu) {
                          return (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className={`nav__dropdownLink${subActive ? ' nav__dropdownLink--active' : ''}`}
                              role="menuitem"
                            >
                              {subItem.label}
                            </a>
                          )
                        }

                        return (
                          <div key={subItem.label} className="nav__submenuWrap">
                            <a
                              href={subItem.href}
                              className={`nav__dropdownLink nav__dropdownLink--hasSub${subActive ? ' nav__dropdownLink--active' : ''}`}
                              role="menuitem"
                            >
                              <span>{subItem.label}</span>
                              <ChevronRight size={14} className="nav__subChevron" />
                            </a>

                            <div className="nav__submenu" role="menu">
                              <div className="nav__submenuList">
                                {subItem.subItems?.map((nested) => (
                                  <a
                                    key={nested.label}
                                    href={nested.href}
                                    className={`nav__submenuLink${nested.href === currentHash ? ' nav__submenuLink--active' : ''}`}
                                    role="menuitem"
                                  >
                                    {nested.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="nav__actions">
            <a className="btn btn--sm" href="#book">
              Book Now
            </a>

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

        {/* Mobile Navigation Drawer / Panel */}
        <div className="nav__panel" id="nav-panel" data-open={open}>
          <ul className="nav__mobileList">
            {nav.map((item) => {
              const hasDropdown = Boolean(item.items && item.items.length > 0)
              const isExpanded = mobileExpanded[item.label]
              const active = isItemActive(item)

              if (!hasDropdown) {
                return (
                  <li key={item.href} className="nav__mobileItem">
                    <a
                      href={item.href}
                      className={`nav__mobileLink${active ? ' nav__mobileLink--active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }

              return (
                <li key={item.label} className="nav__mobileItem nav__mobileItem--accordion">
                  <div className="nav__mobileAccordionHead">
                    <a
                      href={item.href}
                      className={`nav__mobileLink${active ? ' nav__mobileLink--active' : ''}`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                    <button
                      type="button"
                      className="nav__mobileToggle"
                      aria-label={`Toggle ${item.label}`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleMobileGroup(item.label)}
                    >
                      <ChevronDown
                        size={18}
                        className={`nav__mobileToggleIcon${isExpanded ? ' nav__mobileToggleIcon--open' : ''}`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <ul className="nav__mobileSublist">
                      {item.items?.map((subItem) => {
                        const hasSubmenu = Boolean(subItem.subItems && subItem.subItems.length > 0)
                        const subActive =
                          subItem.href === currentHash ||
                          subItem.subItems?.some((n) => n.href === currentHash)

                        return (
                          <li key={subItem.label} className="nav__mobileSubitem">
                            <a
                              href={subItem.href}
                              className={`nav__mobileSublink${subActive ? ' nav__mobileSublink--active' : ''}`}
                              onClick={() => setOpen(false)}
                            >
                              {subItem.label}
                            </a>

                            {hasSubmenu && (
                              <ul className="nav__mobileNestedList">
                                {subItem.subItems?.map((nested) => (
                                  <li key={nested.label}>
                                    <a
                                      href={nested.href}
                                      className={`nav__mobileNestedLink${nested.href === currentHash ? ' nav__mobileNestedLink--active' : ''}`}
                                      onClick={() => setOpen(false)}
                                    >
                                      {nested.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          <a className="btn btn--sm nav__mobileBtn" href="#book" onClick={() => setOpen(false)}>
            Book Now
          </a>
        </div>
      </div>
    </header>
  )
}
