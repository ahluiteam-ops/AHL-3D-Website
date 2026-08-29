import { Check, X } from 'lucide-react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { carExampleCards, carExampleTitle } from '../site'

/**
 * The car analogy immediately before "Thin Base Vs. Thick Base".
 *
 * The outer motion article owns the one-shot entrance. A nested surface owns
 * the small hover lift, and the image owns its zoom, so no two animation
 * systems write the same transform. This is the same transform-ownership rule
 * used by the site's deeper card effects, kept deliberately flat here because
 * these cards explain a comparison rather than acting as controls.
 */
export function CarExample() {
  const still = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="carExample" aria-labelledby="car-example-title">
      <div className="wrap">
        <div
          className="carExample__in"
          ref={ref}
          data-shown={shown ? 'true' : 'false'}
        >
          <motion.h2
            className="carExample__title"
            id="car-example-title"
            aria-label={carExampleTitle.join(' ')}
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={
              still
                ? { duration: 0 }
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {carExampleTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.h2>

          <div className="carExample__grid">
            {carExampleCards.map((card, cardIndex) => {
              const titleId = `car-example-card-${cardIndex + 1}`

              return (
                <motion.article
                  className="carExample__card"
                  key={card.title}
                  aria-labelledby={titleId}
                  initial={false}
                  animate={
                    shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
                  }
                  transition={
                    still
                      ? { duration: 0 }
                      : {
                          duration: 0.62,
                          delay: 0.08 + cardIndex * 0.11,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                >
                  <div className="carExample__surface">
                    <div className="carExample__media">
                      <img
                        src={card.image.src}
                        alt={card.image.alt}
                        width={card.image.width}
                        height={card.image.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="carExample__body">
                      <header className="carExample__cardHead">
                        <h3 className="carExample__cardTitle" id={titleId}>
                          {card.title}
                        </h3>
                        <p className="carExample__formula">{card.formula}</p>
                      </header>

                      <div className="carExample__facts">
                        <div className="carExample__factGroup">
                          <h4>Pros:</h4>
                          <ul>
                            {card.pros.map((item) => (
                              <li key={item}>
                                <span
                                  className="carExample__mark carExample__mark--pro"
                                  aria-hidden="true"
                                >
                                  <Check size={12} strokeWidth={3.2} />
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="carExample__factGroup">
                          <h4>Cons:</h4>
                          <ul>
                            {card.cons.map((item) => (
                              <li key={item}>
                                <span
                                  className="carExample__mark carExample__mark--con"
                                  aria-hidden="true"
                                >
                                  <X size={12} strokeWidth={3.2} />
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p
                        className="carExample__note"
                        aria-label={`${card.note.lead} ${card.note.emphasis.join(' ')}`}
                      >
                        <span className="carExample__noteLine" aria-hidden="true">
                          <span>{card.note.lead} </span>
                          <strong>{card.note.emphasis[0]}</strong>
                        </span>
                        <strong
                          className="carExample__noteLine"
                          aria-hidden="true"
                        >
                          {card.note.emphasis[1]}
                        </strong>
                      </p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
