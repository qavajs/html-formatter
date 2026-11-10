import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { injectReportData, readScenarios } from '../../scripts/vite-report-data.mjs';

const template = '<script>window.metaSourceData = METADATA; window.sourceData = [SOURCE_DATA];</script>';
const logger = { warn: vi.fn<(message: string) => void>() };

const scenario = {
    id: '1',
    name: 'has </script> in name',
    steps: [{
        id: 's1',
        embeddings: [
            { mime_type: 'text/x.cucumber.log+plain', data: 'log' },
            { mime_type: 'image/png', data: 'png' }
        ]
    }]
};

function evaluate(html: string) {
    const window: Record<string, unknown> = {};
    const script = html.replace(/^<script>|<\/script>$/g, '');
    new Function('window', script)(window);
    return window;
}

describe('injectReportData', () => {
    test('injects scenarios and metadata as valid, script-safe js', () => {
        const html = injectReportData(template, [scenario, scenario], { metadata: { OS: '$& macos' } });
        expect(html.match(/<\/script>/g)).toHaveLength(1);
        const window = evaluate(html);
        expect(window.metaSourceData).toEqual({ OS: '$& macos' });
        expect(window.sourceData).toEqual([scenario, scenario]);
    });

    test('filters logs when showLogs is false', () => {
        const window = evaluate(injectReportData(template, [scenario], { showLogs: false }));
        const [{ steps: [step] }] = window.sourceData as typeof scenario[];
        expect(step.embeddings.map(e => e.mime_type)).toEqual(['image/png']);
    });

    test('works with no data', () => {
        expect(evaluate(injectReportData(template, []))).toEqual({ metaSourceData: {}, sourceData: [] });
    });
});

describe('readScenarios', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'report-data-'));

    test('returns empty list for missing, empty or invalid file', () => {
        const empty = path.join(dir, 'empty.json');
        const invalid = path.join(dir, 'invalid.json');
        writeFileSync(empty, '');
        writeFileSync(invalid, '[{');
        expect(readScenarios(path.join(dir, 'missing.json'), logger)).toEqual([]);
        expect(readScenarios(empty, logger)).toEqual([]);
        expect(readScenarios(invalid, logger)).toEqual([]);
        expect(logger.warn).toHaveBeenCalledTimes(3);
    });

    test('reads scenarios', () => {
        const file = path.join(dir, 'report.json');
        writeFileSync(file, JSON.stringify([scenario]));
        expect(readScenarios(file, logger)).toEqual([scenario]);
    });
});
