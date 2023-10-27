import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react(), viteSingleFile()],
    optimizeDeps: {},
    test: {
        include: ['**/*.test.tsx'],
        globals: true,
        environment: 'jsdom',
        setupFiles: 'vitest-setup.js',
        deps: {
            web: {
                transformCss: false,
                transformAssets: false,
            },
        },
    },
});
