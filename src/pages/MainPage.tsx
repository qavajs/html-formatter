import { Features } from '../components/Features';
import { StatisticsPieChart } from '../components/StatisticsPieChart';
import { ChartItem, Legend } from '../components/Legend';
import { useReport } from '../ReportContext';
import { formatDuration, percent } from '../utils/format';
import { countByStatus } from '../report';
import type { Feature } from '../types';
import css from '../App.module.scss';

function chartData(passed: number, failed: number, skipped: number): ChartItem[] {
    const items: ChartItem[] = [
        { name: 'Passed', value: passed },
        { name: 'Failed', value: failed }
    ];
    if (skipped > 0) items.push({ name: 'Skipped', value: skipped });
    return items;
}

const STATUS_ITEMS: Array<[ChartItem['name'], 'passed' | 'failed' | 'undefined' | 'ambiguous' | 'pending' | 'skipped', string]> = [
    ['Passed', 'passed', 'All steps passed'],
    ['Failed', 'failed', 'A step failed'],
    ['Undefined', 'undefined', 'A step has no matching step definition'],
    ['Ambiguous', 'ambiguous', 'A step matches more than one step definition'],
    ['Pending', 'pending', 'A step is marked as pending'],
    ['Skipped', 'skipped', 'Steps were skipped']
];

/** Scenario breakdown by detailed status; passed and failed are always shown, the rest only when present */
function scenarioChartData(features: Feature[]): ChartItem[] {
    const counts = countByStatus(features.flatMap(feature => feature.elements));
    return STATUS_ITEMS
        .map(([name, status, hint]) => ({ name, value: counts[status] ?? 0, hint }))
        .filter(item => item.value > 0 || item.name === 'Passed' || item.name === 'Failed');
}

const sum = (features: Feature[], selector: (feature: Feature) => number) =>
    features.reduce((total, feature) => total + selector(feature), 0);

const StatisticsPanel = ({ title, unit, data, total }: { title: string, unit: string, data: ChartItem[], total: number }) =>
    <section className={css.card}>
        <h2 className={css.cardTitle}>{title}</h2>
        <div className={css.statisticsBody}>
            <StatisticsPieChart data={data} total={total} label={unit}/>
            <Legend items={data} total={total}/>
        </div>
    </section>;

interface KpiProps {
    label: string;
    value: string | number;
    tone?: 'passed' | 'failed' | 'undefined';
    hint?: string;
    title?: string;
}

const Kpi = ({ label, value, tone, hint, title }: KpiProps) =>
    <div className={css.kpi} title={title}>
        <span className={css.kpiLabel}>{label}</span>
        <span className={[css.kpiValue, tone && css[`text-${tone}`]].filter(Boolean).join(' ')}>{value}</span>
        {hint && <span className={css.kpiHint}>{hint}</span>}
    </div>;

const formatDateTime = (millis: number) => new Date(millis).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium'
});

export const MainPage = () => {
    const { features, run } = useReport();
    const featureData = chartData(
        features.filter(feature => feature.status === 'passed').length,
        features.filter(feature => feature.status === 'failed').length,
        features.filter(feature => feature.status === 'skipped').length
    );
    const totalScenarios = sum(features, feature => feature.total);
    const passedScenarios = sum(features, feature => feature.passed);
    const failedScenarios = sum(features, feature => feature.failed);
    const scenarioData = scenarioChartData(features);
    const failedBreakdown = scenarioData
        .filter(item => ['Undefined', 'Ambiguous'].includes(item.name))
        .map(item => `${item.value} ${item.name.toLowerCase()}`)
        .join(', ');
    const flakyScenarios = sum(features, feature => feature.flaky);
    const durationHint = [
        run.startedAt !== undefined && `started ${formatDateTime(run.startedAt)}`,
        run.wallDuration !== undefined && `${formatDuration(run.totalDuration)} total`
    ].filter(Boolean).join(' · ');

    return (
        <div className={css.page}>
            <div className={css.kpiRow}>
                <Kpi label='Features' value={features.length}/>
                <Kpi label='Scenarios' value={totalScenarios}/>
                <Kpi label='Pass rate' value={`${percent(passedScenarios, totalScenarios)}%`}/>
                <Kpi
                    label='Failed scenarios'
                    value={failedScenarios}
                    tone={failedScenarios > 0 ? 'failed' : 'passed'}
                    hint={failedBreakdown ? `incl. ${failedBreakdown}` : undefined}
                />
                <Kpi
                    label='Flaky scenarios'
                    value={flakyScenarios}
                    tone={flakyScenarios > 0 ? 'undefined' : undefined}
                    title='Scenarios that passed only after a retry'
                />
                <Kpi
                    label='Duration'
                    value={formatDuration(run.wallDuration ?? run.totalDuration)}
                    hint={durationHint || undefined}
                    title={run.wallDuration !== undefined
                        ? 'Wall clock time from the first scenario start to the last scenario finish; total is the sum of all scenario durations'
                        : 'Sum of all scenario durations'}
                />
            </div>
            <div className={css.statisticsRow}>
                <StatisticsPanel title='Features' unit='features' data={featureData} total={features.length}/>
                <StatisticsPanel title='Scenarios' unit='scenarios' data={scenarioData} total={totalScenarios}/>
            </div>
            <Features data={features}/>
        </div>
    );
};
