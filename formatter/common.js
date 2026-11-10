const LOG_MIME_TYPE = 'text/x.cucumber.log+plain';

function formatTags(tags) {
    return tags.map(tag => ({ name: tag.name, line: tag.location?.line }));
}

/** Before hooks run ahead of all pickle steps, After hooks follow them */
function hookKeyword(steps, step) {
    const stepsBefore = steps.slice(0, steps.indexOf(step));
    return stepsBefore.every(element => element.pickleStepId === undefined) ? 'Before' : 'After';
}

function hookText(hooks, steps, step) {
    return hooks[step.hookId]?.name || hookKeyword(steps, step);
}

/** Report embedding keeps only what the report renders (attachment body was previously stored twice) */
function toEmbedding(attachment) {
    const embedding = {
        data: attachment.body,
        mime_type: attachment.mediaType,
        contentEncoding: attachment.contentEncoding
    };
    if (attachment.fileName) embedding.fileName = attachment.fileName;
    return embedding;
}

function durationToNanos(duration) {
    if (!duration) return 0;
    return duration.seconds * 1_000_000_000 + duration.nanos;
}

/** Converts cucumber messages timestamp into epoch milliseconds */
function timestampToMillis(timestamp) {
    if (!timestamp) return undefined;
    return timestamp.seconds * 1000 + Math.floor(timestamp.nanos / 1_000_000);
}

/**
 * Indexes gherkin ast nodes referenced by pickles via astNodeIds:
 * keywords of scenarios / backgrounds / steps and values of scenario outline example rows
 */
function gherkinIndex(feature) {
    const keywords = {};
    const exampleRows = {};
    const visit = children => {
        for (const child of children ?? []) {
            const node = child.background ?? child.scenario;
            if (node) {
                keywords[node.id] = node.keyword?.trim();
                for (const step of node.steps ?? []) keywords[step.id] = step.keyword?.trim();
                for (const examples of node.examples ?? []) {
                    const header = examples.tableHeader?.cells ?? [];
                    for (const row of examples.tableBody ?? []) {
                        exampleRows[row.id] = row.cells.map((cell, index) => ({ name: header[index]?.value ?? String(index), value: cell.value }));
                    }
                }
            }
            if (child.rule) visit(child.rule.children);
        }
    };
    visit(feature?.children);
    return { keywords, exampleRows };
}

/** @deprecated use gherkinIndex */
function gherkinKeywords(feature) {
    return gherkinIndex(feature).keywords;
}

/**
 * Builds report scenario object from cucumber test case attempt
 * @param testCase - test case attempt from eventDataCollector
 * @param hooks - map of hook id to hook envelope
 * @param options
 * @param {boolean} [options.showLogs=true] - include cucumber log attachments
 * @param {object} [options.timestamps] - test case started / finished timestamps (cucumber messages format)
 */
function buildScenario(testCase, hooks, { showLogs = true, timestamps = {} } = {}) {
    const gherkinFeature = testCase.gherkinDocument.feature;
    const { keywords, exampleRows } = gherkinIndex(gherkinFeature);
    const feature = {
        description: gherkinFeature.description,
        id: 'feature' + testCase.pickle.id,
        line: gherkinFeature.location.line,
        keyword: gherkinFeature.keyword,
        name: gherkinFeature.name,
        uri: testCase.gherkinDocument.uri,
        tags: formatTags(gherkinFeature.tags)
    };

    const testSteps = testCase.testCase.testSteps;
    const steps = testSteps.map(testStep => {
        const pickleStep = testCase.pickle.steps.find(pickle => testStep.pickleStepId === pickle.id);
        const argument = pickleStep?.argument?.dataTable ?? pickleStep?.argument?.docString;
        const result = testCase.stepResults[testStep.id];
        const embeddings = testCase.stepAttachments[testStep.id]
            ?.filter(attachment => showLogs || attachment.mediaType !== LOG_MIME_TYPE)
            .map(toEmbedding);
        return {
            ...testStep,
            name: pickleStep ? pickleStep.text : hookText(hooks, testSteps, testStep),
            keyword: pickleStep ? keywords[pickleStep.astNodeIds?.[0]] : hookKeyword(testSteps, testStep),
            arguments: argument ? [{ ...argument }] : undefined,
            result: {
                status: result.status.toLowerCase(),
                duration: durationToNanos(result.duration),
                error_message: result.message
            },
            embeddings
        };
    });

    return {
        feature,
        steps,
        name: testCase.pickle.name,
        id: testCase.pickle.id,
        keyword: keywords[testCase.pickle.astNodeIds?.[0]] ?? 'Scenario',
        tags: formatTags(testCase.pickle.tags),
        type: 'scenario',
        examples: exampleRows[testCase.pickle.astNodeIds?.[1]],
        attempt: testCase.attempt ?? 0,
        startedAt: timestampToMillis(timestamps.started),
        finishedAt: timestampToMillis(timestamps.finished)
    };
}

const FAILED_STATUSES = ['failed', 'ambiguous', 'undefined'];

/** Short summary of a retried (not reported) attempt: which step failed and why */
function summarizeAttempt(scenario) {
    const failedStep = scenario.steps.find(step => FAILED_STATUSES.includes(step.result.status));
    return {
        attempt: scenario.attempt,
        status: failedStep?.result.status ?? 'passed',
        step: failedStep && [failedStep.keyword, failedStep.name].filter(Boolean).join(' '),
        error: failedStep?.result.error_message,
        duration: scenario.steps.reduce((total, step) => total + step.result.duration, 0)
    };
}

/**
 * Turns cucumber message envelopes into report scenarios (shared by html and json formatters):
 * tracks hooks, first attempt start time and summaries of retried attempts
 */
class ScenarioCollector {
    hooks = {};
    /** test case id -> timestamp of its first attempt start (retries reuse test case id) */
    startTimestamps = {};
    /** test case id -> summaries of retried attempts */
    previousAttempts = {};

    constructor(eventDataCollector, { showLogs = true } = {}) {
        this.eventDataCollector = eventDataCollector;
        this.showLogs = showLogs;
    }

    /** @returns report scenario when the final attempt of a test case finished, otherwise undefined */
    processEnvelope(envelope) {
        if (envelope.hook) {
            this.hooks[envelope.hook.id] = envelope.hook;
        } else if (envelope.testCaseStarted) {
            const { testCaseId, timestamp } = envelope.testCaseStarted;
            this.startTimestamps[testCaseId] ??= timestamp;
        } else if (envelope.testCaseFinished) {
            return this.finishTestCase(envelope.testCaseFinished);
        }
        return undefined;
    }

    finishTestCase({ testCaseStartedId, timestamp, willBeRetried }) {
        const testCase = this.eventDataCollector.getTestCaseAttempt(testCaseStartedId);
        const testCaseId = testCase.testCase.id;
        if (willBeRetried) {
            const attempt = buildScenario(testCase, this.hooks, { showLogs: false });
            (this.previousAttempts[testCaseId] ??= []).push(summarizeAttempt(attempt));
            return undefined;
        }
        const scenario = buildScenario(testCase, this.hooks, {
            showLogs: this.showLogs,
            timestamps: { started: this.startTimestamps[testCaseId], finished: timestamp }
        });
        if (this.previousAttempts[testCaseId]) scenario.previousAttempts = this.previousAttempts[testCaseId];
        delete this.startTimestamps[testCaseId];
        delete this.previousAttempts[testCaseId];
        return scenario;
    }
}

/**
 * Serializes value to JSON that is safe to embed inside an inline <script> element
 */
function serializeForScript(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

module.exports = {
    LOG_MIME_TYPE,
    toEmbedding,
    formatTags,
    hookText,
    hookKeyword,
    timestampToMillis,
    gherkinKeywords,
    gherkinIndex,
    summarizeAttempt,
    ScenarioCollector,
    buildScenario,
    serializeForScript
};
