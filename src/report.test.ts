import { buildReport, scenarioStatus, toOutcome } from './report';
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

    test('feature id does not contain url-unsafe characters', () => {
        const source = scenario('s', 'a.feature', ['passed']);
        source.feature.id = 'feature/with#unsafe%chars?';
        const { features: [feature] } = buildReport([source]);
        expect(feature.id).toBe('featurexwithxunsafexcharsx0');
    });

    test('builds metadata and tolerates missing data', () => {
        expect(buildReport(undefined, { OS: 'macos' })).toEqual({
            features: [],
            metadata: [{ key: 'OS', value: 'macos', id: 'value0' }]
        });
    });
});
