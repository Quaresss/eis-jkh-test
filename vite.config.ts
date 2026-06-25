import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, Vite перенаправит на целевой сервер
      '/api': {
        target: 'http://showroom.eis24.me/c300/api/v4/test',
        changeOrigin: true,
        // Удаляем префикс /api перед отправкой на сервер, если он там не нужен
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
