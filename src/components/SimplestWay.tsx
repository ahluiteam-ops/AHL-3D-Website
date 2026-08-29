import { useCallback, useRef } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import {
  simplestWayAction,
  simplestWayEyebrow,
  simplestWayItems,
  simplestWayStatement,
  simplestWayTitle,
} from '../site'

function AnalogyCard({
  item,
  index,
  shown,
  reduced,
}: {
  item: (typeof simplestWayItems)[number]
  index: number
  shown: boolean
  reduced: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)

  const onMove = useCallback((event: React.PointerEvent<HTMLLIElement>) => {
    const element = ref.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    element.style.setProperty('--mx', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    element.style.setProperty('--my', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
  }, [])

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty('--mx', '50%')
    ref.current?.style.setProperty('--my', '0%')
  }, [])

  return (
    <motion.li
      className="simplest__card"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={shown || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{
        duration: reduced ? 0 : 0.58,
        delay: reduced ? 0 : 0.12 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduced ? undefined : { y: -3 }}
    >
      <span className="simplest__spot" aria-hidden="true" />
      <span className="simplest__icon" aria-hidden="true">
        <img src={item.icon} alt="" width="2040" height="2040" decoding="async" />
      </span>
      <span className="simplest__copy">
        <strong>{item.title}</strong>
        <span>{item.body}</span>
      </span>
    </motion.li>
  )
}

/** Clothing analogy explaining generic patches versus custom hair systems. */
export function SimplestWay() {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  return (
    <section className="simplest" aria-labelledby="simplest-title">
      <div className="wrap">
        <div
          className="simplest__panel"
          ref={ref}
          data-shown={shown || reduced ? 'true' : 'false'}
        >
          <div className="simplest__in">
            <p className="simplest__eyebrow">
              <MessageCircle size={15} strokeWidth={2.2} aria-hidden="true" />
              {simplestWayEyebrow}
            </p>

            <h2 className="simplest__title" id="simplest-title">
              {simplestWayTitle}
            </h2>

            <ul className="simplest__cards">
              {simplestWayItems.map((item, index) => (
                <AnalogyCard
                  item={item}
                  index={index}
                  shown={shown}
                  reduced={reduced}
                  key={item.title}
                />
              ))}
            </ul>

            <p className="simplest__statement">
              <span>{simplestWayStatement.lead}</span>{' '}
              <strong>{simplestWayStatement.emphasis}</strong>
            </p>

            <a className="simplest__cta" href={simplestWayAction.href}>
              <span>{simplestWayAction.label}</span>
              <span className="simplest__ctaIcon" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={2.4} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
