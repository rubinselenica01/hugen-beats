import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CartDrawer } from '../components/layout/CartDrawer.jsx'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'hugen-music-cart'

function isValidCartLine(line) {
  if (!line || typeof line !== 'object') return false
  if (typeof line.lineId !== 'string') return false
  if (!line.track || typeof line.track !== 'object') return false
  if (typeof line.track.id !== 'string') return false
  if (!line.plan || typeof line.plan !== 'object') return false
  if (typeof line.plan.name !== 'string') return false
  return true
}

function loadCartFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCartLine)
  } catch {
    return []
  }
}

function newLineId(trackId) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${trackId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Same track + same license plan = one cart line (stable when `track.id` comes from any API). */
export function cartLineKey(track, plan) {
  if (!track?.id || !plan?.name) return ''
  return `${String(track.id)}|${String(plan.name)}`
}

function lineMatchesTrackAndPlan(line, track, plan) {
  return cartLineKey(line.track, line.plan) === cartLineKey(track, plan)
}

export function CartProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(loadCartFromStorage)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / private mode errors
    }
  }, [items])

  const addToCart = useCallback((payload) => {
    const track = payload?.track
    const plan = payload?.plan
    if (!track || !plan) return

    setItems((prev) => {
      if (prev.some((line) => lineMatchesTrackAndPlan(line, track, plan))) {
        return prev
      }
      return [
        ...prev,
        { lineId: newLineId(track.id), track, plan },
      ]
    })
    setOpen(true)
  }, [])

  const isInCart = useCallback(
    (track, plan) => {
      if (!track?.id || !plan?.name) return false
      return items.some((line) => lineMatchesTrackAndPlan(line, track, plan))
    },
    [items],
  )

  const removeFromCart = useCallback((lineId) => {
    setItems((prev) => prev.filter((line) => line.lineId !== lineId))
  }, [])

  const value = useMemo(
    () => ({
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addToCart,
      isInCart,
      removeFromCart,
      items,
      cartCount: items.length,
    }),
    [items, addToCart, isInCart, removeFromCart],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onRemove={removeFromCart}
      />
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx == null) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}

/** @deprecated Use useCart instead */
export function useCartDrawer() {
  return useCart()
}
