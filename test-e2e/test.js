const Memory = require('./memory');
const App = require('./po');

const common = {
    paths: ['test-e2e/features/*.feature'],
    require: [
        'node_modules/@qavajs/steps-playwright'
    ],
    format: [
        '@qavajs/xunit-formatter:test-e2e/report.xml',
        '@qavajs/console-formatter'
    ],
    browser: {
        logLevel: 'warn',
        timeout: {
            page: 5000
        },
        capabilities: {
            browserName: 'chromium',
        }
    },
    memory: new Memory(),
    pageObject: new App(),
    publishQuiet: true
};

module.exports = {
    default: common,
    debug: {
        ...common,
        tags: '@debug',
        browser: {
            logLevel: 'warn',
            timeout: {
                page: 5000
            },
            capabilities: {
                browserName: 'chromium',
                headless: false
            }
        },
        format: ['@qavajs/console-formatter'],
    }
}
