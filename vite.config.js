import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // Bundle analyzer (only in analyze mode)
        process.env.npm_lifecycle_script?.includes("analyze") &&
            visualizer({
                open: true,
                gzipSize: true,
                brotliSize: true,
                filename: "dist/stats.html",
            }),
    ].filter(Boolean),
    // Performance optimizations
    build: {
        // Target modern browsers for smaller bundles
        target: "es2020",
        // Minification
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
                pure_funcs: ["console.log", "console.info"], // Remove specific console methods
            },
            mangle: {
                safari10: true, // Safari 10 bug fix
            },
        },
        // Chunk size warnings
        chunkSizeWarningLimit: 1000,
        // Rollup optimizations
        rollupOptions: {
            output: {
                // Manual chunking for better caching
                manualChunks: {
                    // React ecosystem
                    "react-vendor": ["react", "react-dom"],
                    router: ["react-router-dom"],
                    // State management
                    state: ["zustand"],
                    // Large data files (separate chunks for better caching)
                    "data-hsk": ["./src/data/hsk-complete.json"],
                    "data-chengyu": ["./src/data/chengyu-idioms.json"],
                    "data-sentences": ["./src/data/sentence-pairs-zh-en.json"],
                    "data-other": [
                        "./src/data/radicals.json",
                        "./src/data/tone-pairs.json",
                        "./src/data/measure-words-extracted.json",
                    ],
                },
                // Asset file naming
                assetFileNames: (assetInfo) => {
                    if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(assetInfo.name || "")) {
                        return `assets/images/[name].[hash][extname]`;
                    }
                    if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || "")) {
                        return `assets/fonts/[name].[hash][extname]`;
                    }
                    if (/\.(mp3|wav|ogg)$/i.test(assetInfo.name || "")) {
                        return `assets/audio/[name].[hash][extname]`;
                    }
                    return `assets/[name].[hash][extname]`;
                },
                // Chunk file naming
                chunkFileNames: "assets/js/[name].[hash].js",
                entryFileNames: "assets/js/[name].[hash].js",
            },
        },
        // Source maps (only in development)
        sourcemap: false,
        // CSS code splitting
        cssCodeSplit: true,
    },
    // Dependency optimization
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom", "zustand"],
        exclude: [
            // Exclude large data files from pre-bundling
            "./src/data/hsk-complete.json",
            "./src/data/chengyu-idioms.json",
        ],
    },
    // Server configuration
    server: {
        port: 5173,
        host: true,
        open: false,
        // CORS
        cors: true,
        // Performance
        hmr: {
            overlay: true,
        },
    },
    // Preview configuration
    preview: {
        port: 4173,
        host: true,
        open: false,
    },
    // Asset handling
    assetsInclude: ["**/*.mp3", "**/*.wav"],
    // Public directory
    publicDir: "public",
});
