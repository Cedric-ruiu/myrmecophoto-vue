import type PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { PhotoSwipeOptions } from 'photoswipe'
import { onBeforeUnmount, onMounted } from 'vue'

// Only links carrying the full-size dimensions open the viewer, so in-text links
// inside the same container keep their normal behaviour.
const ITEM_SELECTOR = 'a[data-pswp-width]'

/**
 * Binds PhotoSwipe to every gallery matching `gallerySelector` without adding
 * anything to the page bundle: the viewer (~23 kB gzipped, CSS and core module
 * included) is only fetched on the first interaction with a zoomable image.
 * Until then — and when JavaScript never runs — the links stay plain links to
 * the full-size file.
 */
export const useLightbox = (
  gallerySelector: string,
  options: PhotoSwipeOptions = {},
) => {
  let galleries: HTMLElement[] = []
  let lightboxes: PhotoSwipeLightbox[] = []
  let viewerPromise: Promise<void> | null = null
  let opening = false

  const detach = () => {
    galleries.forEach((gallery) => {
      gallery.removeEventListener('pointerdown', onPointerDown)
      gallery.removeEventListener('click', onClick)
    })
  }

  const loadViewer = () => {
    viewerPromise ||= Promise.all([
      import('photoswipe/lightbox'),
      import('photoswipe/style.css'),
    ])
      .then(([{ default: Lightbox }]) => {
        lightboxes = galleries.map((gallery) => {
          const lightbox = new Lightbox({
            gallery,
            children: ITEM_SELECTOR,
            pswpModule: () => import('photoswipe'),
            ...options,
          })
          lightbox.init()
          return lightbox
        })
        // `init()` binds PhotoSwipe's own click handler: keeping ours would open
        // the viewer twice on every later click.
        detach()
      })
      .catch(() => {
        // Offline, or the chunk failed to load: leave the handlers in place so
        // the next interaction retries.
        viewerPromise = null
      })

    return viewerPromise
  }

  const findItem = (event: Event) =>
    (event.target as HTMLElement | null)?.closest?.(ITEM_SELECTOR) as
      | HTMLAnchorElement
      | null

  // Pointer down lands ~100 ms before the click on touch screens, which is
  // enough head start for the viewer to open without a visible delay.
  const onPointerDown = (event: PointerEvent) => {
    if (event.button === 0 && findItem(event)) loadViewer()
  }

  const onClick = async (event: MouseEvent) => {
    // Modified clicks are the user asking for the raw file, not for the viewer.
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return
    }

    const item = findItem(event)
    if (!item || opening) return

    event.preventDefault()
    opening = true

    const gallery = event.currentTarget as HTMLElement
    // A click triggered from the keyboard reports (0, 0): no origin for the
    // opening animation in that case.
    const point
      = event.clientX || event.clientY
        ? { x: event.clientX, y: event.clientY }
        : null

    try {
      await loadViewer()
      const items = [...gallery.querySelectorAll(ITEM_SELECTOR)]
      lightboxes[galleries.indexOf(gallery)]?.loadAndOpen(
        items.indexOf(item),
        undefined,
        point,
      )
    }
    finally {
      opening = false
    }
  }

  onMounted(() => {
    galleries = [...document.querySelectorAll<HTMLElement>(gallerySelector)]
    galleries.forEach((gallery) => {
      gallery.addEventListener('pointerdown', onPointerDown)
      gallery.addEventListener('click', onClick)
    })
  })

  onBeforeUnmount(() => {
    detach()
    lightboxes.forEach(lightbox => lightbox.destroy())
    lightboxes = []
    galleries = []
    viewerPromise = null
  })
}
