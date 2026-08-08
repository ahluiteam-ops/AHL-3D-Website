import type { CSSProperties, HTMLAttributes } from 'react'

export type ParallaxImage = {
  src: string
  alt: string
  /** Parallax factor. Smaller values produce a subtler fold. */
  f?: number
  /** Corner radius used by the moving clip path. */
  r?: string
}

export interface ParallaxImagesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  images: readonly ParallaxImage[]
  /** Disables the hover transform for reduced-motion users. */
  still?: boolean
}

type ParallaxImageStyle = CSSProperties & {
  '--f': number
  '--r': string
}

/**
 * Prop-driven port of the supplied 3D parallax image component. The original
 * demo's Tailwind layout utilities live in global.css because this Vite site
 * intentionally uses plain CSS. No runtime dependency is required.
 */
export default function ParallaxImages({
  images,
  still = false,
  className,
  ...rest
}: ParallaxImagesProps) {
  return (
    <div
      className={[
        'parallaxImages',
        still ? 'parallaxImages--still' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {images.map((image) => {
        const style: ParallaxImageStyle = {
          '--f': image.f ?? 0.1,
          '--r': image.r ?? '10px',
        }

        return (
          <div className="parallaxImages__item" key={image.src}>
            <img
              className="parallax-img"
              src={image.src}
              alt={image.alt}
              aria-hidden={image.alt ? undefined : true}
              decoding="async"
              loading="lazy"
              style={style}
            />
          </div>
        )
      })}
    </div>
  )
}
