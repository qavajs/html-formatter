import React from 'react';
import { MainPage } from './pages/MainPage';
import { FeaturePage } from './pages/FeaturePage';
import { Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';

import sourceData from './report.json';

const data = (sourceData as Array<any>)
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

declare global {
    interface Window { data: any; }
}

window.data = data;

export const App = () => {
    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main>
                <Route path="/" exact component={ MainPage } />
                <Route path="/:id" exact component={ FeaturePage } />
            </main>
            <footer/>
        </div>
    );
}
