import { FlexRow, LinkButton, Text } from '@epam/loveship';
import { useParams } from 'react-router-dom';
import { Scenario } from '../components/Scenario';
import { FeatureTitle } from '../components/FeatureTitle';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { useReport } from '../ReportContext';
import { useFilterParams, useQueryParam, useShowPassedHooks } from '../hooks/useFilterParams';
import { useExpandAll } from '../hooks/useExpandAll';
import { scenarioHasTag, scenarioMatchesSearch } from '../report';

export const FeaturePage = () => {
    const { id } = useParams();
    const { features } = useReport();
    const { search, setSearch, showOnlyFailed, setShowOnlyFailed, tag } = useFilterParams('isFeatureShowOnlyFailed');
    const [showPassedHooks] = useShowPassedHooks();
    const [targetScenario] = useQueryParam('scenario');
    const expand = useExpandAll(false);
    const feature = features.find(item => item.id === id);

    if (!feature) {
        return <FlexRow padding='24' vPadding='24' columnGap='12'>
            <Text fontSize='16'>Feature not found.</Text>
            <LinkButton caption='Back to all features' href='#/'/>
        </FlexRow>;
    }

    const scenarios = feature.elements.filter(scenario => scenario.id === targetScenario || (
        scenarioMatchesSearch(scenario, search)
        && scenarioHasTag(scenario, tag)
        && (!showOnlyFailed || scenario.isFailed)
    ));

    return <>
        <FeatureTitle feature={feature}/>
        <ScenarioFilters
            search={search}
            onSearchChange={setSearch}
            showOnlyFailed={showOnlyFailed}
            onShowOnlyFailedChange={setShowOnlyFailed}
            scenarioCount={scenarios.length}
            onExpandAll={expand.expandAll}
            onCollapseAll={expand.collapseAll}
        />
        {scenarios.length === 0 && <FlexRow padding='24'>
            <Text fontSize='16'>No scenarios match the filters.</Text>
        </FlexRow>}
        {scenarios.map(scenario => <Scenario
            key={`${scenario.id}-${expand.version}`}
            scenario={scenario}
            featureId={feature.id}
            defaultOpen={expand.open}
            hidePassedHooks={!showPassedHooks}
            highlight={scenario.id === targetScenario && expand.version === 0}
        />)}
    </>;
};
