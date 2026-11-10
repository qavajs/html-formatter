import type { SourceScenario } from './types';

declare global {
    interface Window {
        /** legacy templates (before json embedding) assigned report data to globals */
        sourceData?: SourceScenario[];
        metaSourceData?: Record<string, string>;
    }
}

export const REPORT_DATA_ELEMENT_ID = 'report-data';

export interface ReportData {
    scenarios: SourceScenario[];
    metadata: Record<string, string>;
}

/**
 * Reads report data embedded by the formatter as <script type="application/json" id="report-data">,
 * falls back to globals of legacy templates
 */
export function readReportData(doc: Document): ReportData {
    const element = doc.getElementById(REPORT_DATA_ELEMENT_ID);
    if (element?.textContent) {
        try {
            const data = JSON.parse(element.textContent) as Partial<ReportData>;
            return { scenarios: data.scenarios ?? [], metadata: data.metadata ?? {} };
        } catch (err) {
            console.error('[report] cannot parse embedded report data', err);
        }
    }
    const legacy = doc.defaultView;
    return { scenarios: legacy?.sourceData ?? [], metadata: legacy?.metaSourceData ?? {} };
}
