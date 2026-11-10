import type { Feature, MetadataItem, Outcome, Report, Scenario, SourceScenario, StepStatus } from './types';

/** Step statuses ordered from the most to the least severe */
const STATUS_PRIORITY: StepStatus[] = ['failed', 'ambiguous', 'undefined', 'pending', 'skipped', 'unknown', 'passed'];

const FAILED_STATUSES: StepStatus[] = ['failed', 'ambiguous', 'undefined'];
const SKIPPED_STATUSES: StepStatus[] = ['skipped', 'pending', 'unknown'];

export function scenarioStatus(scenario: SourceScenario): StepStatus {
    let worst = STATUS_PRIORITY.length - 1;
    for (const step of scenario.steps) {
        const index = STATUS_PRIORITY.indexOf(step.result.status);
        if (index !== -1 && index < worst) worst = index;
    }
    return STATUS_PRIORITY[worst];
}

export function toOutcome(status: StepStatus): Outcome {
    if (FAILED_STATUSES.includes(status)) return 'failed';
    if (SKIPPED_STATUSES.includes(status)) return 'skipped';
    return 'passed';
}

export function scenarioDuration(scenario: SourceScenario): number {
    return scenario.steps.reduce((duration, step) => duration + (step.result.duration ?? 0), 0);
}

function toScenario(source: SourceScenario): Scenario {
    const status = scenarioStatus(source);
    const outcome = toOutcome(status);
    return {
        ...source,
        status,
        outcome,
        isFailed: outcome === 'failed',
        duration: scenarioDuration(source)
    };
}

function featureOutcome(failed: number, passed: number): Outcome {
    if (failed > 0) return 'failed';
    if (passed > 0) return 'passed';
    return 'skipped';
}

export function buildFeatures(sourceData: SourceScenario[]): Feature[] {
    const groups = new Map<string, SourceScenario[]>();
    for (const testCase of sourceData) {
        const key = testCase.feature.uri ?? testCase.feature.name;
        const group = groups.get(key);
        if (group) {
            group.push(testCase);
        } else {
            groups.set(key, [testCase]);
        }
    }

    return [...groups.values()].map((sourceScenarios, index) => {
        const elements = sourceScenarios.map(toScenario);
        const count = (outcome: Outcome) => elements.filter(scenario => scenario.outcome === outcome).length;
        const passed = count('passed');
        const failed = count('failed');
        const skipped = count('skipped');
        return {
            ...sourceScenarios[0].feature,
            id: sourceScenarios[0].feature.id.replace(/[/#%?]/g, 'x') + index,
            elements,
            total: elements.length,
            passed,
            failed,
            skipped,
            duration: elements.reduce((duration, scenario) => duration + scenario.duration, 0),
            status: featureOutcome(failed, passed)
        };
    });
}

export function buildMetadata(metaSourceData: Record<string, string> = {}): MetadataItem[] {
    return Object.entries(metaSourceData)
        .map(([key, value], index) => ({ key, value: String(value), id: 'value' + index }));
}

export function buildReport(sourceData: SourceScenario[] = [], metaSourceData?: Record<string, string>): Report {
    return {
        features: buildFeatures(sourceData),
        metadata: buildMetadata(metaSourceData)
    };
}
