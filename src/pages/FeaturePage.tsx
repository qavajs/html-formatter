import { FlexRow, LinkButton, Text } from '@epam/loveship';
import { useParams } from 'react-router-dom';
import { Scenario } from '../components/Scenario';
import { FeatureTitle } from '../components/FeatureTitle';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { useReport } from '../ReportContext';
import { useFilterParams } from '../hooks/useFilterParams';
import { matchesSearch } from '../utils/format';

export const FeaturePage = () => {
    const { id } = useParams();
    const { features } = useReport();
    const { search, setSearch, showOnlyFailed, setShowOnlyFailed } = useFilterParams('isFeatureShowOnlyFailed');
    const feature = features.find(item => item.id === id);

    if (!feature) {
        return <FlexRow padding='24' vPadding='24' columnGap='12'>
            <Text fontSize='16'>Feature not found.</Text>
            <LinkButton caption='Back to all features' href='#/'/>
        </FlexRow>;
    }

    const scenarios = feature.elements
        .filter(scenario => matchesSearch(scenario.name, search) && (!showOnlyFailed || scenario.isFailed));

    return <>
        <FeatureTitle feature={feature}/>
        <ScenarioFilters
            search={search}
            onSearchChange={setSearch}
            showOnlyFailed={showOnlyFailed}
            onShowOnlyFailedChange={setShowOnlyFailed}
        />
        {scenarios.map(scenario => <Scenario key={scenario.id} scenario={scenario}/>)}
    </>;
};
