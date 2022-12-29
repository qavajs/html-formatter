import React, { useState } from 'react';
import { FlexSpacer, FlexRow, TextInput, Switch, Text, Badge } from '@epam/promo';
import { useParams } from 'react-router-dom';
import { Scenario } from '../components/Scenario';
import css from "../App.module.scss";
import clipboard from '../utils/clipboard';

const filterScenarios = (
    tableData: Array<any>,
    filterOptions: { searchValue: string, showOnlyFailed: boolean }
) => {
    return tableData.filter((row: any) => {
        let result = true;
        if (filterOptions.searchValue) result = result && row.name.toLowerCase().includes(filterOptions.searchValue.toLowerCase())
        if (filterOptions.showOnlyFailed) result = result && row.isFailed
        return result
    })
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

function handleSwitchChange(setShowOnlyFailed: (value: boolean) => void) {
    return function (value: boolean) {
        window.sessionStorage.setItem('isFeatureShowOnlyFailed', value.toString())
        setShowOnlyFailed(value);
    };
}

export const FeaturePage = () => {
    const { id }: { id: string } = useParams();
    const feature = window.data.find((feature: any) => feature.id === id)
    const [searchValue, setSearchValue] = useState('');
    const [showOnlyFailed, setShowOnlyFailed] = useState(
        window.sessionStorage.getItem('isFeatureShowOnlyFailed') === 'true'
    );

    return <>
        <FeatureTitle feature={feature}/>
        <FlexRow padding='12' vPadding='12'>
            {/*@ts-ignore*/}
            <TextInput cx={css.searchInput} value={ searchValue } onValueChange={ setSearchValue }  placeholder='Search'/>
            <FlexSpacer/>
            <Switch label='Show Only Failed' value={ showOnlyFailed } onValueChange={ handleSwitchChange(setShowOnlyFailed) }/>
        </FlexRow>
        {filterScenarios(feature.elements, {searchValue, showOnlyFailed}).map(
            (scenario: any, index: number) => <Scenario key={index} scenario={scenario}/>
        )}
    </>
};
