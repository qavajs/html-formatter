import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildScenario, serializeForScript, timestampToMillis, ScenarioCollector } = require('../../formatter/common.js');

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
        expect(scenario.steps.map((step: { keyword?: string }) => step.keyword))
            .toEqual(['Before', undefined, undefined, 'After']);
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

describe('buildScenario keywords, attempts and timing', () => {
    const testCase = {
        attempt: 2,
        gherkinDocument: {
            uri: 'features/b.feature',
            feature: {
                name: 'Feature', keyword: 'Feature', description: '', location: { line: 1 }, tags: [],
                children: [
                    { background: { id: 'bg', keyword: 'Background', steps: [{ id: 'g0', keyword: 'Given ' }] } },
                    { rule: { children: [{ scenario: { id: 'sc', keyword: 'Scenario Outline', steps: [{ id: 'g1', keyword: 'When ' }, { id: 'g2', keyword: 'And ' }] } }] } }
                ]
            }
        },
        pickle: {
            id: 'p', name: 'outline 1', tags: [], astNodeIds: ['sc', 'row1'],
            steps: [
                { id: 'ps0', text: 'background', astNodeIds: ['g0'] },
                { id: 'ps1', text: 'first', astNodeIds: ['g1', 'row1'] },
                { id: 'ps2', text: 'second', astNodeIds: ['g2', 'row1'] }
            ]
        },
        testCase: { id: 'tc', testSteps: [{ id: 'h', hookId: 'h1' }, { id: 't0', pickleStepId: 'ps0' }, { id: 't1', pickleStepId: 'ps1' }, { id: 't2', pickleStepId: 'ps2' }] },
        stepResults: Object.fromEntries(['h', 't0', 't1', 't2'].map(id => [id, { status: 'PASSED', duration: { seconds: 0, nanos: 0 } }])),
        stepAttachments: {}
    };

    test('resolves gherkin keywords of steps and scenario (including rules)', () => {
        const scenario = buildScenario(testCase, {});
        expect(scenario.keyword).toBe('Scenario Outline');
        expect(scenario.steps.map((step: { keyword?: string }) => step.keyword)).toEqual(['Before', 'Given', 'When', 'And']);
    });

    test('keeps attempt and timestamps', () => {
        const scenario = buildScenario(testCase, {}, {
            timestamps: { started: { seconds: 10, nanos: 500_000_000 }, finished: { seconds: 12, nanos: 0 } }
        });
        expect(scenario.attempt).toBe(2);
        expect(scenario.startedAt).toBe(10_500);
        expect(scenario.finishedAt).toBe(12_000);
    });

    test('timestampToMillis handles missing timestamp', () => {
        expect(timestampToMillis(undefined)).toBeUndefined();
    });
});

describe('scenario outline examples', () => {
    test('maps example row values by header', () => {
        const scenario = buildScenario({
            gherkinDocument: {
                uri: 'o.feature',
                feature: {
                    name: 'F', keyword: 'Feature', location: { line: 1 }, tags: [],
                    children: [{ scenario: { id: 'sc', keyword: 'Scenario Outline', steps: [], examples: [{
                        tableHeader: { cells: [{ value: 'user' }, { value: 'role' }] },
                        tableBody: [{ id: 'r1', cells: [{ value: 'bob' }, { value: 'admin' }] }]
                    }] } }]
                }
            },
            pickle: { id: 'p', name: 'outline', tags: [], astNodeIds: ['sc', 'r1'], steps: [] },
            testCase: { id: 'tc', testSteps: [] },
            stepResults: {},
            stepAttachments: {}
        }, {});
        expect(scenario.examples).toEqual([{ name: 'user', value: 'bob' }, { name: 'role', value: 'admin' }]);
    });
});

describe('ScenarioCollector', () => {
    const attempt = (attemptNumber: number, status: string, message?: string) => ({
        attempt: attemptNumber,
        gherkinDocument: { uri: 'a.feature', feature: { name: 'F', keyword: 'Feature', location: { line: 1 }, tags: [], children: [] } },
        pickle: { id: 'p', name: 'retried', tags: [], steps: [{ id: 'ps', text: 'flaky step' }] },
        testCase: { id: 'tc', testSteps: [{ id: 'ts', pickleStepId: 'ps' }] },
        stepResults: { ts: { status, message, duration: { seconds: 1, nanos: 0 } } },
        stepAttachments: {}
    });

    test('reports only the final attempt with summaries of retried ones and first start time', () => {
        const attempts: Record<string, ReturnType<typeof attempt>> = {
            started1: attempt(0, 'FAILED', 'boom'),
            started2: attempt(1, 'PASSED')
        };
        const collector = new ScenarioCollector({ getTestCaseAttempt: (id: string) => attempts[id] });
        const results = [
            { testCaseStarted: { id: 'started1', testCaseId: 'tc', timestamp: { seconds: 10, nanos: 0 } } },
            { testCaseFinished: { testCaseStartedId: 'started1', willBeRetried: true, timestamp: { seconds: 11, nanos: 0 } } },
            { testCaseStarted: { id: 'started2', testCaseId: 'tc', timestamp: { seconds: 12, nanos: 0 } } },
            { testCaseFinished: { testCaseStartedId: 'started2', willBeRetried: false, timestamp: { seconds: 13, nanos: 0 } } }
        ].map(envelope => collector.processEnvelope(envelope)).filter(Boolean);

        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({ attempt: 1, startedAt: 10_000, finishedAt: 13_000 });
        expect(results[0].previousAttempts).toEqual([
            { attempt: 0, status: 'failed', step: 'flaky step', error: 'boom', duration: 1_000_000_000 }
        ]);
    });
});
