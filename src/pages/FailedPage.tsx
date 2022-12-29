import React, {useState} from 'react';
import {FlexSpacer, FlexRow, TextInput, Switch, Text, Badge} from '@epam/promo';
import {Scenario} from '../components/Scenario';
import css from "../App.module.scss";
import clipboard from '../utils/clipboard';

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

const FeatureTitle = (props: any) => <FlexRow padding='12' vPadding='12'>
    <Text font='sans-semibold' cx={css.featureTitle}>Feature: {props.feature.name}</Text>
    {props.feature.tags.map((tag: any, index: number) => <Badge
        cx={css.tagBadge}
        key={index}
        size='18'
        color='blue'
        fill='semitransparent'
        caption={tag.name}
        onClick={clipboard(tag.name)}
    />)}
</FlexRow>

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
