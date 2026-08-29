import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import {
  whichOptionTitle,
  whichOptionChoices,
  type OptionChoiceKey,
} from '../site'

/**
 * "Which Option Feels More Like You?"
 *
 * Interactive toggle section placed directly below Hero on the Stick-On or Clip-On page.
 * Styled with the dark stage theme matching the homepage FAQ section:
 * - Dark ambient ground with diagonal light sheen
 * - Segmented pill switch between "Stick-On" and "Clip-On"
 * - Translucent glassmorphic decision card with checklist items
 * - Animated tab transition and primary CTA button
 */
export function WhichOption() {
  const [activeChoice, setActiveChoice] = useState<OptionChoiceKey>('stick-on')
  const { ref, shown } = useReveal<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  const current = whichOptionChoices[activeChoice]

  return (
    <section className="whichOption" aria-labelledby="which-option-title">
      <div
        className="whichOption__in wrap"
        data-shown={shown ? 'true' : 'false'}
        ref={ref}
      >
        {/* Section Header */}
        <header className="whichOption__head">
          <h2 className="whichOption__title" id="which-option-title">
            {whichOptionTitle}
          </h2>
        </header>

        {/* Main Glass Card */}
        <div className="whichOption__card">
          {/* Segmented Pill Switcher */}
          <div
            className="whichOption__tabs"
            role="tablist"
            aria-label="Hair system options"
          >
            <button
              type="button"
              role="tab"
              id="opt-tab-stick-on"
              aria-selected={activeChoice === 'stick-on'}
              aria-controls="opt-panel-stick-on"
              className="whichOption__tab"
              data-active={activeChoice === 'stick-on' ? 'true' : 'false'}
              onClick={() => setActiveChoice('stick-on')}
            >
              <span>Stick-On</span>
              {activeChoice === 'stick-on' && (
                <motion.div
                  className="whichOption__tabPill"
                  layoutId="whichOptionActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>

            <button
              type="button"
              role="tab"
              id="opt-tab-clip-on"
              aria-selected={activeChoice === 'clip-on'}
              aria-controls="opt-panel-clip-on"
              className="whichOption__tab"
              data-active={activeChoice === 'clip-on' ? 'true' : 'false'}
              onClick={() => setActiveChoice('clip-on')}
            >
              <span>Clip-On</span>
              {activeChoice === 'clip-on' && (
                <motion.div
                  className="whichOption__tabPill"
                  layoutId="whichOptionActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          </div>

          {/* Prompt Header */}
          <div className="whichOption__intro">
            <h3>{current.intro}</h3>
          </div>

          {/* Checklist items with animated transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              role="tabpanel"
              id={`opt-panel-${current.id}`}
              aria-labelledby={`opt-tab-${current.id}`}
              className="whichOption__panel"
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ul className="whichOption__list">
                {current.criteria.map((item, idx) => (
                  <li className="whichOption__item" key={idx}>
                    <span className="whichOption__check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="whichOption__itemText">
                      {item.prefix && `${item.prefix} `}
                      <strong>{item.bold}</strong>
                      {item.suffix && ` ${item.suffix}`}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="whichOption__ctaWrap">
                <a className="whichOption__btn" href={current.href}>
                  <span>{current.cta}</span>
                  <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
