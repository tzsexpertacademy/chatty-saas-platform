import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxImportSource: 'react'
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  },
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})