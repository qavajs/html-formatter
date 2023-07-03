const { Formatter } = require('@cucumber/cucumber');
class JsonFormatter extends Formatter {

    constructor(options) {
        super(options);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
        this.rpConfig = options.parsedArgvOptions.rpConfig;
        this.json = [];
        this.hooks = {};
    }

    processEnvelope(envelope) {
        if (envelope.testCaseFinished) {
            this.finishTest(envelope);
        } else if (envelope.testRunFinished) {
            this.finishLaunch();
        } else if (envelope.hook) {
            this.hooks[envelope.hook.id] = envelope.hook;
        }
    }

    finishTest(envelope) {
        const testCase = this.eventDataCollector.getTestCaseAttempt(envelope.testCaseFinished.testCaseStartedId);
        let feature = this.json.find(feature => feature.name === testCase.gherkinDocument.feature.name);
        if (!feature) {
            feature = {
                description: testCase.gherkinDocument.feature.description,
                id: 'feature' + testCase.pickle.id,
                line: testCase.gherkinDocument.feature.location.line,
                keyword: testCase.gherkinDocument.feature.keyword,
                name: testCase.gherkinDocument.feature.name,
                uri: testCase.gherkinDocument.uri,
                elements: [],
                tags: this.formatTags(testCase.gherkinDocument.feature.tags)
            };
            this.json.push(feature);
        }
        const steps = testCase.testCase.testSteps;
        for (const step of steps) {
            const pickle = testCase.pickle.steps.find(pickle => step.pickleStepId === pickle.id);
            step.name = pickle ? pickle.text : this.hookText(steps, step);
            const result= testCase.stepResults[step.id];
            step.result = {
                status: result.status.toLowerCase(),
                duration: result.duration.seconds * 1_000_000 + result.duration.nanos
            };
            step.embeddings = testCase.stepAttachments[step.id]?.map(attachment => ({
                ...attachment,
                data: attachment.body,
                mime_type: attachment.mediaType
            }));
        }
        const scenario = {
            steps,
            name: testCase.pickle.name,
            id: testCase.pickle.id,
            keyword: 'Scenario',
            tags: this.formatTags(testCase.pickle.tags),
            type: 'scenario'
        }
        feature.elements.push(scenario);
    }

    finishLaunch() {
        this.log(JSON.stringify(this.json, null, 2))
    }

    formatTags(tags) {
        return tags.map(tag => ({ name: tag.name, line: tag.location?.line }))
    }

    hookText(steps, step) {
        const hook = this.hooks[step.hookId];
        if (hook?.name) return hook.name;
        const stepsBefore = steps.slice(0, steps.findIndex((element) => element === step));
        return stepsBefore.every(element => element.pickleStepId === undefined) ? 'Before' : 'After'
    }
}

module.exports = JsonFormatter;
