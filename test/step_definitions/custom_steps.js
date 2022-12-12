const { Given, When, Then } = require('@cucumber/cucumber');

Given('background', () => {});
When('passed step', () => {});
When('failed step', () => {throw new Error('failed step')});
When('pending step', () => { return 'pending' });
When('ambiguous step', () => {});
When('ambiguous step', () => {});
When('data table step', (dataTable) => {});
When('multiline step', (multiline) => {});

When('text attachment', function () {
    this.attach('multiline\ntext\ncontent', 'text/plain')
});

When('png base64 attachment', function () {
    this.attach(require('../attachments/pngBase64'), 'base64:image/png')
});
