import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/catalog': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/beats': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        bypass(req) {
          // SPA catalog lives at `/beats`; only JSON API calls and non-GET methods hit FastAPI.
          const pathname = req.url?.split('?')[0] ?? ''
          if (pathname !== '/beats') return undefined
          if (req.method !== 'GET') return undefined
          const accept = req.headers.accept ?? ''
          if (accept.includes('text/html')) return '/index.html'
          return undefined
        },
      },
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        bypass(req) {
          // POST/OPTIONS/etc. always go to FastAPI. GET /admin/* is ambiguous: only
          // `/admin/me` is the only API GET under `/admin`; every other GET should load the SPA so
          // deep links like `/admin/beat-management/login` don’t receive FastAPI JSON 404.
          const pathname = req.url?.split('?')[0] ?? ''
          if (req.method === 'GET') {
            const isApiGet = pathname === '/admin/me'
            if (!isApiGet && pathname.startsWith('/admin')) {
              return '/index.html'
            }
          }
          return undefined
        },
      },
    },
  },
})
