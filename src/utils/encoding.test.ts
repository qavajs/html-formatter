import {
    decodeBase64,
    embeddingAsBase64,
    embeddingAsText,
    embeddingDataUrl,
    embeddingSize,
    encodeBase64,
    tryParseJson
} from './encoding';

describe('base64', () => {
    test('round-trips UTF-8 text', () => {
        const text = 'Привет, 世界 ✓';
        expect(decodeBase64(encodeBase64(text))).toBe(text);
    });

    test('decodes UTF-8 correctly (atob alone would not)', () => {
        expect(decodeBase64('0J/RgNC40LLQtdGC')).toBe('Привет');
    });
});

describe('embedding encoding', () => {
    test('identity text is returned as is', () => {
        expect(embeddingAsText({ data: 'plain', mime_type: 'text/plain', contentEncoding: 'IDENTITY' })).toBe('plain');
    });

    test('base64 text is decoded', () => {
        expect(embeddingAsText({ data: encodeBase64('decoded ✓'), mime_type: 'text/plain', contentEncoding: 'BASE64' }))
            .toBe('decoded ✓');
    });

    test('invalid base64 marked as BASE64 falls back to raw data', () => {
        const embedding = { data: 'I\'m base 64 encoded text', mime_type: 'text/plain', contentEncoding: 'BASE64' as const };
        expect(embeddingAsText(embedding)).toBe(embedding.data);
    });

    test('identity data is encoded for data urls', () => {
        expect(embeddingDataUrl({ data: '<b>hi</b>', mime_type: 'text/html', contentEncoding: 'IDENTITY' }))
            .toBe(`data:text/html;base64,${encodeBase64('<b>hi</b>')}`);
    });

    test('images without contentEncoding are treated as base64', () => {
        expect(embeddingAsBase64({ data: 'iVBORw0KGgo=', mime_type: 'image/png' })).toBe('iVBORw0KGgo=');
    });
});

describe('tryParseJson', () => {
    test('parses valid json', () => {
        expect(tryParseJson('{"a":1}')).toEqual({ ok: true, value: { a: 1 } });
    });

    test('returns error for invalid json', () => {
        const result = tryParseJson('{invalid');
        expect(result.ok).toBe(false);
    });
});

describe('external attachments', () => {
    const external = { data: '', mime_type: 'image/png', url: 'attachments/abc.png', size: 2048 };

    test('use file url and stored size', () => {
        expect(embeddingDataUrl(external)).toBe('attachments/abc.png');
        expect(embeddingSize(external)).toBe(2048);
        expect(embeddingSize({ data: 'abc', mime_type: 'text/plain', contentEncoding: 'IDENTITY' })).toBe(3);
    });
});
