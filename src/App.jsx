import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import BeatsCatalogPage from './pages/BeatsCatalogPage.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beats" element={<BeatsCatalogPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
