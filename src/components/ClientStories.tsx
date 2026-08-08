import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { clientStories, clientStoriesTitle, type ClientStory } from '../site'
import { usePrefersReducedMotion } from '../hooks'

function StoryCard({ story }: { story: ClientStory }) {
  const [playing, setPlaying] = useState(false)
  const playable = story.src !== ''

  const media = playing ? (
    <div className="voices__media">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="voices__video"
        src={story.src}
        poster={story.poster}
        controls
        autoPlay
        playsInline
      />
    </div>
  ) : (
    <>
      <img src={story.poster} alt={story.alt} loading="lazy" decoding="async" />
      {/* Every poster is a before/after split with nothing marking which half
          is which, so the two halves are labelled. Without them the frame
          reads as one photograph of two different men. */}
      <span className="voices__tag voices__tag--before">Before</span>
      <span className="voices__tag voices__tag--after">After</span>
      {/* The quote sits on the poster, as in the client's design, over a
          gradient rather than a flat scrim so the "after" half of the frame
          stays readable behind it. */}
      <p className="voices__quote">“{story.quote}”</p>
      <span className="voices__play">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" />
        </svg>
      </span>
    </>
  )

  return (
    <article className="voices__item">
      {playable && !playing ? (
        <button
          type="button"
          className="voices__media voices__media--playable"
          onClick={() => setPlaying(true)}
        >
          {media}
          <span className="sr-only">Play {story.name}’s story</span>
        </button>
      ) : playing ? (
        media
      ) : (
        /* No film supplied yet, so this is a figure rather than a dead button.
           A control that cannot do anything is worse than no control. */
        <figure className="voices__media">{media}</figure>
      )}
      <h3 className="voices__name">{story.name}</h3>
    </article>
  )
}

/**
 * "Some Of Our Clients With The Most Natural Hairline".
 *
 * Same mechanism as "Our Big Achievements": the section pins and vertical
 * scroll drives a horizontal track through intro panel → six client films →
 * closing panel. The section's height is `100vh + trackOverflow`, measured
 * after paint, which is what creates the scroll distance for the pin.
 *
 * Below 901px, and for reduced motion, the pin is dropped for a scroll-snapped
 * swipe rail — the same trade the Achievements section makes, for the same
 * reason: hijacking vertical scroll on a phone fights the gesture the user
 * already has.
 */
export function ClientStories() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const still = usePrefersReducedMotion()

  // How far the track has to travel. 0 means "not pinned" — the rail mode.
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const pinned = window.matchMedia('(min-width: 901px)').matches && !still
      setDistance(pinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    }

    measure()
    // Posters land after first paint and change the track's width, so remeasure
    // rather than trusting the initial number.
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [still])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  const pinned = distance > 0

  return (
    <section
      className={`voices${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="voices-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="voices__pin">
        <motion.div
          className="voices__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="voices__intro">
            <h2 className="voices__title" id="voices-title">
              {clientStoriesTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <a className="voices__link" href="#results">
              See more client stories
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {clientStories.map((story) => (
            <StoryCard story={story} key={story.name} />
          ))}

          <div className="voices__outro">
            <p className="voices__outroCopy">
              Every one of them was asked the same question afterwards: could
              anyone tell?
            </p>
            <a className="voices__link" href="#book">
              Discuss with a consultant
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
