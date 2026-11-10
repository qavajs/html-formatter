const { Formatter } = require('@cucumber/cucumber');
const { ScenarioCollector } = require('./common');

class JsonFormatter extends Formatter {

    constructor(options) {
        super(options);
        this.json = [];
        this.collector = new ScenarioCollector(this.eventDataCollector);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
    }

    processEnvelope(envelope) {
        if (envelope.testRunFinished) return this.finishLaunch();
        const scenario = this.collector.processEnvelope(envelope);
        if (scenario) {
            scenario.feature.elements = [];
            this.json.push(scenario);
        }
    }

    finishLaunch() {
        this.log(JSON.stringify(this.json, null, 2));
    }
}

module.exports = JsonFormatter;
