// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Tất cả các request bắt đầu bằng '/api' sẽ được chuyển tiếp
      '/api': {
        target: 'http://localhost:3000', // Địa chỉ backend của bạn
        changeOrigin: true, // Cần thiết cho virtual hosted sites
        // rewrite: (path) => path.replace(/^\/api/, '') // Bỏ dòng này nếu backend của bạn đã có '/api' trong route
      }
    }
  }
  
})