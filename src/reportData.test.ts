import { readReportData } from './reportData';

function documentWith(html: string): Document {
    const doc = document.implementation.createHTMLDocument('report');
    doc.body.innerHTML = html;
    return doc;
}

describe('readReportData', () => {
    test('reads embedded json, including escaped </script>', () => {
        const doc = documentWith('<script type="application/json" id="report-data">'
            + '{"metadata":{"OS":"macos"},"scenarios":[{"name":"\\u003c/script>"}]}</script>');
        expect(readReportData(doc)).toEqual({ metadata: { OS: 'macos' }, scenarios: [{ name: '</script>' }] });
    });

    test('returns empty data for unfilled or invalid template', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        const doc = documentWith('<script type="application/json" id="report-data">{"metadata":METADATA}</script>');
        expect(readReportData(doc)).toEqual({ metadata: {}, scenarios: [] });
        expect(error).toHaveBeenCalled();
        error.mockRestore();
    });
});
