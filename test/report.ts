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
            metadata: {
                'OS': 'macos',
                'OS Version': '13.1'
            }
        }
    },
    memory: {}
}

export default common;

export const json = {
    ...common,
    format: [
        ['./formatter/json_formatter.js', 'test/report/report.json']
    ],
}
