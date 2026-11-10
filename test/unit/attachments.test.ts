import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createAttachmentFiles, isTextual, mimeExtension } = require('../../formatter/attachments.js');
const { toEmbedding } = require('../../formatter/common.js');

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64');

describe('external attachments', () => {
    test('writes binary attachments once per content and references them relative to the report', () => {
        const reportDir = mkdtempSync(path.join(tmpdir(), 'report-'));
        const files = createAttachmentFiles(path.join(reportDir, 'report.html'));
        const scenario = {
            steps: [{
                embeddings: [
                    { data: png, mime_type: 'image/png', contentEncoding: 'BASE64', fileName: 'shot.png' },
                    { data: png, mime_type: 'image/png', contentEncoding: 'BASE64' },
                    { data: 'log line', mime_type: 'text/x.cucumber.log+plain', contentEncoding: 'IDENTITY' },
                    { data: '{"a":1}', mime_type: 'application/json', contentEncoding: 'IDENTITY' }
                ]
            }, {}]
        };

        files.apply(scenario);
        const [image, duplicate, log, json] = scenario.steps[0].embeddings;

        expect(image).toMatchObject({ data: '', mime_type: 'image/png', fileName: 'shot.png', size: 4 });
        expect(image.url).toMatch(/^attachments\/[0-9a-f]{20}\.png$/);
        expect(duplicate.url).toBe(image.url);
        expect(log.data).toBe('log line');
        expect(json.data).toBe('{"a":1}');
        expect(readdirSync(path.join(reportDir, 'attachments'))).toHaveLength(1);
        expect(readFileSync(path.join(reportDir, image.url))).toEqual(Buffer.from(png, 'base64'));
    });

    test('custom directory and no report file', () => {
        const reportDir = mkdtempSync(path.join(tmpdir(), 'report-'));
        const files = createAttachmentFiles(path.join(reportDir, 'report.html'), 'assets/report files');
        expect(files.urlPrefix).toBe('assets/report%20files');
        expect(createAttachmentFiles(undefined)).toBeUndefined();
    });

    test('mime helpers', () => {
        expect(isTextual('text/html')).toBe(true);
        expect(isTextual('application/vnd.api+json')).toBe(true);
        expect(isTextual('image/png')).toBe(false);
        expect(mimeExtension('image/jpeg')).toBe('jpg');
        expect(mimeExtension('video/webm')).toBe('webm');
        expect(mimeExtension('weird')).toBe('bin');
    });
});

describe('toEmbedding', () => {
    test('keeps attachment body only once', () => {
        const embedding = toEmbedding({ body: 'abc', mediaType: 'text/plain', contentEncoding: 'IDENTITY', testStepId: 'x', timestamp: {} });
        expect(embedding).toEqual({ data: 'abc', mime_type: 'text/plain', contentEncoding: 'IDENTITY' });
    });
});
