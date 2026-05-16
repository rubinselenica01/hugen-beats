/**
 * Shared layout tokens for catalog-style beat grids (storefront + admin list).
 * Keeps mobile chunked carousel rows and desktop grids visually aligned.
 */

/** Mobile carousel chunks rows of this many cards (horizontal snap rows). */
export const CARDS_PER_MOBILE_ROW = 4

/** Max width shell around each BeatCard — matches across catalog and admin. */
export const BEAT_CARD_SHELL_CLASS = 'w-full min-w-0 max-w-[18.5rem]'

/** One horizontal snap row inside mobile chunked layout (BeatsCatalogPage + AdminBeatManagementPage). */
export const BEATS_MOBILE_SCROLL_ROW_CLASS =
  '-mx-8 flex flex-nowrap gap-4 overflow-x-auto px-8 pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden'

/** Desktop grid for the same two pages (`hidden` until sm — separate from FeaturedBeatsSection). */
export const BEATS_DESKTOP_GRID_CLASS =
  'hidden sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-6 lg:grid-cols-4 lg:gap-8'

/** Wrapper width for each card cell in mobile chunked rows. */
export const BEAT_CARD_MOBILE_CHUNK_SLOT_CLASS =
  'w-[min(85vw,18.5rem)] shrink-0 snap-start'

/** `style` prop for momentum scrolling on mobile carousel rows (iOS). */
export const BEATS_MOBILE_SCROLL_ROW_STYLE = { WebkitOverflowScrolling: 'touch' }
