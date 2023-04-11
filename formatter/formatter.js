const { JsonFormatter } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
class HTMLFormatter extends JsonFormatter {

    constructor(options) {
        super(options);
        this.metadata = options.parsedArgvOptions.htmlConfig?.metadata ?? {};
        const log = this.log.bind(this);
        this.log = function(json) {
            const htmlTemplate = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
            log(htmlTemplate
                .replace('METADATA', JSON.stringify(this.metadata, null, 0))
                .replace('SOURCE_DATA', JSON.stringify(JSON.parse(json), null, 0)));
        }
    }

}

module.exports = HTMLFormatter;
