import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  server: {
    port: 3000, // Đặt port mà bạn muốn, ví dụ: 3000
    strictPort: true // Tùy chọn này đảm bảo Vite không chuyển sang port khác nếu port đã bị chiếm
  }
})
