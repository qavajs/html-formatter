import { Features } from '../components/Features';
import { StatisticsPieChart } from '../components/StatisticsPieChart';
import { ChartItem, Legend } from '../components/Legend';
import { useReport } from '../ReportContext';
import { formatDuration, percent } from '../utils/format';
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

const Kpi = ({ label, value, tone }: { label: string, value: string | number, tone?: 'passed' | 'failed' }) =>
    <div className={css.kpi}>
        <span className={css.kpiLabel}>{label}</span>
        <span className={[css.kpiValue, tone && css[`text-${tone}`]].filter(Boolean).join(' ')}>{value}</span>
    </div>;

export const MainPage = () => {
    const { features } = useReport();
    const featureData = chartData(
        features.filter(feature => feature.status === 'passed').length,
        features.filter(feature => feature.status === 'failed').length,
        features.filter(feature => feature.status === 'skipped').length
    );
    const totalScenarios = sum(features, feature => feature.total);
    const passedScenarios = sum(features, feature => feature.passed);
    const failedScenarios = sum(features, feature => feature.failed);
    const scenarioData = chartData(
        passedScenarios,
        failedScenarios,
        sum(features, feature => feature.skipped)
    );
    const totalDuration = sum(features, feature => feature.duration);

    return (
        <div className={css.page}>
            <div className={css.kpiRow}>
                <Kpi label='Features' value={features.length}/>
                <Kpi label='Scenarios' value={totalScenarios}/>
                <Kpi label='Pass rate' value={`${percent(passedScenarios, totalScenarios)}%`}/>
                <Kpi label='Failed scenarios' value={failedScenarios} tone={failedScenarios > 0 ? 'failed' : 'passed'}/>
                <Kpi label='Duration' value={formatDuration(totalDuration)}/>
            </div>
            <div className={css.statisticsRow}>
                <StatisticsPanel title='Features' unit='features' data={featureData} total={features.length}/>
                <StatisticsPanel title='Scenarios' unit='scenarios' data={scenarioData} total={totalScenarios}/>
            </div>
            <Features data={features}/>
        </div>
    );
};
