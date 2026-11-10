import { HashRouter } from 'react-router-dom';
import { ContextProvider } from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { createRoot } from 'react-dom/client';
import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/loveship/styles.css';
import '@epam/assets/theme/theme_loveship_dark.scss';
import './index.css';

import { App } from './App';
import { buildReport } from './report';
import { ReportProvider } from './ReportContext';
import type { SourceScenario } from './types';

declare global {
    interface Window {
        /** injected by formatter/formatter.js (or by dev server, see scripts/vite-report-data.mjs) */
        sourceData?: SourceScenario[];
        metaSourceData?: Record<string, string>;
    }
}

const report = buildReport(window.sourceData, window.metaSourceData);

const root = createRoot(window.document.getElementById('root') as Element);
root.render(
    <ReportProvider report={report}>
        <HashRouter>
            <ContextProvider onInitCompleted={() => {}}>
                <App/>
                <Snackbar/>
                <Modals/>
            </ContextProvider>
        </HashRouter>
    </ReportProvider>
);
