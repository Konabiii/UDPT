// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Bất kỳ request nào bắt đầu bằng /api
        target: 'http://localhost:3000', // Sẽ được chuyển đến backend server
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Bỏ '/api' nếu backend không cần
                                                       // Trong trường hợp của bạn, API là /api/users/...
                                                       // nên không cần rewrite hoặc chỉ rewrite phần không cần thiết.
      }
    }
  }
})