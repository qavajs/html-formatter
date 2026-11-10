import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { reportData } from './scripts/vite-report-data.mjs';
import sampleConfig, { json as sampleDataProfile } from './test/report.ts';

const [, sampleDataFile] = sampleDataProfile.format.find(([formatter]) => formatter.includes('json_formatter'));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr({ include: '**/*.svg?react' }),
        react(),
        viteSingleFile(),
        reportData({
            dataFile: sampleDataFile,
            htmlConfig: sampleConfig.formatOptions.htmlConfig
        })
    ],
    test: {
        include: ['src/**/*.test.{ts,tsx}', 'test/unit/**/*.test.ts'],
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
