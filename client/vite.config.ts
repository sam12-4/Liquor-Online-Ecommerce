// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   build: {
//     outDir: 'build',
//     emptyOutDir: true,
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0', // Allow access from external networks
    port: 5173, // Ensure this matches your dev server port
    strictPort: true,
    allowedHosts: ['19c5-72-255-16-38.ngrok-free.app'], // Add your Ngrok domain here
    cors: true,
  }
})
