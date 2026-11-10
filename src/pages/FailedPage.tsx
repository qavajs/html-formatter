import { FlexRow, Switch, Text } from '@epam/loveship';
import { Scenario } from '../components/Scenario';
import { FeatureTitle } from '../components/FeatureTitle';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { useReport } from '../ReportContext';
import { useFilterParams, useQueryParam, useShowPassedHooks } from '../hooks/useFilterParams';
import { useExpandAll } from '../hooks/useExpandAll';
import { failureSignature, scenarioHasTag, scenarioMatchesSearch } from '../report';
import type { Feature, Scenario as ScenarioType } from '../types';
import css from '../App.module.scss';

/** failed scenarios are expanded on open unless there are too many of them to render at once */
const AUTO_EXPAND_LIMIT = 50;
const GROUP_PARAM = 'group';

interface FailedScenario {
    feature: Feature;
    scenario: ScenarioType;
}

interface ErrorGroup {
    key: string;
    title: string;
    items: FailedScenario[];
}

function groupByError(items: FailedScenario[]): ErrorGroup[] {
    const groups = new Map<string, ErrorGroup>();
    for (const item of items) {
        const { key, title } = failureSignature(item.scenario);
        const group = groups.get(key);
        if (group) group.items.push(item); else groups.set(key, { key, title, items: [item] });
    }
    return [...groups.values()].sort((a, b) => b.items.length - a.items.length);
}

function useGroupByError(): [boolean, (value: boolean) => void] {
    const [group, setGroup] = useQueryParam(GROUP_PARAM);
    return [group === 'error', (value: boolean) => setGroup(value ? 'error' : null)];
}

export const FailedPage = () => {
    const { features } = useReport();
    const { search, setSearch, tag } = useFilterParams('isFailedShowOnlyFailed');
    const [showPassedHooks] = useShowPassedHooks();
    const [grouped, setGrouped] = useGroupByError();

    const allFailed: FailedScenario[] = features.flatMap(feature => feature.elements
        .filter(scenario => scenario.isFailed)
        .map(scenario => ({ feature, scenario })));
    const expand = useExpandAll(allFailed.length <= AUTO_EXPAND_LIMIT);

    const failed = allFailed.filter(({ scenario }) => scenarioMatchesSearch(scenario, search) && scenarioHasTag(scenario, tag));
    const renderScenario = ({ feature, scenario }: FailedScenario, showFeature: boolean) => <Scenario
        key={`${scenario.id}-${expand.version}`}
        scenario={scenario}
        defaultOpen={expand.open}
        featureName={showFeature ? feature.name : undefined}
        featureId={feature.id}
        hidePassedHooks={!showPassedHooks}
    />;

    const byFeature = features
        .map(feature => ({ feature, items: failed.filter(item => item.feature === feature) }))
        .filter(({ items }) => items.length > 0);

    return <>
        <ScenarioFilters
            search={search}
            onSearchChange={setSearch}
            scenarioCount={failed.length}
            onExpandAll={expand.expandAll}
            onCollapseAll={expand.collapseAll}
        >
            <Switch label='Group by error' value={grouped} onValueChange={setGrouped}/>
        </ScenarioFilters>
        {failed.length === 0 && <FlexRow padding='24'>
            <Text fontSize='16'>{search || tag ? 'No failed scenarios match the filters.' : 'No failed scenarios.'}</Text>
        </FlexRow>}
        {grouped
            ? groupByError(failed).map(group => <section key={group.key} className={css.errorGroup} data-testid='error-group'>
                <header className={css.errorGroupHeader}>
                    <span className={css.errorGroupCount}>{group.items.length}</span>
                    <code className={css.errorGroupTitle} title={group.title}>{group.title}</code>
                </header>
                {group.items.map(item => renderScenario(item, true))}
            </section>)
            : byFeature.map(({ feature, items }) => <div key={feature.id} data-testid='feature'>
                <FeatureTitle feature={feature}/>
                {items.map(item => renderScenario(item, false))}
            </div>)}
    </>;
};
