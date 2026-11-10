const { Formatter } = require('@cucumber/cucumber');
const { buildScenario } = require('./common');

class JsonFormatter extends Formatter {

    constructor(options) {
        super(options);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
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
        if (envelope.testCaseFinished.willBeRetried) return;
        const testCase = this.eventDataCollector.getTestCaseAttempt(envelope.testCaseFinished.testCaseStartedId);
        const scenario = buildScenario(testCase, this.hooks);
        scenario.feature.elements = [];
        this.json.push(scenario);
    }

    finishLaunch() {
        this.log(JSON.stringify(this.json, null, 2));
    }
}

module.exports = JsonFormatter;
