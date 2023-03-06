const fs = require('fs');

const template = fs.readFileSync('./public/index.html', 'utf-8');
const json = fs.readFileSync('./test/report.json', 'utf-8');

fs.writeFileSync('./public/index.html', template.replace('SOURCE_DATA', json).replace('METADATA', '[]'));
