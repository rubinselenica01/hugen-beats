/** Location state for `navigate(routes.contact, { state })` so ContactPage can set the right heading. */
export const CONTACT_PAGE_HEADING = Object.freeze({
  about: 'Contact Us',
  project: 'Start a Project',
})

const _valid = new Set(Object.values(CONTACT_PAGE_HEADING))

export const contactNavState = Object.freeze({
  fromAbout: { contactPageHeading: CONTACT_PAGE_HEADING.about },
  fromProject: { contactPageHeading: CONTACT_PAGE_HEADING.project },
})

/**
 * @param {unknown} state - `location.state` from react-router
 * @returns {string}
 */
export function contactPageHeadingFromState(state) {
  const h = state && typeof state === 'object' ? state.contactPageHeading : null
  if (typeof h === 'string' && _valid.has(h)) return h
  return CONTACT_PAGE_HEADING.about
}
