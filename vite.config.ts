import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// Asset pointers (*.asset.json) store site-relative URLs; the native app runs from a local
// origin, so production builds rewrite them to the absolute site URL.
const ASSET_ORIGIN = "https://bibliatoonclub.com";
const absoluteAssetUrls = () => ({
  name: "absolute-asset-urls",
  enforce: "pre" as const,
  apply: "build" as const,
  transform(code: string, id: string) {
    if (!id.split("?")[0].endsWith(".asset.json")) return null;
    return { code: code.split('"/__l5e/').join(`"${ASSET_ORIGIN}/__l5e/`), map: null };
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    absoluteAssetUrls(),
    react(), 
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache para vídeos locais com Range Requests
      {
        urlPattern: /\.(?:mp4|webm|ogg|mov)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'video-cache',
          rangeRequests: true,
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
          },
          cacheableResponse: {
            statuses: [200]
          }
        }
      },
      // Cache para vídeos do Supabase Storage com Range Requests
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*\.(?:mp4|webm|ogg|mov)/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'supabase-video-cache',
          rangeRequests: true,
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
          },
          cacheableResponse: {
            statuses: [200]
          }
        }
      },
      // Cache para imagens do Supabase Storage
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*\.(?:png|jpg|jpeg|webp|gif|svg)/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'supabase-images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Supabase API cache (excluindo storage)
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/(?!storage\/).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5
          }
        }
      }
    ]
  },
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'favicon.ico'],
      manifest: {
        name: 'BíbliaToon Club',
        short_name: 'BíbliaToon Club',
        description: 'A Bíblia Ganha Vida para as Crianças e Pais!',
        theme_color: '#00ff00',
        background_color: '#000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
