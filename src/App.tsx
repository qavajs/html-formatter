import React from 'react';
import { MainPage } from './pages/MainPage';
import { FeaturePage } from './pages/FeaturePage';
import { Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';

declare global {
    interface Window {
        data: any;
        sourceData: Array<any>
    }
}

const data = window.sourceData
    .map((feature: any) => ({
        ...feature,
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

export const App = () => {
    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main>
                <Route path="/" exact component={ MainPage } />
                <Route path="/feature/:id" exact component={ FeaturePage } />
                <Route path="/failed-scenarios" exact component={ FeaturePage } />
            </main>
            <footer/>
        </div>
    );
}
