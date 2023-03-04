const fs = require('fs');

const template = fs.readFileSync('./build/index.html', 'utf-8');
const json = fs.readFileSync('./test/report.json', 'utf-8');

fs.writeFileSync('./test/report.html', template.replace('SOURCE_DATA', json).replace('METADATA', '[]'));
