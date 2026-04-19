import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import BeatsCatalogPage from './pages/BeatsCatalogPage.jsx'
import HomePage from './pages/HomePage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beats" element={<BeatsCatalogPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
