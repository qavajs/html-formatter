const { Formatter } = require('@cucumber/cucumber');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { ScenarioCollector, serializeForScript } = require('./common');
const { createAttachmentFiles } = require('./attachments');

/** Absolute path of the report file when cucumber writes formatter output to a file */
function reportFilePath(options) {
    const streamPath = options.stream?.path;
    if (typeof streamPath !== 'string') return undefined;
    return path.resolve(options.cwd ?? process.cwd(), streamPath);
}

class HTMLFormatter extends Formatter {

    _scenarios = [];

    constructor(options) {
        super(options);
        const htmlConfig = options.parsedArgvOptions.htmlConfig ?? {};
        const metadata = serializeForScript(htmlConfig.metadata ?? {});
        this._collector = new ScenarioCollector(this.eventDataCollector, { showLogs: htmlConfig.showLogs ?? true });
        if (htmlConfig.attachments === 'external') {
            this._attachments = createAttachmentFiles(reportFilePath(options), htmlConfig.attachmentsDir);
            if (!this._attachments) {
                console.warn('[@qavajs/html-formatter] attachments: "external" requires the report to be written to a file, attachments are inlined');
            }
        }
        const htmlTemplate = readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
            .replace('METADATA', () => metadata);
        const [left, right] = htmlTemplate.split('SOURCE_DATA');
        this._left = left;
        this._right = right;
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
    }

    processEnvelope(envelope) {
        const scenario = this._collector.processEnvelope(envelope);
        if (!scenario) return;
        this._attachments?.apply(scenario);
        this._scenarios.push(serializeForScript(scenario));
    }

    async finished() {
        this.log(this._left + this._scenarios.join(',') + this._right);
        await super.finished();
    }

}

module.exports = HTMLFormatter;
