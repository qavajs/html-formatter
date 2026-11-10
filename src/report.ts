import type { Feature, MetadataItem, Outcome, Report, RunInfo, Scenario, SourceScenario, StepStatus } from './types';

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
    const retries = source.attempt ?? 0;
    return {
        ...source,
        status,
        outcome,
        isFailed: outcome === 'failed',
        isFlaky: outcome === 'passed' && retries > 0,
        retries,
        duration: scenarioDuration(source)
    };
}

function featureOutcome(failed: number, passed: number): Outcome {
    if (failed > 0) return 'failed';
    if (passed > 0) return 'passed';
    return 'skipped';
}

/**
 * Url-safe feature id derived from the feature file path, so links stay valid between runs
 * of the same suite, e.g. features/auth/Login.feature -> features-auth-Login
 */
export function featureSlug(key: string): string {
    const slug = key
        .replace(/\.feature$/i, '')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'feature';
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

    const usedIds = new Map<string, number>();
    const uniqueId = (key: string) => {
        const slug = featureSlug(key);
        const count = usedIds.get(slug) ?? 0;
        usedIds.set(slug, count + 1);
        return count === 0 ? slug : `${slug}-${count + 1}`;
    };

    return [...groups.entries()].map(([key, sourceScenarios]) => {
        const elements = sourceScenarios.map(toScenario);
        const count = (outcome: Outcome) => elements.filter(scenario => scenario.outcome === outcome).length;
        const passed = count('passed');
        const failed = count('failed');
        const skipped = count('skipped');
        return {
            ...sourceScenarios[0].feature,
            id: uniqueId(key),
            elements,
            total: elements.length,
            passed,
            failed,
            skipped,
            flaky: elements.filter(scenario => scenario.isFlaky).length,
            duration: elements.reduce((duration, scenario) => duration + scenario.duration, 0),
            status: featureOutcome(failed, passed)
        };
    });
}

export function buildMetadata(metaSourceData: Record<string, string> = {}): MetadataItem[] {
    return Object.entries(metaSourceData)
        .map(([key, value], index) => ({ key, value: String(value), id: 'value' + index }));
}

const NANOS_IN_MILLI = 1_000_000;

/**
 * Run timing: wall clock duration comes from scenario timestamps (correct for parallel runs),
 * total duration is the sum of scenario durations
 */
export function buildRunInfo(features: Feature[]): RunInfo {
    const scenarios = features.flatMap(feature => feature.elements);
    const starts = scenarios.map(scenario => scenario.startedAt).filter((value): value is number => typeof value === 'number');
    const finishes = scenarios.map(scenario => scenario.finishedAt).filter((value): value is number => typeof value === 'number');
    const startedAt = starts.length > 0 ? Math.min(...starts) : undefined;
    const finishedAt = finishes.length > 0 ? Math.max(...finishes) : undefined;
    return {
        startedAt,
        finishedAt,
        wallDuration: startedAt !== undefined && finishedAt !== undefined && finishedAt >= startedAt
            ? (finishedAt - startedAt) * NANOS_IN_MILLI
            : undefined,
        totalDuration: scenarios.reduce((duration, scenario) => duration + scenario.duration, 0)
    };
}

// ansi color escape sequences, the control character is intentional
// oxlint-disable-next-line no-control-regex
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;

export function stripAnsi(text: string): string {
    return text.replace(ANSI_PATTERN, '');
}

/** First meaningful line of an error message without ansi colors */
export function errorHeadline(message: string): string {
    return stripAnsi(message)
        .split('\n')
        .map(line => line.trim())
        .find(line => line.length > 0) ?? '';
}

/**
 * Failure signature used to group failed scenarios: headline of the first failing step error
 * with numbers masked, so "expected 3 to equal 5" and "expected 4 to equal 5" fall into one group
 */
export function failureSignature(scenario: Scenario): { key: string, title: string } {
    const step = scenario.steps.find(item => FAILED_STATUSES.includes(item.result.status));
    if (!step) return { key: 'unknown', title: 'Unknown failure' };
    if (step.result.status === 'undefined') return { key: 'undefined', title: 'Undefined step' };
    if (step.result.status === 'ambiguous') return { key: 'ambiguous', title: 'Ambiguous step definition' };
    const title = errorHeadline(step.result.error_message ?? '');
    if (!title) return { key: 'empty', title: 'Failed without error message' };
    return { key: title.replace(/\d+(\.\d+)?/g, 'N'), title };
}

const searchTexts = new WeakMap<Scenario, string>();

/** Lower-cased text scenario search runs against: name, example values, tags, step text and error messages */
function scenarioSearchText(scenario: Scenario): string {
    let text = searchTexts.get(scenario);
    if (text === undefined) {
        text = [
            scenario.name,
            ...(scenario.examples ?? []).map(example => example.value),
            ...scenario.tags.map(tag => tag.name),
            ...scenario.steps.flatMap(step => [step.name ?? '', step.result.error_message ?? ''])
        ].join('\n').toLowerCase();
        searchTexts.set(scenario, text);
    }
    return text;
}

export function scenarioMatchesSearch(scenario: Scenario, search: string): boolean {
    return !search || scenarioSearchText(scenario).includes(search.toLowerCase());
}

export function featureMatchesSearch(feature: Feature, search: string): boolean {
    return !search
        || feature.name.toLowerCase().includes(search.toLowerCase())
        || feature.elements.some(scenario => scenarioMatchesSearch(scenario, search));
}

const hasTag = (tags: { name: string }[], tag: string) => tags.some(item => item.name === tag);

export function scenarioHasTag(scenario: Scenario, tag: string): boolean {
    return !tag || hasTag(scenario.tags, tag);
}

export function featureHasTag(feature: Feature, tag: string): boolean {
    return !tag || hasTag(feature.tags, tag) || feature.elements.some(scenario => hasTag(scenario.tags, tag));
}

/** Scenario counts by detailed status (undefined / ambiguous / pending are not merged into failed / skipped) */
export function countByStatus(scenarios: Scenario[]): Partial<Record<StepStatus, number>> {
    const counts: Partial<Record<StepStatus, number>> = {};
    for (const scenario of scenarios) {
        const status = scenario.status === 'unknown' ? 'skipped' : scenario.status;
        counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
}

export function buildReport(sourceData: SourceScenario[] = [], metaSourceData?: Record<string, string>): Report {
    const features = buildFeatures(sourceData);
    return {
        features,
        metadata: buildMetadata(metaSourceData),
        run: buildRunInfo(features)
    };
}
