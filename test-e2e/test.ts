import Memory from './memory';
import App from './po';

const common = {
    paths: ['test-e2e/features/*.feature'],
    require: [
        'node_modules/@qavajs/steps-playwright/index.js'
    ],
    format: [
        ['junit', 'test-e2e/report/report.xml'],
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
    defaultTimeout: 10000
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
