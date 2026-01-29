import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// Get all HTML files from public directory
function getHtmlEntries(dir: string) {
  const entries: Record<string, string> = {}
  
  function scanDir(currentDir: string, prefix: string = '') {
    const files = readdirSync(currentDir)
    
    files.forEach(file => {
      const fullPath = resolve(currentDir, file)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDir(fullPath, prefix + file + '/')
      } else if (file.endsWith('.html')) {
        const name = prefix + file.replace('.html', '')
        entries[name] = fullPath
      }
    })
  }
  
  scanDir(dir)
  return entries
}

// https://vite.dev/config/
export default defineConfig({
  base: '/BloodLink/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries(resolve(__dirname, 'public'))
    }
  }
})
