module.exports = {
    default: {
        paths: ['test/features/*.feature'],
        require: [
           'test/step_definitions/custom_steps.js'
        ],
        format: [
            './formatter/formatter:test/report/report.html',
        ],
        publishQuiet: true
    }
}
