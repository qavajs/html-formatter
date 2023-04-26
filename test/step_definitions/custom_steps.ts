import { DataTable, Given, When } from '@cucumber/cucumber';

Given('background', () => {});
When('passed step', () => {});
When('failed step', () => { throw new Error('failed step') });
When('pending step', () => { return 'pending' });
When('ambiguous step', () => {});
When('ambiguous step', () => {});
When('data table step', (dataTable: DataTable) => {});
When('multiline step', (multiline: string) => {});

When('text attachment', function () {
    this.attach('multiline\ntext\ncontent', 'text/plain');
});

When('png base64 attachment', function () {
    this.attach(require('../attachments/pngBase64.ts').default, 'base64:image/png');
});

When('png full-size base64 attachment', function () {
    this.attach(require('../attachments/pngFullSizeBase64.ts').default, 'base64:image/png');
});

When('json attachment', function () {
    this.attach(JSON.stringify({
        property: 'value',
        nestedObject: {
            nestedObjectProperty: 'value2'
        },
        arrayProperty: [
            'val1',
            'val2',
            'val3'
        ]
    }), 'application/json');
});

When('text base64 attachment', function () {
    this.attach('I\'m base 64 encoded text', 'base64:text/plain');
});

When('html base64 attachment', function () {
    this.attach(require('../attachments/htmlBase64.ts').default, 'base64:text/html');
});

When('multiple attachments', function () {
    this.attach(require('../attachments/pngBase64.ts').default, 'base64:image/png');
    this.attach(require('../attachments/pngFullSizeBase64.ts').default, 'base64:image/png');
});

When('unsupported base64 attachment', function () {
    this.attach(require('../attachments/unsupportedBase64').default, 'base64:application/zip');
});

When('passed step with log', function () {
    this.log('some information in passed step');
    this.log('one more log line')

});
When('failed step with log', function () {
    this.log('some information in failed step');
    this.log('ER: expected result');
    this.log('AR: actual result');
    throw new Error('failed step');
});

When(`I expect {string} to match {string}`, async function (one, two) {});

