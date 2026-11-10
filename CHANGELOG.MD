# Change Log

All notable changes to the "@qavajs/html-formatter" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature  
:beetle: - bugfix  
:x: - deprecation/removal  
:pencil: - chore  
:microscope: - experimental

# [1.4.0]
- :rocket: steps show gherkin keywords (Given/When/Then/And) and hooks show Before/After, scenario outlines show `Scenario Outline` keyword
- :rocket: retried scenarios are marked (`flaky` when passed after retry), added flaky scenarios KPI
- :rocket: duration KPI shows wall clock time (correct for parallel runs), run start time and summed total
- :rocket: failed scenarios page: "Group by error" mode, failed scenarios expanded by default
- :rocket: expand all / collapse all scenarios on feature and failed pages
- :rocket: passed Before/After hooks are hidden by default ("Show passed hooks" switch)
- :rocket: durations below a second are shown in milliseconds
- :rocket: features table: failed features first by default, flaky column
- :rocket: clicking a tag filters by it (`?tag=`), active tag can be copied or cleared
- :rocket: search covers scenario names, step text, error messages, tags and example values
- :rocket: feature urls are derived from feature file path (stable between runs), copy link to scenario (`?scenario=`) opens it expanded
- :rocket: previous attempts of retried scenarios are shown with the failed step and error
- :rocket: scenario outline example values are shown next to the scenario name
- :rocket: scenario statistics show undefined / ambiguous / pending separately
- :rocket: logs modal got copy / wrap / download toolbar
- :rocket: light theme (header toggle, remembered), print stylesheet (always light, without navigation and filters)
- :rocket: `htmlConfig.attachments: 'external'` writes binary attachments next to the report (`htmlConfig.attachmentsDir`) instead of inlining them
- :rocket: error dialog uses the text attachment viewer (wrap, copy, download), error previews have a "Copy" button; errors are copied without ansi colors
- :beetle: fixed attachments being embedded twice (report size roughly halved for attachment-heavy reports)
- :beetle: fixed tags and copy link inside scenario header not working from keyboard (Enter toggled the scenario)
- :pencil: report data is embedded as json (`<script type="application/json">`) instead of a js literal
- :pencil: documented options, report features and url parameters in README

# [1.3.0]
- :rocket: added support of cucumber 13
- :rocket: skipped/pending scenarios are reported separately from failed ones
- :rocket: added scenario/feature durations, total duration and duration sorting
- :rocket: search and "show only failed" filters are kept in url
- :rocket: jpeg/gif/webp/bmp/svg screenshots are shown in slideshow
- :beetle: fixed report breaking when test data contains `</script>`
- :beetle: fixed metadata values containing `$` being corrupted
- :beetle: fixed features with the same name from different files being merged
- :beetle: fixed crash on invalid json attachment/response and on unknown feature url
- :beetle: fixed attachment encoding handling and non-ASCII response body decoding
- :beetle: fixed response status badge color for error statuses
- :pencil: removed recharts (report template is ~25% smaller)
- :pencil: replaced eslint with oxlint, added unit tests, fixed CI
- :pencil: build no longer runs sample tests; dev server injects sample data like the real formatter and live-reloads on `npm run report:data`
- :pencil: updated dependencies to latest versions

# [1.2.0]
- :rocket: added slideshow for screenshot attachments

# [1.1.1]
- fixed issue with required `showLogs`

# [1.1.0]
- added `showLogs` flag to enable/disable `text/x.cucumber.log+plain` logs

# [0.18.1]
- fixed home navigation

# [0.18.0]
- added capability to display http request and response
- updated main menu implementation

# [0.17.0]
- implemented runtime streaming

# [0.16.0]
- added dark theme

# [0.15.4]
- fixed multiple tags displaying

# [0.15.3]
- fixed logs overlay width

# [0.15.2]
- fixed duplicated scenarios in case of retries

# [0.15.1]
- fixed nano seconds conversion

# [0.15.0]
- migrated to react 18 and vite dev server
- added displaying of execution time for steps and scenarios

# [0.14.4]
- fixed [Feature that contains only undefined/skipped scenarios is displayed as passed](https://github.com/qavajs/html-formatter/issues/36)

# [0.14.3]
- fixed width and height of error and logs overlay

# [0.14.1]
- fixed stacktrace overlay
- fixed multiline and data table displaying

# [0.14.0]
- added support of named attachments

# [0.13.0]
- replaced legacy json formatter with custom one based on cucumber messages
- added support of named hooks

# [0.0.11]
- fixed $' replace issue

# [0.0.10]
- fixed issue of not escaped chars in logs

# [0.0.9]
- fixed issue of not opening features with /%# in names

# [0.0.8]
- added capability to attach cucumber logs

# [0.0.7]
- fixed duplicated results in case of same feature name

# [0.0.6]
- added unsupported attachment handler
- added multiple attachment support
- added mime type display for attachments
- added feature names to failed page
- added possibility to save state of "show only failed" switch

# [0.0.5]
- added capability to write tag name to clipboard
- added html attachments
- added capability to open attachment in new tab
- added capability to pass metadata

# [0.0.4]
- added support application/json

# [0.0.3]
- fixed image fit
- fixed tags fit in title

# [0.0.2]
- added feature titles
- minor fixes

# [0.0.1]
- initial implementation
