const { JsonFormatter } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
class HTMLFormatter extends JsonFormatter {

    constructor(options) {
        super(options);
        const log = this.log.bind(this);
        this.log = function(json) {
            const htmlTemplate = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
            log(htmlTemplate.replace('SOURCE_DATA', json));
        }
    }

}

module.exports = HTMLFormatter;