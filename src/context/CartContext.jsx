import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { CartDrawer } from '../components/layout/CartDrawer.jsx'

const CartContext = createContext(null)

function newLineId(trackId) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${trackId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function CartProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  const addToCart = useCallback((payload) => {
    const track = payload?.track
    const plan = payload?.plan
    if (!track || !plan) return
    setItems((prev) => [
      ...prev,
      { lineId: newLineId(track.id), track, plan },
    ])
    setOpen(true)
  }, [])

  const removeFromCart = useCallback((lineId) => {
    setItems((prev) => prev.filter((line) => line.lineId !== lineId))
  }, [])

  const value = useMemo(
    () => ({
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addToCart,
      removeFromCart,
      items,
      cartCount: items.length,
    }),
    [items, addToCart, removeFromCart],
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
