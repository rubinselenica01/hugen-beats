import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset window scroll on client-side route changes. */
export function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
