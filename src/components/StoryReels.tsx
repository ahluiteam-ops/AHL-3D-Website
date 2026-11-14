import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import type { StoryReel, StoryReelSet } from '../site'

/* Same number and prefilled message as `FloatingContact`. The end of a reel is
   a "talk to us" moment, and WhatsApp is the lowest-commitment way to do that
   from inside a full-screen video. */
const whatsappHref = `https://wa.me/919222666111?text=${encodeURIComponent('Hi American Hairline, I would like to know more.')}`

/* Which circles this visitor has already opened, so a watched circle drops its
   blue ring the way a seen story does. A per-browser convenience only: if
   storage is blocked every ring simply stays blue. */
const watchedKey = 'ah-story-reels-watched'

function readWatched(): Set<string> {
  try {
    const raw = window.localStorage.getItem(watchedKey)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveWatched(ids: Set<string>) {
  try {
    window.localStorage.setItem(watchedKey, JSON.stringify([...ids]))
  } catch {
    /* storage unavailable — the ring state just will not persist */
  }
}

/**
 * Story reels — a row of circular client videos that opens into a 9:16 reel.
 *
 * Modelled on the circles under Add to Cart on 1hairstop.in. This site has no
 * cart, so the row sits directly below each page's consultation CTA or form
 * instead: the visitor who hesitates there, asking "will it work for someone
 * like me?", meets the answer next. Four circles at most (Hick's law), each titled with the visitor's
 * own question rather than the client's name — the name is inside the reel.
 *
 * Posters are 320px WebP and the clip is fetched only when a circle is tapped,
 * so the row costs about 40 KB on page load.
 *
 * The viewer is a native modal `<dialog>`, so it sits in the top layer above
 * the floating WhatsApp/call buttons without any z-index arrangement, and Esc,
 * the focus trap and focus return come from the platform.
 */
export function StoryReels({ set, ground = 'white' }: { set: StoryReelSet; ground?: 'white' | 'tint' }) {
  const titleId = useId()
  const [open, setOpen] = useState<number | null>(null)
  const [watched, setWatched] = useState<Set<string>>(() => readWatched())

  const markWatched = useCallback((id: string) => {
    setWatched((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveWatched(next)
      return next
    })
  }, [])

  const close = useCallback(() => setOpen(null), [])

  return (
    <section className="reels" data-ground={ground} aria-labelledby={titleId}>
      <div className="wrap reels__in">
        <header className="reels__head">
          {/* Non-breaking hyphens, so "Clip-On" never splits across lines. */}
          <h2 id={titleId}>{set.title.replace(/(\w)-(\w)/g, '$1‑$2')}</h2>
          <p>{set.intro}</p>
        </header>
        <ul className="reels__row">
          {set.reels.map((reel, index) => (
            <li key={reel.id}>
              <button
                type="button"
                className="reels__circle"
                data-watched={watched.has(reel.id) ? 'true' : 'false'}
                onClick={() => setOpen(index)}
                aria-label={`Play video: ${reel.title}, with ${reel.name}`}
              >
                <span className="reels__disc">
                  <img src={reel.poster} alt="" width={160} height={160} loading="lazy" decoding="async" />
                  <span className="reels__badge" aria-hidden="true">
                    <Play />
                  </span>
                </span>
                <span className="reels__label">{reel.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open !== null && (
        <ReelViewer
          reels={set.reels}
          index={open}
          setIndex={setOpen}
          onClose={close}
          onWatched={markWatched}
          label={set.title}
        />
      )}
    </section>
  )
}

function ReelViewer({
  reels,
  index,
  setIndex,
  onClose,
  onWatched,
  label,
}: {
  reels: StoryReel[]
  index: number
  setIndex: (index: number) => void
  onClose: () => void
  onWatched: (id: string) => void
  label: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [muted, setMuted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const reel = reels[index]
  const last = reels.length - 1

  /* The phone back button should close the reel, not leave the page, so the
     viewer owns one history entry. It is pushed only if not already there,
     which also keeps StrictMode's double mount from stacking two. */
  const requestClose = useCallback(() => {
    if ((window.history.state as { storyReel?: boolean } | null)?.storyReel) window.history.back()
    else onCloseRef.current()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()

    // `html`, not `body`, is this site's scrolling element — see §5 traps.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    if (!(window.history.state as { storyReel?: boolean } | null)?.storyReel) {
      window.history.pushState({ storyReel: true }, '')
    }
    const onPop = () => onCloseRef.current()
    window.addEventListener('popstate', onPop)

    return () => {
      window.removeEventListener('popstate', onPop)
      root.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  // A fresh clip starts from the top, playing, with its ring marked as seen.
  useEffect(() => {
    setFinished(false)
    setPaused(false)
    onWatched(reel.id)
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {
      /* Sound-on autoplay refused (iOS without a fresh gesture): retry muted,
         and if that fails too, show the play state for a tap. */
      video.muted = true
      setMuted(true)
      video.play().catch(() => setPaused(true))
    })
  }, [reel.id, onWatched])

  // Progress is written straight to the bar, not through state, so a 60fps
  // update does not re-render the viewer.
  useEffect(() => {
    let frame = 0
    const tick = () => {
      const video = videoRef.current
      const bar = barRef.current
      if (video && bar && video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const go = useCallback(
    (next: number) => {
      if (next < 0) return
      if (next > last) {
        videoRef.current?.pause()
        setFinished(true)
        return
      }
      setIndex(next)
    },
    [last, setIndex],
  )

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || finished) return
    if (video.paused) video.play().catch(() => setPaused(true))
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const replay = () => {
    setFinished(false)
    if (index === 0) {
      const video = videoRef.current
      if (video) {
        video.currentTime = 0
        video.play().catch(() => setPaused(true))
      }
    } else setIndex(0)
  }

  /* One pointer gesture on the video does three jobs: a sideways swipe moves
     between clips, a downward swipe closes, and a plain tap pauses. Taps on
     the overlay's own buttons and links are left to them. */
  const onPointerDown = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest('button, a')) return
    pointer.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: ReactPointerEvent) => {
    const start = pointer.current
    pointer.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
    else if (dy > 90) requestClose()
    else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) togglePlay()
  }

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'ArrowRight') go(index + 1)
    else if (event.key === 'ArrowLeft') go(index - 1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="reelView"
      aria-label={`${label} — video ${index + 1} of ${reels.length}`}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        // A click on the dimmed area around the frame closes, as on any sheet.
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div className="reelView__frame" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {/* Captions are burned into the supplied clips. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          key={reel.id}
          className="reelView__video"
          src={reel.src}
          poster={reel.poster}
          playsInline
          preload="auto"
          muted={muted}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onEnded={() => go(index + 1)}
          aria-label={reel.title}
        />

        <div className="reelView__top">
          <div className="reelView__bars" aria-hidden="true">
            {reels.map((item, i) => (
              <span key={item.id} className="reelView__barTrack">
                <span
                  ref={i === index ? barRef : undefined}
                  className="reelView__bar"
                  /* The active bar is driven by the animation frame loop;
                     a style prop here would reset it on every re-render. */
                  style={i === index ? undefined : { transform: `scaleX(${i < index ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          <div className="reelView__meta">
            <img src={reel.poster} alt="" width={36} height={36} />
            <p>
              <strong>{reel.name}</strong>
              <span>
                {index + 1} of {reels.length}
              </span>
            </p>
            <button type="button" className="reelView__icon" onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Mute'}>
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
            <button type="button" className="reelView__icon" onClick={requestClose} aria-label="Close video">
              <X />
            </button>
          </div>
        </div>

        {paused && !finished && (
          <span className="reelView__paused" aria-hidden="true">
            <Play />
          </span>
        )}

        <div className="reelView__bottom">
          <h3>{reel.title}</h3>
          <a className="reelView__cta" href={whatsappHref} target="_blank" rel="noreferrer">
            Discuss With a Consultant <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        {finished && (
          <div className="reelView__end">
            <h3>Want to talk about your own hair?</h3>
            <p>A consultant will answer your questions on WhatsApp. No booking needed.</p>
            <a className="reelView__cta reelView__cta--solid" href={whatsappHref} target="_blank" rel="noreferrer">
              Discuss With a Consultant <ArrowUpRight aria-hidden="true" />
            </a>
            <button type="button" className="reelView__replay" onClick={replay}>
              <RotateCcw aria-hidden="true" /> Watch again
            </button>
          </div>
        )}

        <button
          type="button"
          className="reelView__nav reelView__nav--prev"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous video"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="reelView__nav reelView__nav--next"
          onClick={() => go(index + 1)}
          disabled={finished}
          aria-label="Next video"
        >
          <ChevronRight />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {finished ? 'All videos watched.' : `Video ${index + 1} of ${reels.length}: ${reel.title}`}
      </p>
    </dialog>
  )
}
