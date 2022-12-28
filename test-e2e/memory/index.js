const { resolve } = require('path');

const file = (path) => `file://${path}`

class Memory {
    reportPage = file(resolve('./test/report.html'));
    htmlBase64 = require('../../test/attachments/htmlBase64');
    pngBase64 = require('../../test/attachments/pngBase64');
    pngFullSizeBase64 = require('../../test/attachments/pngFullSizeBase64');
    unsupportedBase64 = require('../../test/attachments/unsupportedBase64');
    jsonText = `{
  "property": "value",
  "nestedObject": {
    "nestedObjectProperty": "value2"
  },
  "arrayProperty": [
    "val1",
    "val2",
    "val3"
  ]
}`;
}

module.exports = Memory;
