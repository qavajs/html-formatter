import React, { useState } from 'react';
import { FlexRow, TextInput } from '@epam/promo';
import { Scenario } from '../components/Scenario';
import css from '../App.module.scss';
import { FeatureTitle } from '../components/FeatureTitle';

const filterScenarios = (
    tableData: Array<any>,
    filterOptions: { searchValue: string }
) => {
    return tableData
        .map((feature: any) => ({
            ...feature,
            elements: feature.elements.filter((scenario: any) => scenario.name.toLowerCase().includes(filterOptions.searchValue.toLowerCase()))
        }))
}

export const FailedPage = () => {
    const features = window.data
        .map((feature: any) => ({
            ...feature,
            elements: feature.elements.filter((scenario: any) => scenario.isFailed)
        }));
    const [searchValue, setSearchValue] = useState('');

    return <>
        <FlexRow padding='12' vPadding='12'>
            {/*@ts-ignore*/}
            <TextInput cx={css.searchInput} value={searchValue} onValueChange={setSearchValue} placeholder='Search'/>
        </FlexRow>
        {filterScenarios(features, {searchValue})
            .filter((feature: any) => feature.elements.length > 0)
            .map((feature: any) => <div key={feature.id} data-testid='feature'>
            <FeatureTitle feature={feature}/>
            {feature.elements.map(
                (scenario: any, index: number) => <Scenario key={index} scenario={scenario}/>
            )}
        </div>)}
    </>
};
