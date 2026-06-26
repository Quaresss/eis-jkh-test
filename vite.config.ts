import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/eis-jkh-test/', 
  
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://showroom.eis24.me/c300/api/v4/test',
        changeOrigin: true,
        followRedirects: true, 
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})