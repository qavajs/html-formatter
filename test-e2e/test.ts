import Memory from './memory';
import App from './po';

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
    retry: 1,
    parallel: 4,
    publishQuiet: true
};

export default common;

export const debug = {
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
};
