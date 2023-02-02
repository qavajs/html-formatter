import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ContextProvider } from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';
import { App } from './App';
import { svc } from './services';

const history = createBrowserHistory();

declare global {
    interface Window {
        data: any;
        sourceData: Array<any>;
        metadata: Array<{key: string, value: string, id: string}>;
        metaSourceData: {
            [prop: string]: string
        };
    }
}

window.metadata = Object.entries(window.metaSourceData ?? {})
    .map(([key, value]: [key: string, value: string], index: number) => ({key, value, id: 'value' + index}));

const data = window.sourceData
    .map((feature: any, index: number) => ({
        ...feature,
        id: feature.id + index,
        total: feature.elements.length,
        elements: feature.elements.map((scenario: any) => ({
            ...scenario,
            isFailed: scenario.steps.some((step: any) => step.result.status === 'failed')
        })),
    }))
    .map((feature: any) => ({
        ...feature,
        failed: feature.elements.filter((scenario: any) => scenario.isFailed).length,
        passed: feature.elements.filter((scenario: any) => !scenario.isFailed).length,
    }))
    .map((feature: any) => ({
        ...feature,
        status: feature.failed > 0 ? 'failed' : 'passed'
    }));

window.data = data;

const UuiEnhancedApp = () => (
    <ContextProvider
        onInitCompleted={ (context) => {
            Object.assign(svc, context);
        } }
        history={ history }
    >
        <ErrorHandler>
            <App />
            <Snackbar />
            <Modals />
        </ErrorHandler>
    </ContextProvider>
);

const RoutedApp = () => (
    <HashRouter>
        <UuiEnhancedApp />
    </HashRouter>
);

render(<RoutedApp />, document.getElementById('root'));
