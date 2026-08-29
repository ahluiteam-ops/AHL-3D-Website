import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Photo } from './Photo'
import { usePrefersReducedMotion, useReveal } from '../hooks'

/** Copy on the guide pages marks its emphasis with `**`, so the bold lives in
 *  `site.ts` as readable text rather than as markup. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, index) =>
        index % 2 ? (
          <strong key={index}>{part}</strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

export type GuideHeroProps = {
  /** Anchors the page's `<h1>`; must be unique on the page. */
  titleId: string
  eyebrow: string
  /** Path to the eyebrow mark. Used as a CSS mask, so only its shape matters —
   *  whatever `fill` the file carries is discarded and the brand blue is
   *  painted through it. */
  eyebrowIcon: string
  title: ReactNode
  /** `**bold**` is honoured. */
  lede: string
  media: { poster: string; alt: string; width: number; height: number }
  /** Whether the still carries the design's play mark. The Clip-On Hair System
   *  page's image is a photograph rather than a video still, so its design draws
   *  no play mark — one there would promise a film that does not exist. */
  showPlay?: boolean
}

/**
 * The shared hero for the guide pages under "Confused? We'll Guide You".
 *
 * Both guides open the same way — eyebrow badge, headline, lede, then one wide
 * rounded still with a play mark — so they are one component rather than two
 * near-copies. Extracted when the second guide page was built; before that this
 * markup and its 188 lines of CSS existed only as `PatchSystemHero`, and
 * duplicating them would have meant every later fix had to be made twice.
 *
 * The CSS block is `.guideHero`, renamed from `.patchHero` at the same time for
 * the same reason.
 *
 * The still scrubs up as it enters — scale and corner radius together, so it
 * reads as the image settling into the page rather than merely growing. Under
 * `prefers-reduced-motion` it renders at its final size with no transform, and
 * the header's `useReveal` already handles its own reduced-motion case.
 */
export function GuideHero({
  titleId,
  eyebrow,
  eyebrowIcon,
  title,
  lede,
  media,
  showPlay = true,
}: GuideHeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { ref: headerRef, shown } = useReveal<HTMLDivElement>()

  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start 94%', 'center 54%'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0005,
  })
  const scale = useTransform(smooth, [0, 1], [0.88, 1.02])
  const radius = useTransform(smooth, [0, 1], [30, 16])

  return (
    <section
      className="guideHero"
      aria-labelledby={titleId}
      style={
        { '--guideHero-icon': `url('${eyebrowIcon}')` } as React.CSSProperties
      }
    >
      <div className="guideHero__in wrap">
        <div
          className="guideHero__header"
          ref={headerRef}
          data-shown={shown ? 'true' : 'false'}
        >
          <div className="guideHero__eyebrow">
            <span className="guideHero__eyebrowIcon" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="guideHero__title" id={titleId}>
            {title}
          </h1>

          <p className="guideHero__lede">
            <Emphasised text={lede} />
          </p>
        </div>

        <div className="guideHero__mediaWrap" ref={mediaRef}>
          <motion.figure
            className="guideHero__media"
            style={reduced ? undefined : { scale, borderRadius: radius }}
          >
            {/* Through `Photo`, so a guide page built ahead of its poster shows
                a labelled frame rather than a broken-image glyph. */}
            <Photo
              slot={{
                src: media.poster,
                alt: media.alt,
                width: media.width,
                height: media.height,
              }}
              loading="eager"
            />
            {/* Decorative. No film has been supplied for either guide page, so
                this is the design's play mark and not a control — a button that
                does nothing is worse than a picture of one. It becomes a real
                trigger the day a file lands, the same way `checklistVideo` and
                `processVideo` already work. */}
            {showPlay ? (
              <span className="guideHero__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
                </svg>
              </span>
            ) : null}
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
