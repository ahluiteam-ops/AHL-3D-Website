import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'

/**
 * CircularGallery — cards standing on a circle, rotating about its axis.
 *
 * Ported from the supplied Next/Tailwind/shadcn component to this project's
 * stack: Vite, plain CSS, `motion/react`. What changed, and why:
 *
 * - **Every Tailwind utility became a rule in the `.cgal` block of
 *   `global.css`.** Adding Tailwind now would bring its preflight reset and
 *   restyle everything already built.
 * - **`cn()` is gone** — with plain CSS the class lists are short enough to
 *   join inline.
 * - **`NodeJS.Timeout` became `ReturnType<typeof setTimeout>`.** The original
 *   type is Node's; this runs in a browser and the project builds with
 *   `tsc -b`.
 * - **The scroll listener is gone and rotation is a prop.** The original read
 *   `window.scrollY` against the whole document, which works on its demo page
 *   where the gallery *is* the page. Here the document is around 30,000px
 *   tall, so the gallery would already be part-rotated before it came into
 *   view and a full scroll through its own section would turn it only a
 *   fraction of a revolution. The caller owns the scroll now — `Systems.tsx`
 *   uses `useScroll` against the section, the same as every other scrubbed
 *   section on this page.
 * - **Rotation is a motion value, not React state.** The original called
 *   `setRotation` inside a `requestAnimationFrame` loop, so it re-rendered the
 *   whole gallery every frame for the life of the page, on-screen or not. Here
 *   the angle and each card's opacity are motion values, which motion writes
 *   straight to the DOM — no re-render at all.
 * - **`still` renders a plain snap rail** instead of the ring, for reduced
 *   motion and narrow screens. Every animation in this project respects
 *   `prefers-reduced-motion`, and a 3D carousel is not something a phone
 *   should be asked to spin.
 *
 * Geometry note: the front card sits at `translateZ(radius)`, so it is that
 * much nearer the camera than the ring's axis and is magnified by
 * `perspective / (perspective − radius)`. Keep `radius` well under
 * `perspectivePx` — at parity the card is on the camera plane and projects
 * infinitely, which is the same trap the collection surfer hit and is recorded
 * in §5 of PROJECT-CONTEXT.
 */

export interface GalleryItem {
  id: string | number
  /** Headline under the card. */
  common: string
  /** Secondary line, set smaller. Optional. */
  binomial?: string
  photo: {
    url: string
    text: string
    pos?: string
  }
}

export interface CircularGalleryProps {
  items: GalleryItem[]
  /** 0 → 1, normally a section's scroll progress. Drives the rotation. */
  progress?: MotionValue<number>
  /** How many full revolutions `progress` 0 → 1 turns the ring. */
  turns?: number
  /** How far the cards stand from the axis. Must stay under `perspectivePx`. */
  radius?: number
  perspectivePx?: number
  /** Degrees per frame of idle drift. Set 0, or pass `still`, to stop it. */
  autoRotateSpeed?: number
  /** Card size in pixels. The posters are 4:5, so the default follows. */
  cardWidth?: number
  cardHeight?: number
  /** Drops the ring for a plain snap rail. */
  still?: boolean
  className?: string
  labelledBy?: string
  renderCard?: (item: GalleryItem) => React.ReactNode
}

function Card({
  item,
  index,
  count,
  angle,
  radius,
  cardWidth,
  cardHeight,
  renderCard,
}: {
  item: GalleryItem
  index: number
  count: number
  angle: MotionValue<number>
  radius: number
  cardWidth: number
  cardHeight: number
  renderCard?: (item: GalleryItem) => React.ReactNode
}) {
  const itemAngle = (index * 360) / count

  /* The card's own angle to the viewer, folded into 0–180, so a card facing
     forward is 0 and one directly behind is 180. Cards behind fade rather than
     disappear, which is what gives the ring its depth. */
  const opacity = useTransform(angle, (deg) => {
    const relative = (itemAngle + (deg % 360) + 360) % 360
    const facing = relative > 180 ? 360 - relative : relative
    return Math.max(0.28, 1 - facing / 180)
  })

  return (
    <motion.li
      className="cgal__card"
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
        opacity,
      }}
    >
      <div className="cgal__face">
        {renderCard ? (
          renderCard(item)
        ) : (
          <>
            <img
              src={item.photo.url}
              alt={item.photo.text}
              style={{ objectPosition: item.photo.pos || 'center' }}
              loading="lazy"
              decoding="async"
            />
            <div className="cgal__caption">
              <h3>{item.common}</h3>
              {item.binomial ? <em>{item.binomial}</em> : null}
            </div>
          </>
        )}
      </div>
    </motion.li>
  )
}

export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  function CircularGallery(
    {
      items,
      progress,
      turns = 1,
      radius = 700,
      perspectivePx = 2200,
      autoRotateSpeed = 0.02,
      cardWidth = 300,
      cardHeight = 375,
      still = false,
      className,
      labelledBy,
      renderCard,
    },
    ref,
  ) {
    const drift = useMotionValue(0)

    /* Idle drift, written to a motion value rather than to state. The loop
       only runs when it has something to do. */
    React.useEffect(() => {
      if (still || autoRotateSpeed === 0) return
      let frame = 0
      const tick = () => {
        drift.set(drift.get() + autoRotateSpeed)
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(frame)
    }, [still, autoRotateSpeed, drift])

    const scrolled = useTransform(progress ?? drift, (p) =>
      progress ? p * turns * 360 : 0,
    )
    const raw = useTransform([scrolled, drift], ([s, d]: number[]) => s + d)
    const angle = useSpring(raw, {
      stiffness: 90,
      damping: 24,
      mass: 0.5,
      restDelta: 0.01,
    })

    if (still) {
      return (
        <div
          ref={ref}
          className={`cgal cgal--still${className ? ` ${className}` : ''}`}
          aria-labelledby={labelledBy}
        >
          <ul className="cgal__rail">
            {items.map((item) => (
              <li className="cgal__card" key={item.id} style={{ width: cardWidth }}>
                <div className="cgal__face">
                  {renderCard ? (
                    renderCard(item)
                  ) : (
                    <>
                      <img
                        src={item.photo.url}
                        alt={item.photo.text}
                        style={{ objectPosition: item.photo.pos || 'center' }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="cgal__caption">
                        <h3>{item.common}</h3>
                        {item.binomial ? <em>{item.binomial}</em> : null}
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={`cgal${className ? ` ${className}` : ''}`}
        style={{ perspective: `${perspectivePx}px` }}
        aria-labelledby={labelledBy}
      >
        <motion.ul className="cgal__ring" style={{ rotateY: angle }}>
          {items.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              index={i}
              count={items.length}
              angle={angle}
              radius={radius}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              renderCard={renderCard}
            />
          ))}
        </motion.ul>
      </div>
    )
  },
)
