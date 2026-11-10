const LOG_MIME_TYPE = 'text/x.cucumber.log+plain';

function formatTags(tags) {
    return tags.map(tag => ({ name: tag.name, line: tag.location?.line }));
}

function hookText(hooks, steps, step) {
    const hook = hooks[step.hookId];
    if (hook?.name) return hook.name;
    const stepsBefore = steps.slice(0, steps.indexOf(step));
    return stepsBefore.every(element => element.pickleStepId === undefined) ? 'Before' : 'After';
}

function durationToNanos(duration) {
    if (!duration) return 0;
    return duration.seconds * 1_000_000_000 + duration.nanos;
}

/**
 * Builds report scenario object from cucumber test case attempt
 * @param testCase - test case attempt from eventDataCollector
 * @param hooks - map of hook id to hook envelope
 * @param options
 * @param {boolean} [options.showLogs=true] - include cucumber log attachments
 */
function buildScenario(testCase, hooks, { showLogs = true } = {}) {
    const gherkinFeature = testCase.gherkinDocument.feature;
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
            .map(attachment => ({
                ...attachment,
                data: attachment.body,
                mime_type: attachment.mediaType
            }));
        return {
            ...testStep,
            name: pickleStep ? pickleStep.text : hookText(hooks, testSteps, testStep),
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
        keyword: 'Scenario',
        tags: formatTags(testCase.pickle.tags),
        type: 'scenario'
    };
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
    formatTags,
    hookText,
    buildScenario,
    serializeForScript
};
