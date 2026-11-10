# @qavajs/html-formatter

Single file HTML formatter for cucumber framework

### Installation
To install formatter run

```
npm install @qavajs/html-formatter
```

and add to formatter section in config file

```typescript
export default {
    format: [
        ['@qavajs/html-formatter', 'report.html']
    ],
    formatOptions: {
        htmlConfig: {
            showLogs: true, // enable/disable text/x.cucumber.log+plain
            metadata: {
                'OS': 'macos',
                'OS Version': '13.1'
            }
        }
    },
}
```

or pass `--format @qavajs/html-formatter:report.html` in cli

![](assets/qavajs_html_reporter.png)

Kudos to https://github.com/epam/UUI for providing components

## Development

```
npm install
```

| Command                   | Description                                                                                                                                                       |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `npm start`               | Dev server with sample report data on http://localhost:3000. Data is generated on first start; run `npm run report:data` in another terminal to refresh it - the page reloads automatically. |
| `npm run report:data`     | Runs sample features (`test/features`) and writes report data to `test/report/report.json`                                                                        |
| `npm run report:generate` | Builds formatter template and generates sample report `test/report/report.html` with the real formatter                                                            |
| `npm run build`           | Builds formatter template `formatter/index.html`                                                                                                                  |
| `npm test`                | Unit tests                                                                                                                                                        |
| `npm run lint`            | Lint                                                                                                                                                              |
| `npm run typecheck`       | Type check                                                                                                                                                        |

Sample report config (metadata, `showLogs`) lives in `test/report.ts` and is used both by the dev server and by `report:generate`.
