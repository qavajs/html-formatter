import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildScenario, serializeForScript } = require('../../formatter/common.js');

describe('serializeForScript', () => {
    test('cannot break out of inline script', () => {
        const serialized = serializeForScript({ error: 'expected </script><script>alert(1)</script>' });
        expect(serialized).not.toContain('</script>');
        expect(serialized).not.toContain('<');
        expect(JSON.parse(serialized)).toEqual({ error: 'expected </script><script>alert(1)</script>' });
    });

    test('escapes line and paragraph separators', () => {
        const serialized = serializeForScript({ text: 'a b c' });
        expect(serialized).toContain('\\u2028');
        expect(serialized).toContain('\\u2029');
        expect(JSON.parse(serialized).text).toBe('a b c');
    });
});

describe('buildScenario', () => {
    const testCase = {
        gherkinDocument: {
            uri: 'features/a.feature',
            feature: { name: 'Feature', keyword: 'Feature', description: '', location: { line: 1 }, tags: [{ name: '@f', location: { line: 1 } }] }
        },
        pickle: {
            id: 'pickle1',
            name: 'Scenario',
            tags: [{ name: '@s' }],
            steps: [
                { id: 'ps1', text: 'step without argument' },
                { id: 'ps2', text: 'step with table', argument: { dataTable: { rows: [{ cells: [{ value: 'a' }] }] } } }
            ]
        },
        testCase: {
            testSteps: [
                { id: 'ts0', hookId: 'h1' },
                { id: 'ts1', pickleStepId: 'ps1' },
                { id: 'ts2', pickleStepId: 'ps2' },
                { id: 'ts3', hookId: 'h2' }
            ]
        },
        stepResults: {
            ts0: { status: 'PASSED', duration: { seconds: 0, nanos: 5 } },
            ts1: { status: 'PASSED', duration: { seconds: 1, nanos: 0 } },
            ts2: { status: 'FAILED', duration: { seconds: 0, nanos: 0 }, message: 'boom' },
            ts3: { status: 'SKIPPED', duration: { seconds: 0, nanos: 0 } }
        },
        stepAttachments: {
            ts1: [
                { mediaType: 'text/x.cucumber.log+plain', body: 'log', contentEncoding: 'IDENTITY' },
                { mediaType: 'image/png', body: 'iVBORw0KGgo=', contentEncoding: 'BASE64' }
            ]
        }
    };

    test('maps steps, hooks and results', () => {
        const scenario = buildScenario(testCase, { h1: { id: 'h1', name: 'setup' } });
        expect(scenario.feature).toMatchObject({ name: 'Feature', uri: 'features/a.feature', tags: [{ name: '@f', line: 1 }] });
        expect(scenario.steps.map((step: { name: string }) => step.name))
            .toEqual(['setup', 'step without argument', 'step with table', 'After']);
        expect(scenario.steps[1].result).toEqual({ status: 'passed', duration: 1_000_000_000, error_message: undefined });
        expect(scenario.steps[2].result.error_message).toBe('boom');
    });

    test('step without argument has no arguments', () => {
        const scenario = buildScenario(testCase, {});
        expect(scenario.steps[1].arguments).toBeUndefined();
        expect(scenario.steps[2].arguments).toEqual([{ rows: [{ cells: [{ value: 'a' }] }] }]);
    });

    test('keeps contentEncoding and filters logs when showLogs is false', () => {
        const withLogs = buildScenario(testCase, {});
        expect(withLogs.steps[1].embeddings).toHaveLength(2);
        expect(withLogs.steps[1].embeddings[1]).toMatchObject({ mime_type: 'image/png', contentEncoding: 'BASE64' });
        const withoutLogs = buildScenario(testCase, {}, { showLogs: false });
        expect(withoutLogs.steps[1].embeddings.map((e: { mime_type: string }) => e.mime_type)).toEqual(['image/png']);
    });

    test('does not mutate collector test steps', () => {
        buildScenario(testCase, {});
        expect(testCase.testCase.testSteps[1]).toEqual({ id: 'ts1', pickleStepId: 'ps1' });
    });
});
