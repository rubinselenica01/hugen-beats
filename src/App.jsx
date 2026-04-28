import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import BeatsCatalogPage from './pages/BeatsCatalogPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { RequireAdminSession } from './components/auth/RequireAdminSession.jsx'
import AdminBeatManagementPage from './pages/AdminBeatManagementPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

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
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/beat-management"
            element={
              <RequireAdminSession>
                <AdminBeatManagementPage />
              </RequireAdminSession>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
