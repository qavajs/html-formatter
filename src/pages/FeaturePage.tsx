import React, {useState} from 'react';
import { FlexSpacer, FlexRow, TextInput, Switch} from '@epam/promo';
import {useParams} from 'react-router-dom';
import {Scenario} from '../components/Scenario';
import css from "./FeaturePage.module.scss";

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

export const FeaturePage = (props: any) => {
    const { id }: { id: string } = useParams();
    const feature = id
        ? window.data.find((feature: any) => feature.id === id)
        : window.data.reduce((failedScenarios: any, feature: any) => {
            failedScenarios.elements.push(...feature.elements.filter((scenario: any) => scenario.isFailed))
            return failedScenarios
        }, {elements: []});
    const [searchValue, setSearchValue] = useState('');
    const [showOnlyFailed, setShowOnlyFailed] = useState(false);

    return <>
        <FlexRow padding='12' vPadding='12'>
            {/*@ts-ignore*/}
            <TextInput cx={css.searchInput} value={ searchValue } onValueChange={ setSearchValue }  placeholder='Search'/>
            <FlexSpacer/>
            <Switch label='Show Only Failed' value={ showOnlyFailed } onValueChange={ setShowOnlyFailed }/>
        </FlexRow>
        {filterScenarios(feature.elements, {searchValue, showOnlyFailed}).map(
            (scenario: any, index: number) => <Scenario key={index} scenario={scenario}/>
        )}
    </>
};
