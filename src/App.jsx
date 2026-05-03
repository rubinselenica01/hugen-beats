import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { routes } from './constants/routes.js'
import { CartProvider } from './context/CartContext.jsx'
import { BeatPreviewPlayerBar } from './components/ui/BeatPreviewPlayerBar.jsx'
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
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.beatsCatalog} element={<BeatsCatalogPage />} />
          <Route path={routes.adminLogin} element={<LoginPage />} />
          <Route
            path={routes.adminBeatManagement}
            element={
              <RequireAdminSession>
                <AdminBeatManagementPage />
              </RequireAdminSession>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <BeatPreviewPlayerBar />
      </CartProvider>
    </BrowserRouter>
  )
}
