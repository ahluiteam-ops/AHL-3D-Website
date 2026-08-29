import { useState } from 'react'

export type Slot = {
  src: string
  alt: string
  width: number
  height: number
  /** An alternative file for narrow screens. Art direction, not a resolution
   *  swap — see `HairBenefits`. */
  mobileSrc?: string
}

/**
 * A photograph, and an honest frame when the file is not there yet.
 *
 * Extracted from `HairBenefits`, which had carried this alone. It matters more
 * now: the Clip-On page is built ahead of its photography, and a page full of
 * broken-image glyphs is not "blank", it looks broken. This renders the
 * declared filename and its intended dimensions instead, so the gap is legible
 * as a gap and whoever drops the file in knows exactly what to name it and how
 * big to make it.
 *
 * `onError` is what makes the swap free: the real `<img>` is always rendered
 * and only falls back when the file genuinely is not served. Drop the file in
 * at the declared path and this component stops appearing on its own — no code
 * change, no flag to remember to turn off.
 */
export function Photo({
  slot,
  className,
  loading = 'lazy',
}: {
  slot: Slot
  className?: string
  loading?: 'lazy' | 'eager'
}) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <span className={`photoSlot ${className ?? ''}`} aria-hidden="true">
        <span className="photoSlot__name">{slot.src.split('/').pop()}</span>
        <span className="photoSlot__size">
          {slot.width}×{slot.height}
        </span>
      </span>
    )
  }

  const img = (
    <img
      className={className}
      src={slot.src}
      alt={slot.alt}
      width={slot.width}
      height={slot.height}
      loading={loading}
      decoding="async"
      onError={() => setMissing(true)}
    />
  )

  if (!slot.mobileSrc) return img

  return (
    <picture>
      <source media="(max-width: 900px)" srcSet={slot.mobileSrc} />
      {img}
    </picture>
  )
}
