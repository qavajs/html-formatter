import fs from 'fs';

const template = fs.readFileSync('./build/index.html', 'utf-8');
const json = fs.readFileSync('./test/report/report.json', 'utf-8');

fs.writeFileSync('./test/report/report.html', template.replace('SOURCE_DATA', json));
