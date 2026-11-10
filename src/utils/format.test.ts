import { formatBytes, formatDuration, matchesSearch, percent } from './format';

describe('formatDuration', () => {
    test.each([
        [0, '0ms'],
        [12_400_000, '12ms'],
        [999_400_000, '999ms'],
        [1_234_000_000, '1.23s'],
        [63_500_000_000, '1m 3.50s'],
        [3_723_000_000_000, '1h 2m 3s']
    ])('%d ns -> %s', (nanos, expected) => {
        expect(formatDuration(nanos)).toBe(expected);
    });
});

describe('matchesSearch', () => {
    test('is case insensitive and matches everything for empty search', () => {
        expect(matchesSearch('Login Feature', 'login')).toBe(true);
        expect(matchesSearch('Login Feature', 'logout')).toBe(false);
        expect(matchesSearch('anything', '')).toBe(true);
    });
});

describe('percent', () => {
    test('handles zero total', () => {
        expect(percent(1, 3)).toBe(33);
        expect(percent(0, 0)).toBe(0);
    });
});

describe('formatBytes', () => {
    test.each([
        [0, '0 B'],
        [512, '512 B'],
        [1536, '1.5 KB'],
        [20 * 1024, '20 KB'],
        [5 * 1024 * 1024, '5.0 MB']
    ])('%d -> %s', (bytes, expected) => {
        expect(formatBytes(bytes)).toBe(expected);
    });
});
