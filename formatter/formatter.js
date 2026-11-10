const { Formatter } = require('@cucumber/cucumber');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { buildScenario, serializeForScript } = require('./common');

class HTMLFormatter extends Formatter {

    hooks = {};
    options = {};
    _scenarios = [];

    constructor(options) {
        super(options);
        const metadata = serializeForScript(options.parsedArgvOptions.htmlConfig?.metadata ?? {});
        this.options.showLogs = options.parsedArgvOptions.htmlConfig?.showLogs ?? true;
        const htmlTemplate = readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
            .replace('METADATA', () => metadata);
        const [left, right] = htmlTemplate.split('SOURCE_DATA');
        this._left = left;
        this._right = right;
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
    }

    processEnvelope(envelope) {
        if (envelope.testCaseFinished) {
            return this.finishTest(envelope);
        }
        if (envelope.hook) {
            this.hooks[envelope.hook.id] = envelope.hook;
        }
    }

    finishTest(envelope) {
        if (envelope.testCaseFinished.willBeRetried) return;
        const testCase = this.eventDataCollector.getTestCaseAttempt(envelope.testCaseFinished.testCaseStartedId);
        const scenario = buildScenario(testCase, this.hooks, { showLogs: this.options.showLogs });
        this._scenarios.push(serializeForScript(scenario));
    }

    async finished() {
        this.log(this._left + this._scenarios.join(',') + this._right);
        await super.finished();
    }

}

module.exports = HTMLFormatter;
