import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        bypass(req) {
          // POST/OPTIONS/etc. always go to FastAPI. GET /admin/* is ambiguous: only
          // `/admin/me` and `/admin/beats` are API; every other GET should load the SPA so
          // deep links like `/admin/beat-management/login` don’t receive FastAPI JSON 404.
          const pathname = req.url?.split('?')[0] ?? ''
          if (req.method === 'GET') {
            const isApiGet = pathname === '/admin/me' || pathname === '/admin/beats'
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
