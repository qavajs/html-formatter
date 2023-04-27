const fs = require('fs');

const template = fs.readFileSync('./build/index.html', 'utf-8');
const json = require('./report.json');

fs.writeFileSync('./test/report.html', template
    .replace('SOURCE_DATA', () => JSON.stringify(json, null, 0))
    .replace('METADATA', () => JSON.stringify({}, null, 0))
);
