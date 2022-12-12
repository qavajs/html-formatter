# @qavajs/html-formatter

Single file HTML formatter for cucumber framework

### Installation
To install formatter run

`npm install @qavajs/html-formatter`

and add to formatter section in config file

```javascript
module.exports = {
    default: {
        format: ['@qavajs/html-formatter:report.html']
    }
}
```

or pass `--format @qavajs/html-formatter:report.html` in cli

Kudos to https://github.com/epam/UUI for providing components

