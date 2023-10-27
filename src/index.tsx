import { HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ContextProvider } from "@epam/uui-core";
import { Snackbar, Modals } from "@epam/uui-components";
import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/promo/styles.css';
import './App.module.scss';

import { App } from "./App";
import { svc } from "./services";
import { createRoot } from "react-dom/client";

const history = createBrowserHistory();

declare global {
    // eslint-disable-next-line no-unused-vars
  interface Window {
    data: any;
    sourceData: Array<any>;
    metadata: Array<{ key: string, value: string, id: string }>;
    metaSourceData: {
      [prop: string]: string
    };
  }
}

//@ts-ignore
if (import.meta.env.MODE === 'development') {
  // @ts-ignore
    window.sourceData = (await import('../test/report/report.json')).default as any;
    window.metaSourceData = {
        'OS': 'macos',
        'OS Version': '13.1'
    }
}

window.metadata = Object.entries(window.metaSourceData ?? {})
  .map(([key, value]: [key: string, value: string], index: number) => ({ key, value, id: "value" + index }));

const data = window.sourceData
  .map((feature: any, index: number) => ({
    ...feature,
    id: feature.id.replace(/[/#%]/g, "x") + index,
    total: feature.elements.length,
    elements: feature.elements.map((scenario: any) => ({
      ...scenario,
      isFailed: scenario.steps.some((step: any) => step.result.status !== "passed")
    }))
  }))
  .map((feature: any) => ({
    ...feature,
    failed: feature.elements.filter((scenario: any) => scenario.isFailed).length,
    passed: feature.elements.filter((scenario: any) => !scenario.isFailed).length
  }))
  .map((feature: any) => ({
    ...feature,
    status: feature.failed > 0 ? "failed" : "passed"
  }));

window.data = data;

const UuiEnhancedApp = () => (
  <ContextProvider
    onInitCompleted={(context) => {
      Object.assign(svc, context);
    }}
    history={history}
  >
      <App />
      <Snackbar />
      <Modals />
  </ContextProvider>
);

const RoutedApp = () => (
  <HashRouter>
    <UuiEnhancedApp />
  </HashRouter>
);

const root = createRoot(window.document.getElementById('root') as Element);
root.render(<RoutedApp/>);
