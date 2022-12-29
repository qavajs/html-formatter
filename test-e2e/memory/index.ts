import { resolve } from 'path';

const file = (path: string) => `file://${path}`

export default class Memory {
    reportPage: string = file(resolve('./test/report.html'));
    htmlBase64: string = require('../../test/attachments/htmlBase64').default;
    pngBase64: string = require('../../test/attachments/pngBase64').default;
    pngFullSizeBase64: string = require('../../test/attachments/pngFullSizeBase64').default;
    unsupportedBase64: string = require('../../test/attachments/unsupportedBase64').default;
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
