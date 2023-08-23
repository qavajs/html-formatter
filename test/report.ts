const common = {
    paths: ['test/features/*.feature'],
    require: [
        'test/step_definitions/custom_steps.ts'
    ],
    format: [
        './formatter/formatter:test/report.html',
        './formatter/json_formatter:test/report.json'
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
