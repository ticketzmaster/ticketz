import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Tickets',
        short_name: 'Tickets',
        description: 'Find events, keep your tickets and get in with your phone.',
        lang: 'en',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#121212',
        theme_color: '#121212',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // The kill-switch status must never be served from a SW cache.
            urlPattern: ({ url }) =>
              url.origin === 'https://gist.githubusercontent.com' &&
              url.pathname.includes('/ticketzmaster/'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'event-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // Keep the service worker out of `vite dev`; stale dev caches caused
      // missing CSS after port changes. Test the PWA via build + preview.
      devOptions: { enabled: false },
    }),
  ],
})
