import { HashRouter } from 'react-router-dom';
import { ContextProvider } from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { createRoot } from 'react-dom/client';
import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/loveship/styles.css';
import '@epam/assets/theme/theme_loveship_dark.scss';
import '@epam/assets/theme/no-fonts/theme_loveship.scss';
import './index.css';

import { App } from './App';
import { buildReport } from './report';
import { ReportProvider } from './ReportContext';
import { initTheme } from './theme';
import { readReportData } from './reportData';

initTheme();
const { scenarios, metadata } = readReportData(document);
const report = buildReport(scenarios, metadata);

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
