import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { usePrefersReducedMotion, useReveal } from '../hooks'
import { CardStack, type CardStackItem } from './ui/card-stack'
import { deckCards, deckTitle } from '../site'

/** The artwork is 1472 x 1840. */
const CARD_RATIO = 1472 / 1840

/** Closed is not 0: a perfectly square stack reads as one thick card rather
 *  than a deck waiting to open. */
const CLOSED = 0.08

/** Openness is React state, not a motion value, because the stack animates
 *  toward it on a spring rather than being written every frame. Quantising the
 *  scroll to this many steps keeps the re-render count sane; the spring makes
 *  the steps invisible. */
const STEPS = 40

const items: CardStackItem[] = deckCards.map((card, i) => ({
  id: i,
  title: card.name,
  imageSrc: card.image,
}))

/**
 * "Before And After, In Their Own Words".
 *
 * Two mechanisms, deliberately separate, which is what the `openness` prop
 * added to `ui/card-stack.tsx` is for:
 *
 * - **Scroll opens the hand.** The section pins and vertical scroll runs
 *   openness from a near-closed stack to the full fan, which is the reference
 *   recording's move.
 * - **Clicking a card centres it.** That is the component's own behaviour, and
 *   it keeps working at every stage of the opening, because the spread and the
 *   selection are different things.
 *
 * The five cards are finished artwork — the before/after portraits, the name
 * chip and the quote are all baked into each PNG — so `renderCard` draws the
 * picture and nothing else, `variant="bare"` drops the component's own border
 * and radius, and the alt text carries the words that exist only inside the
 * image.
 */
export function Deck() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { ref: headRef, shown } = useReveal<HTMLDivElement>()
  const [still, setStill] = useState(true)
  const [size, setSize] = useState({ w: 418, h: 522, narrow: false })
  const [open, setOpen] = useState(CLOSED)

  useEffect(() => {
    const read = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      let h = Math.min(540, Math.max(300, vh * 0.58))
      let w = h * CARD_RATIO
      const maxW = vw * 0.72
      if (w > maxW) {
        w = maxW
        h = w / CARD_RATIO
      }
      const narrow = vw < 901
      setSize({ w: Math.round(w), h: Math.round(h), narrow })
      setStill(reduced || narrow)
    }
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [reduced])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const eased = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  })

  const openness = useTransform(eased, [0.05, 0.62], [CLOSED, 1], {
    clamp: true,
  })

  useMotionValueEvent(openness, 'change', (value) => {
    if (still) return
    setOpen(Math.round(value * STEPS) / STEPS)
  })

  /* `change` only fires on a change, so a page that loads with the section
     already at some scroll position would never hear one. Read it once. */
  useEffect(() => {
    setOpen(Math.round(openness.get() * STEPS) / STEPS)
  }, [openness])

  /* Unpinned, there is no scroll to open the hand, so it starts open. */
  const openNow = still ? 1 : open

  return (
    <section
      className={`deck${still ? ' deck--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="deck-title"
    >
      <div className="deck__pin">
        <div className="deck__in wrap">
          <div
            className="deck__head"
            data-shown={shown ? 'true' : 'false'}
            ref={headRef}
          >
            <h2 className="deck__title" id="deck-title">
              {deckTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <CardStack
            items={items}
            className="deck__stack"
            variant="bare"
            initialIndex={2}
            openness={openNow}
            /* Three cards on a phone, all five on a desktop: the fan needs
               width the phone has not got. */
            maxVisible={size.narrow ? 3 : 5}
            cardWidth={size.w}
            cardHeight={size.h}
            overlap={size.narrow ? 0.78 : 0.56}
            spreadDeg={size.narrow ? 16 : 30}
            perspectivePx={1400}
            depthPx={90}
            tiltXDeg={7}
            activeLiftPx={18}
            activeScale={1.04}
            inactiveScale={0.93}
            springStiffness={220}
            springDamping={26}
            loop
            showDots={false}
            renderCard={(item) => {
              const card = deckCards[Number(item.id)]
              return (
                <img
                  className="deck__art"
                  src={card.image}
                  /* The name and the quote exist only inside the artwork, so
                     alt is the only route a screen reader has to them. */
                  alt={`${card.name}, before and after his hair system. He says: “${card.quote}”`}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              )
            }}
          />
        </div>
      </div>
    </section>
  )
}
