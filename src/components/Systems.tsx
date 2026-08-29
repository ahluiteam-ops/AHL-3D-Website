import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks'
import { hairSystems, systemsTitle } from '../site'
import { CircularGallery, type GalleryItem } from './ui/circular-gallery'

const items: GalleryItem[] = hairSystems.map((system) => ({
  id: system.id,
  common: system.title,
  photo: { url: system.image, text: system.title },
}))

const playable = new Map(hairSystems.map((s) => [s.id, s.src !== '']))

/**
 * "World's Finest Thinnest Hair Systems".
 *
 * The supplied circular gallery: the thirteen product posters stand on a
 * circle and the ring turns about its axis as the section scrolls, so the
 * range reads as one object being walked around rather than as a row being
 * pushed past.
 *
 * The scroll spent on one revolution lives in CSS as `--systems-step` (90vh),
 * which is what builds the section's height. Nothing here needs to know that
 * length: `useScroll` reports the pin as 0 → 1 whatever it measures.
 *
 * The section pins and owns the scroll — `useScroll` against the section,
 * handed to the gallery as `progress`. That is the fix the component needed:
 * its original read `window.scrollY` against the whole document, which is fine
 * on a demo page where the gallery is the page and wrong here, where the
 * document is around 30,000px tall.
 *
 * Geometry: radius 700 against a 2,200px perspective, so the front card is
 * magnified about 1.47× and the back about 0.76×. Keeping radius well under
 * perspective is what stops a card reaching the camera plane — the trap the
 * collection surfer hit, recorded in §5.
 *
 * Below 901px and for reduced motion the ring is dropped for a snap rail.
 */
export function Systems() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [still, setStill] = useState(true)

  useEffect(() => {
    const read = () =>
      setStill(reduced || !window.matchMedia('(min-width: 901px)').matches)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [reduced])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      className={`systems${still ? ' systems--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="systems-title"
    >
      <div className="systems__pin">
        <h2 className="systems__title" id="systems-title">
          {systemsTitle.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>

        <CircularGallery
          items={items}
          progress={scrollYProgress}
          turns={1}
          radius={700}
          perspectivePx={2200}
          autoRotateSpeed={still ? 0 : 0.015}
          still={still}
          labelledBy="systems-title"
          renderCard={(item) => (
            <>
              <img
                src={item.photo.url}
                alt={item.photo.text}
                loading="lazy"
                decoding="async"
              />
              {/* No films supplied yet, so this is a mark rather than a
                  control — a button that cannot do anything is worse than no
                  button. */}
              <span
                className="systems__play"
                data-playable={playable.get(Number(item.id)) ? 'true' : 'false'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" />
                </svg>
              </span>
            </>
          )}
        />
      </div>
    </section>
  )
}
