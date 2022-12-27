module.exports = {
    default: {
        paths: ['test/features/*.feature'],
        require: [
           'test/step_definitions/custom_steps.js'
        ],
        format: [
            'json:test/report/report.json',
            './formatter/formatter:test/report/report.html',
        ],
        formatOptions: {
            htmlConfig: {
                metadata: {
                    'OS': 'macos',
                    'OS Version': '13.1'
                }
            }
        },
        publishQuiet: true
    }
}
