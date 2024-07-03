import { DataTable, Given, When, Before, After } from '@cucumber/cucumber';

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

When('named attachment', function () {
    this.attach('I\'m base 64 encoded text', {
        mediaType: 'base64:text/plain',
        fileName: 'Named Attachment'
    });
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
    this.log('one more log line');
});

When('passed step with huge log', function () {
    for (let i = 0; i < 100; i++) {
        this.log('one more log line '.repeat(100));
    }
});

When('failed step with log', function () {
    this.log('some information in failed step');
    this.log('ER: expected result');
    this.log('AR: actual result');
    throw new Error('failed step');
});

When('step with response', function () {
    const response = {
        request: {
            method: 'POST',
            url: 'http://localhost:3000/#/feature/featurefc7c2610-bd2a-450d-b311-d5fafa543ef66',
            body: 'cXdlcnR5MTIz',
            headers: {
                header1: 'value',
                otherHeader1: 'value2',
                anotherHeader1: 'value3',
            }
        },
        response: {
            status: 200,
            body: 'cXdlcnR5MTIzcmVzcG9uc2U=',
            headers: {
                headerresponse: 'value1'
            }
        }
    }
    this.attach(JSON.stringify(response), 'text/x.response.json')
});

When(`I expect {string} to match {string}`, async function (one, two) {});

Before(async function () {});
After(async function () {});
Before({name: 'named before hook'}, async function () {});
After({name: 'named after hook'}, async function () {});

