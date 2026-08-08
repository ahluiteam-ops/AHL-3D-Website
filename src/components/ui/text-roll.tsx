import {
  motion,
  type Target,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from 'motion/react'

/**
 * Per-letter 3D roll. Each character stacks two faces on a shared shell: one
 * rotates away as the other rotates in, and a hidden copy of the letter holds
 * the shell's width so nothing reflows while they turn.
 *
 * Ported from the Tailwind original — this project has no Tailwind, so the
 * utility classes are the plain rules in global.css under "TextRoll". The
 * props, defaults and animation are unchanged. The `"use client"` directive
 * was dropped: it is a Next.js marker and has no meaning under Vite.
 *
 * The component animates on mount, so to replay it (e.g. when a section
 * scrolls into view) change its `key`.
 */
export type TextRollProps = {
  children: string
  duration?: number
  getEnterDelay?: (index: number) => number
  getExitDelay?: (index: number) => number
  className?: string
  transition?: Transition
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean
      animate: TargetAndTransition | VariantLabels
    }
    exit: {
      initial: Target | VariantLabels | boolean
      animate: TargetAndTransition | VariantLabels
    }
  }
  onAnimationComplete?: () => void
}

const defaultVariants = {
  enter: {
    animate: { rotateX: 90 },
    initial: { rotateX: 0 },
  },
  exit: {
    animate: { rotateX: 0 },
    initial: { rotateX: 90 },
  },
} as const

/* A literal space would collapse inside these inline-block shells and run the
   words together, so gaps are carried by a non-breaking space instead. */
const NBSP = ' '

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.1,
  getExitDelay = (i) => i * 0.1 + 0.2,
  className,
  transition = { ease: 'easeIn' },
  variants,
  onAnimationComplete,
}: TextRollProps) {
  const letters = children.split('')

  return (
    <span className={className}>
      {letters.map((letter, i) => {
        const glyph = letter === ' ' ? NBSP : letter

        return (
          <span aria-hidden="true" className="textRoll__char" key={i}>
            <motion.span
              animate={variants?.enter?.animate ?? defaultVariants.enter.animate}
              className="textRoll__face textRoll__face--enter"
              initial={variants?.enter?.initial ?? defaultVariants.enter.initial}
              transition={{ ...transition, delay: getEnterDelay(i), duration }}
            >
              {glyph}
            </motion.span>
            <motion.span
              animate={variants?.exit?.animate ?? defaultVariants.exit.animate}
              className="textRoll__face textRoll__face--exit"
              initial={variants?.exit?.initial ?? defaultVariants.exit.initial}
              onAnimationComplete={
                letters.length === i + 1 ? onAnimationComplete : undefined
              }
              transition={{ ...transition, delay: getExitDelay(i), duration }}
            >
              {glyph}
            </motion.span>
            <span className="textRoll__ghost">{glyph}</span>
          </span>
        )
      })}
      <span className="sr-only">{children}</span>
    </span>
  )
}

export default TextRoll
