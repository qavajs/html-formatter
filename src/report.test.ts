import { buildReport, countByStatus, errorHeadline, failureSignature, featureHasTag, featureMatchesSearch, scenarioStatus, toOutcome } from './report';
import type { SourceScenario, StepStatus } from './types';

function scenario(name: string, uri: string, statuses: StepStatus[], featureName = 'Feature'): SourceScenario {
    return {
        id: name,
        name,
        tags: [],
        feature: { id: 'feature' + name, name: featureName, uri, tags: [] },
        steps: statuses.map((status, index) => ({
            id: `${name}-${index}`,
            name: `step ${index}`,
            result: { status, duration: 1_000_000_000 }
        }))
    };
}

describe('scenarioStatus', () => {
    test.each<[StepStatus[], StepStatus]>([
        [['passed', 'passed'], 'passed'],
        [['passed', 'failed', 'skipped'], 'failed'],
        [['passed', 'undefined', 'skipped'], 'undefined'],
        [['passed', 'pending', 'skipped'], 'pending'],
        [['skipped'], 'skipped'],
        [['ambiguous', 'pending'], 'ambiguous']
    ])('%j -> %s', (statuses, expected) => {
        expect(scenarioStatus(scenario('s', 'a.feature', statuses))).toBe(expected);
    });
});

describe('toOutcome', () => {
    test.each<[StepStatus, string]>([
        ['passed', 'passed'],
        ['failed', 'failed'],
        ['ambiguous', 'failed'],
        ['undefined', 'failed'],
        ['pending', 'skipped'],
        ['skipped', 'skipped']
    ])('%s -> %s', (status, outcome) => {
        expect(toOutcome(status)).toBe(outcome);
    });
});

describe('buildReport', () => {
    test('groups scenarios by feature uri, not by name', () => {
        const { features } = buildReport([
            scenario('s1', 'a.feature', ['passed'], 'Same name'),
            scenario('s2', 'b.feature', ['failed'], 'Same name'),
            scenario('s3', 'a.feature', ['passed'], 'Same name')
        ]);
        expect(features).toHaveLength(2);
        expect(features[0].elements.map(s => s.name)).toEqual(['s1', 's3']);
        expect(features[1].elements.map(s => s.name)).toEqual(['s2']);
    });

    test('counts passed, failed and skipped scenarios separately', () => {
        const { features: [feature] } = buildReport([
            scenario('passed', 'a.feature', ['passed']),
            scenario('failed', 'a.feature', ['passed', 'failed', 'skipped']),
            scenario('pending', 'a.feature', ['passed', 'pending']),
            scenario('skipped', 'a.feature', ['skipped'])
        ]);
        expect(feature).toMatchObject({ total: 4, passed: 1, failed: 1, skipped: 2, status: 'failed' });
        expect(feature.elements.find(s => s.name === 'pending')?.isFailed).toBe(false);
    });

    test('feature without passed or failed scenarios is skipped', () => {
        const { features: [feature] } = buildReport([scenario('s', 'a.feature', ['skipped'])]);
        expect(feature.status).toBe('skipped');
    });

    test('sums durations', () => {
        const { features: [feature] } = buildReport([
            scenario('s1', 'a.feature', ['passed', 'passed']),
            scenario('s2', 'a.feature', ['passed'])
        ]);
        expect(feature.elements[0].duration).toBe(2_000_000_000);
        expect(feature.duration).toBe(3_000_000_000);
    });

    test('feature id is url-safe slug of feature path and unique', () => {
        const { features } = buildReport([
            scenario('s1', 'features/auth/Log in#1?.feature', ['passed']),
            scenario('s2', 'features/auth/Log in#1?.FEATURE', ['passed'])
        ]);
        expect(features.map(feature => feature.id)).toEqual(['features-auth-Log-in-1', 'features-auth-Log-in-1-2']);
    });

    test('builds metadata and tolerates missing data', () => {
        expect(buildReport(undefined, { OS: 'macos' })).toEqual({
            features: [],
            metadata: [{ key: 'OS', value: 'macos', id: 'value0' }],
            run: { startedAt: undefined, finishedAt: undefined, wallDuration: undefined, totalDuration: 0 }
        });
    });
});

describe('retries and run timing', () => {
    test('marks scenario passed after retry as flaky and counts it per feature', () => {
        const flaky = { ...scenario('s1', 'a.feature', ['passed']), attempt: 1 };
        const retriedFailed = { ...scenario('s2', 'a.feature', ['failed']), attempt: 1 };
        const { features } = buildReport([flaky, retriedFailed]);
        expect(features[0].elements.map(item => [item.isFlaky, item.retries])).toEqual([[true, 1], [false, 1]]);
        expect(features[0].flaky).toBe(1);
    });

    test('wall clock duration spans earliest start to latest finish', () => {
        const { run } = buildReport([
            { ...scenario('s1', 'a.feature', ['passed', 'passed']), startedAt: 1_000, finishedAt: 3_000 },
            { ...scenario('s2', 'b.feature', ['passed', 'passed']), startedAt: 1_500, finishedAt: 4_000 }
        ]);
        expect(run.startedAt).toBe(1_000);
        expect(run.wallDuration).toBe(3_000_000_000);
        expect(run.totalDuration).toBe(4_000_000_000);
    });

    test('no wall clock duration without timestamps', () => {
        expect(buildReport([scenario('s1', 'a.feature', ['passed'])]).run.wallDuration).toBeUndefined();
    });
});

describe('failure grouping', () => {
    const failed = (message?: string) => {
        const source = scenario('s', 'a.feature', ['passed', 'failed']);
        source.steps[1].result.error_message = message;
        return buildReport([source]).features[0].elements[0];
    };

    test('headline skips blank lines and ansi colors', () => {
        expect(errorHeadline('\n  \u001b[31mAssertionError: boom\u001b[39m\n    at x')).toBe('AssertionError: boom');
    });

    test('masks numbers so similar errors share a group', () => {
        expect(failureSignature(failed('expected 3 to equal 5')).key).toBe(failureSignature(failed('expected 4 to equal 5')).key);
        expect(failureSignature(failed('expected 3 to equal 5')).title).toBe('expected 3 to equal 5');
    });

    test('undefined steps and missing messages get their own groups', () => {
        const undefinedStep = buildReport([scenario('u', 'a.feature', ['passed', 'undefined'])]).features[0].elements[0];
        expect(failureSignature(undefinedStep).title).toBe('Undefined step');
        expect(failureSignature(failed()).title).toBe('Failed without error message');
    });
});

describe('search, tags and status counts', () => {
    const source = scenario('s1', 'a.feature', ['passed', 'failed']);
    source.tags = [{ name: '@smoke' }];
    source.steps[1].result.error_message = 'AssertionError: expected cart';
    const report = buildReport([source, scenario('s2', 'a.feature', ['passed', 'undefined']), scenario('s3', 'b.feature', ['pending'])]);
    const [featureA, featureB] = report.features;

    test('feature search looks into scenario steps and errors', () => {
        expect(featureMatchesSearch(featureA, 'step 1')).toBe(true);
        expect(featureMatchesSearch(featureA, 'expected CART')).toBe(true);
        expect(featureMatchesSearch(featureB, 'expected cart')).toBe(false);
    });

    test('feature has tag when any of its scenarios has it', () => {
        expect(featureHasTag(featureA, '@smoke')).toBe(true);
        expect(featureHasTag(featureB, '@smoke')).toBe(false);
        expect(featureHasTag(featureB, '')).toBe(true);
    });

    test('counts scenarios by detailed status', () => {
        expect(countByStatus(report.features.flatMap(feature => feature.elements)))
            .toEqual({ failed: 1, undefined: 1, pending: 1 });
    });
});
