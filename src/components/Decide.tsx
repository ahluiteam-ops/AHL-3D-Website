import { useState } from 'react'
import { useReveal, useTilt } from '../hooks'
import { decideNote, decideTitle, decideVideo } from '../site'

/**
 * "Real Hair Or Illusion? Watch & Decide".
 *
 * One card, given depth rather than decoration. The research on 3D web work
 * that actually holds up is fairly consistent: perspective earns its place on
 * a single hero object the user is meant to inspect, and stops earning it the
 * moment it is applied to everything. So the tilt is on this one card, it is
 * small (5°), it is pointer-driven rather than scroll-driven, and the poster
 * inside it moves slightly against the frame so the card reads as having a
 * front and a back rather than as a flat plane being rotated.
 *
 * `useTilt` writes `--rx` / `--ry` rather than setting a transform, which is
 * what lets the card's own hover lift and the tilt live on the same element
 * without one overwriting the other. It is skipped for coarse pointers and for
 * reduced motion by the hook itself.
 *
 * The supplied film plays inline only after the poster control is selected.
 */
export function Decide() {
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()
  const { ref: tiltRef, onMove, onLeave } = useTilt<HTMLDivElement>(5)
  const [playing, setPlaying] = useState(false)
  const playable = decideVideo.src !== ''

  const media = (
    <>
      <img
        className="decide__poster"
        src={decideVideo.poster}
        alt={playable ? '' : decideVideo.alt}
        loading="lazy"
        decoding="async"
      />
      <span className="decide__play">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
        </svg>
        {decideVideo.label}
      </span>
    </>
  )

  return (
    <section className="decide" aria-labelledby="decide-title">
      <div
        className="decide__in wrap"
        data-shown={shown ? 'true' : 'false'}
        ref={revealRef}
      >
        <h2 className="decide__title" id="decide-title">
          {decideTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div
          className="decide__stage"
          ref={tiltRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {playable && playing ? (
            <div className="decide__card">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                className="decide__video"
                src={decideVideo.src}
                poster={decideVideo.poster}
                controls
                autoPlay
                playsInline
              />
            </div>
          ) : playable ? (
            <button
              type="button"
              className="decide__card decide__card--playable"
              onClick={() => setPlaying(true)}
            >
              {media}
            </button>
          ) : (
            <figure className="decide__card">{media}</figure>
          )}
        </div>

        <p className="decide__note">{decideNote}</p>
      </div>
    </section>
  )
}
