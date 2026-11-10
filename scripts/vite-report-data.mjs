import { existsSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { LOG_MIME_TYPE, serializeForScript } = require('../formatter/common.js');

/**
 * Reads scenarios produced by json_formatter.
 * Returns empty list if file is missing, empty (being rewritten) or invalid.
 */
export function readScenarios(dataFile, logger = console) {
    if (!existsSync(dataFile) || statSync(dataFile).size === 0) {
        logger.warn(`[report-data] ${dataFile} not found or empty, run "npm run report:data"`);
        return [];
    }
    try {
        return JSON.parse(readFileSync(dataFile, 'utf-8'));
    } catch (err) {
        logger.warn(`[report-data] cannot parse ${dataFile}: ${err.message}`);
        return [];
    }
}

/**
 * Fills report template placeholders the same way formatter/formatter.js does
 */
export function injectReportData(html, scenarios, { metadata = {}, showLogs = true } = {}) {
    const data = showLogs
        ? scenarios
        : scenarios.map(scenario => ({
            ...scenario,
            steps: scenario.steps.map(step => ({
                ...step,
                embeddings: step.embeddings?.filter(embedding => embedding.mime_type !== LOG_MIME_TYPE)
            }))
        }));
    return html
        .replace('METADATA', () => serializeForScript(metadata))
        .replace('SOURCE_DATA', () => data.map(serializeForScript).join(','));
}

/**
 * Dev server plugin: injects sample report data (and metadata from htmlConfig) into index.html,
 * generates data on first start and reloads the page whenever the data file is regenerated.
 *
 * @param {object} options
 * @param {string} options.dataFile - path to json produced by json_formatter
 * @param {{ metadata?: Record<string, string>, showLogs?: boolean }} [options.htmlConfig]
 * @param {string} [options.generateScript] - npm script that produces dataFile
 */
export function reportData({ dataFile, htmlConfig = {}, generateScript = 'report:data' }) {
    const file = path.resolve(dataFile);
    return {
        name: 'qavajs-report-data',
        apply: 'serve',
        configureServer(server) {
            const logger = server.config.logger;
            if (!existsSync(file)) {
                logger.info(`[report-data] ${dataFile} not found, running "npm run ${generateScript}"`);
                spawnSync('npm', ['run', generateScript], { stdio: 'inherit', shell: process.platform === 'win32' });
            }
            server.watcher.add(file);
            server.watcher.on('change', changed => {
                // formatter truncates file at the start of the run, reload only when data is written
                if (path.resolve(changed) !== file || statSync(file).size === 0) return;
                logger.info('[report-data] report data changed, reloading', { timestamp: true });
                server.ws.send({ type: 'full-reload' });
            });
        },
        transformIndexHtml(html) {
            return injectReportData(html, readScenarios(file), htmlConfig);
        }
    };
}
