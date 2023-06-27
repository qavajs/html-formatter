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

        let feature = this.json.find(feature => feature.uri === testCase.gherkinDocument.uri);
        if (!feature) {
            feature = {
                description: testCase.gherkinDocument.feature.description,
                id: 'feature' + testCase.pickle.id,
                line: testCase.gherkinDocument.feature.location.line,
                keyword: testCase.gherkinDocument.feature.keyword,
                name: testCase.gherkinDocument.feature.name,
                uri: testCase.gherkinDocument.uri,
                elements: [],
                tags: this.formatTags(testCase.gherkinDocument.feature.tags) // todo add tags
            };
            this.json.push(feature);
        }
        const steps = testCase.testCase.testSteps;
        for (const step of steps) {
            // console.log(step)
            step.keyword = 'Undefined' //todo implement logic to define keyword
            const pickle = testCase.pickle.steps.find(pickle => step.pickleStepId === pickle.id);
            if (pickle) {
                step.name = pickle.text;
            } else {
                const hook = this.hooks[step.hookId];
                step.name = hook.name;
            }
            const result= testCase.stepResults[step.id];
            step.result = {
                status: result.status.toLowerCase(),
                duration: result.duration.seconds * 1_000_000 + result.duration.nanos // todo verify correctness
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
}

module.exports = JsonFormatter;
