import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'
import { fileURLToPath, URL } from 'node:url'
import { writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'

// Emits dist/build.json with a unique build id so the app can detect
// stale precached chunks and reload when a new build ships.
function buildInfo(): Plugin {
  return {
    name: 'build-info',
    apply: 'build',
    closeBundle() {
      const buildTime = new Date().toISOString()
      const id = createHash('sha1').update(buildTime).digest('hex').slice(0, 12)
      mkdirSync('dist', { recursive: true })
      writeFileSync('dist/build.json', JSON.stringify({ version: '1.0.0', buildTime, id }))
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    buildInfo(),
    Sitemap({
      hostname: 'https://corun-zeta.vercel.app',
      dynamicRoutes: ['/', '/game'],
      readable: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'corun - Escape the Monster',
        short_name: 'corun',
        description: 'A pixel-art coding adventure game — solve JS puzzles to escape.',
        start_url: '/',
        scope: '/',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'any',
        categories: ['game', 'education', 'programming'],
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        screenshots: [
          {
            src: 'icons/Corun.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 * 365 },
            },
          },
          {
            urlPattern: /\/assets\/sandbox\.worker-.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sandbox-worker',
              expiration: { maxEntries: 3, maxAgeSeconds: 86400 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          fiber: ['@react-three/fiber'],
        },
      },
    },
  },
})
