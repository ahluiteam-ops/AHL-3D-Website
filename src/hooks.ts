import { useCallback, useEffect, useRef, useState } from 'react'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** How many cards the slider shows at once, by breakpoint. */
export function usePerView() {
  const read = () => {
    if (typeof window === 'undefined') return 3
    if (window.matchMedia('(max-width: 520px)').matches) return 2
    return 3
  }

  const [perView, setPerView] = useState(read)

  useEffect(() => {
    const onResize = () => setPerView(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return perView
}

/** Live "prefers-reduced-motion" state, so components can drop animation entirely. */
export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(reduced)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPrefers(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return prefers
}

/** Reactive media-query match for layout-dependent motion values. */
export function useMediaQuery(query: string) {
  const read = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches

  const [matches, setMatches] = useState(read)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Flips to true the first time the element scrolls into view, so a section can
 * run its entrance once and then stay put. Anyone who has asked for reduced
 * motion starts in the settled state and never sees the transition.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

/**
 * Pointer-driven parallax tilt. Writes --rx/--ry rather than setting transform
 * directly, so the element's own transform stays free for other things.
 * Skipped for coarse pointers and for reduced-motion users.
 */
export function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T>(null)
  const active = useRef(false)

  useEffect(() => {
    active.current =
      !reduced() && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  const onMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current
      if (!el || !active.current) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--ry', `${px * max * 2}deg`)
      el.style.setProperty('--rx', `${-py * max * 2}deg`)
    },
    [max],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return { ref, onMove, onLeave }
}
