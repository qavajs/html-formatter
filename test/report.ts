/**
 * Sample report config.
 * default profile - html + json report (`npm run report:generate`)
 * json profile - json data only, consumed by dev server (`npm run report:data`, `npm start`)
 */
const common = {
    paths: ['test/features/*.feature'],
    require: [
        'test/step_definitions/custom_steps.ts'
    ],
    format: [
        ['./formatter/formatter.js', 'test/report/report.html'],
        ['./formatter/json_formatter.js', 'test/report/report.json']
    ],
    formatOptions: {
        htmlConfig: {
            showLogs: true,
            metadata: {
                'OS': 'macos',
                'OS Version': '13.1'
            }
        }
    },
    memory: {},
    retry: 1
};

export default common;

export const json = {
    ...common,
    format: [
        ['./formatter/json_formatter.js', 'test/report/report.json']
    ],
};

/** binary attachments written to test/report/external/attachments (`npx qavajs run --config test/report.ts --profile external`) */
export const external = {
    ...common,
    format: [
        ['./formatter/formatter.js', 'test/report/external/report.html']
    ],
    formatOptions: {
        htmlConfig: {
            ...common.formatOptions.htmlConfig,
            attachments: 'external'
        }
    }
};
