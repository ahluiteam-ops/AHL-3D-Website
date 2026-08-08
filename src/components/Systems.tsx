import { usePrefersReducedMotion } from '../hooks'
import { hairSystems, systemsTitle, type HairSystem } from '../site'
import { CollectionSurfer, type CollectionItem } from './ui/collection-surfer'

const items: CollectionItem[] = hairSystems.map((system) => ({
  id: system.id,
  image: system.image,
  title: system.title,
}))

const bySrc = new Map<number, HairSystem>(hairSystems.map((s) => [s.id, s]))

function SystemPoster({ item }: { item: CollectionItem }) {
  const system = bySrc.get(item.id)
  const playable = system ? system.src !== '' : false

  return (
    <>
      <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
      {/* No films supplied yet, so this is a mark rather than a control — a
          button that cannot do anything is worse than no button. */}
      <span className="surf__play" data-playable={playable ? 'true' : 'false'}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" />
        </svg>
      </span>
    </>
  )
}

/**
 * "World's Finest Thinnest Hair Systems".
 *
 * The supplied collection-surfer component with its loop removed: the ribbon of
 * product films starts at the right edge of the screen, surfs left as the page
 * scrolls, and stops on the last card instead of wrapping. Scrolling back up
 * runs it in reverse to the first.
 */
export function Systems() {
  const still = usePrefersReducedMotion()

  const overlay = (
    <h2 className="surf__title" id="systems-title">
      {systemsTitle.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  )

  return (
    <CollectionSurfer
      items={items}
      variant="magnetic"
      still={still}
      labelledBy="systems-title"
      overlay={overlay}
      renderCard={(item) => <SystemPoster item={item} />}
    />
  )
}
