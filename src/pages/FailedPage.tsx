import { FlexRow, Text } from '@epam/loveship';
import { Scenario } from '../components/Scenario';
import { FeatureTitle } from '../components/FeatureTitle';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { useReport } from '../ReportContext';
import { useFilterParams } from '../hooks/useFilterParams';
import { matchesSearch } from '../utils/format';

export const FailedPage = () => {
    const { features } = useReport();
    const { search, setSearch } = useFilterParams('isFailedShowOnlyFailed');

    const failedFeatures = features
        .map(feature => ({
            feature,
            scenarios: feature.elements.filter(scenario => scenario.isFailed && matchesSearch(scenario.name, search))
        }))
        .filter(({ scenarios }) => scenarios.length > 0);

    return <>
        <ScenarioFilters search={search} onSearchChange={setSearch}/>
        {failedFeatures.length === 0 && <FlexRow padding='24'>
            <Text fontSize='16'>{search ? 'No failed scenarios match the search.' : 'No failed scenarios.'}</Text>
        </FlexRow>}
        {failedFeatures.map(({ feature, scenarios }) => <div key={feature.id} data-testid='feature'>
            <FeatureTitle feature={feature}/>
            {scenarios.map(scenario => <Scenario key={scenario.id} scenario={scenario}/>)}
        </div>)}
    </>;
};
