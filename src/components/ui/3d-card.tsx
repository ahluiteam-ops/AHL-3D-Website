import * as React from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'motion/react'

/**
 * The 3D tilt card from the supplied `InteractiveTravelCard`, reduced to the
 * part that transfers: the pointer-driven tilt itself. The spring config,
 * ±10.5° range and preserve-3d/translateZ layering are unchanged; the travel
 * chrome (background photo, title/subtitle, arrow link, action button) is
 * dropped because the cards it wraps here carry their own content.
 *
 * Imports from `motion/react`, not `framer-motion`. Both ship the same API,
 * but `motion` is this project's declared dependency and `framer-motion` is
 * only present underneath it — importing it directly would lean on a
 * transitive package and load a second copy of the animation runtime.
 *
 * The PARENT must establish `perspective`, exactly as the original demo does
 * with its wrapper div.
 */
/* Extends motion's own div props rather than React.HTMLAttributes: the two
   disagree about `onDrag`, which React types as a drag-event handler and
   motion as a pan handler. */
export interface Card3DProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  children: React.ReactNode
  /** How far the content floats above the card face, in px. 0 disables the layer. */
  depth?: number
  /** Peak rotation at the card's corners, in degrees. */
  maxTilt?: number
  /** Skip the tilt entirely — pass the user's reduced-motion preference here. */
  still?: boolean
  className?: string
}

export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ children, depth = 40, maxTilt = 10.5, still = false, className, ...rest }, ref) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)

    const rotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt}deg`, `${-maxTilt}deg`])
    const rotateY = useTransform(springX, [-0.5, 0.5], [`${-maxTilt}deg`, `${maxTilt}deg`])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (still) return
      const { width, height, left, top } = e.currentTarget.getBoundingClientRect()
      mouseX.set((e.clientX - left) / width - 0.5)
      mouseY.set((e.clientY - top) / height - 0.5)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          still
            ? undefined
            : { rotateX, rotateY, transformStyle: 'preserve-3d' }
        }
        className={['card3d', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {depth > 0 && !still ? (
          <div
            className="card3d__layer"
            style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </motion.div>
    )
  },
)

Card3D.displayName = 'Card3D'

export default Card3D
