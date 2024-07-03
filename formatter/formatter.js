const { Formatter } = require('@cucumber/cucumber');
const { write, readFileSync } = require('node:fs');
const path = require('node:path');

class HTMLStream {

    constructor(fd, ender) {
        this.fd = fd;
        this.position = 0;
        this.ender = Buffer.from(ender);
    }

    write(data) {
        const dataBuffer = Buffer.from(data);
        const buffer = Buffer.concat([dataBuffer, this.ender]);
        write(this.fd, buffer, 0, buffer.length, this.position, () => {});
        this.position += dataBuffer.length;
    }

}

class HTMLFormatter extends Formatter {

    hooks = {};

    constructor(options) {
        super(options);
        const metadata = JSON.stringify(options.parsedArgvOptions.htmlConfig?.metadata ?? {});
        const htmlTemplate = readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
            .replace('METADATA', metadata);
        const [left, right] = htmlTemplate.split('SOURCE_DATA');
        this.htmlStream = new HTMLStream(this.stream.fd, right);
        this.htmlStream.write(left);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
    }

    processEnvelope(envelope) {
        if (envelope.testCaseFinished) {
            return this.finishTest(envelope);
        }
        if (envelope.hook) {
            return this.hooks[envelope.hook.id] = envelope.hook;
        }
    }

    finishTest(envelope) {
        if (envelope.testCaseFinished.willBeRetried) return;
        const testCase = this.eventDataCollector.getTestCaseAttempt(envelope.testCaseFinished.testCaseStartedId);
        const feature = {
            description: testCase.gherkinDocument.feature.description,
            id: 'feature' + testCase.pickle.id,
            line: testCase.gherkinDocument.feature.location.line,
            keyword: testCase.gherkinDocument.feature.keyword,
            name: testCase.gherkinDocument.feature.name,
            uri: testCase.gherkinDocument.uri,
            tags: this.formatTags(testCase.gherkinDocument.feature.tags)
        };

        const steps = testCase.testCase.testSteps;
        for (const step of steps) {
            const pickle = testCase.pickle.steps.find(pickle => step.pickleStepId === pickle.id);
            step.name = pickle ? pickle.text : this.hookText(steps, step);
            step.arguments = pickle ? [{ ...(pickle.argument?.dataTable ?? pickle.argument?.docString) }] : undefined;
            const result = testCase.stepResults[step.id];
            step.result = {
                status: result.status.toLowerCase(),
                duration: result.duration.seconds * 1_000_000_000 + result.duration.nanos,
                error_message: result.message
            };
            step.embeddings = testCase.stepAttachments[step.id]?.map(attachment => ({
                ...attachment,
                data: attachment.body,
                mime_type: attachment.mediaType
            }));
        }
        const scenario = {
            feature,
            steps,
            name: testCase.pickle.name,
            id: testCase.pickle.id,
            keyword: 'Scenario',
            tags: this.formatTags(testCase.pickle.tags),
            type: 'scenario'
        };
        this.htmlStream.write(JSON.stringify(scenario) + ',');
    }

    formatTags(tags) {
        return tags.map(tag => ({ name: tag.name, line: tag.location?.line }));
    }

    hookText(steps, step) {
        const hook = this.hooks[step.hookId];
        if (hook?.name) return hook.name;
        const stepsBefore = steps.slice(0, steps.findIndex((element) => element === step));
        return stepsBefore.every(element => element.pickleStepId === undefined) ? 'Before' : 'After';
    }

}

module.exports = HTMLFormatter;
