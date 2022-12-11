import React, { useState } from 'react';
import {
    Panel,
    FlexRow,
    DataTable,
    Text,
    Badge,
    LinkButton,
    TextInput, Switch, FlexSpacer
} from '@epam/promo';
import { DataColumnProps, useArrayDataSource } from '@epam/uui-core';
import css from '../App.module.scss';

type Feature = {
    id: string,
    name: string,
    status: string,
    tags: string[],
    total: number,
    passed: number,
    failed: number
}

const featureColumns: DataColumnProps<Feature>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: item => <LinkButton caption={item.name} href={`#/feature/${item.id}`} size='42' />,
        isSortable: true,
        width: 400
    },
    {
        key: 'status',
        caption: 'Status',
        render: item => <FlexRow>
            <Badge cx={css.tagBadge} size='24' color={item.status === 'failed' ? 'red' : 'green'} fill='transparent' caption={item.status} />
        </FlexRow>,
        isSortable: true,
        width: 100,
        isFilterActive: f => !!f.status,
    },
    {
        key: 'tags',
        caption: 'Tags',
        render: item => (<FlexRow>
            {item.tags.map((tag: any) => <Badge cx={css.tagBadge} size='18' color='blue' fill='semitransparent' caption={tag.name} />)}
        </FlexRow>),
        grow: 1,
        width: 200,
    },
    {
        key: 'total',
        caption: 'Total',
        render: item => <Text color='gray80'>{ item.total }</Text>,
        isSortable: true,
        grow: 1,
        width: 100,
    },
    {
        key: 'passed',
        caption: 'passed',
        render: item => <Text color='gray80'>{ item.passed }</Text>,
        isSortable: true,
        grow: 1,
        width: 100,
    },
    {
        key: 'failed',
        caption: 'Failed',
        render: item => <Text color='gray80'>{ item.failed }</Text>,
        isSortable: true,
        grow: 1,
        width: 100,
    },
];

const filterTable = (
    tableData: Array<any>,
    filterOptions: { searchValue: string, showOnlyFailed: boolean }
) => {
    return tableData.filter((row: Feature) => {
        let result = true;
        if (filterOptions.searchValue) result = result && row.name.toLowerCase().includes(filterOptions.searchValue.toLowerCase())
        if (filterOptions.showOnlyFailed) result = result && row.failed > 0
        return result
    })
}

export const Features = (props: any) => {
    const [table, setTable] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [showOnlyFailed, setShowOnlyFailed] = useState(false);

    const dataSource = useArrayDataSource<Feature, number, unknown>({
        items: filterTable(props.data, {searchValue, showOnlyFailed}),
    }, []);

    const view = dataSource.useView(table, setTable, {});

    return (
        <FlexRow margin='12'>
            <Panel cx={css.features} background='white' shadow>
                <FlexRow padding='12' vPadding='12'>
                    {/*@ts-ignore*/}
                    <TextInput cx={css.searchInput} value={ searchValue } onValueChange={ setSearchValue }  placeholder='Search'/>
                    <FlexSpacer/>
                    <Switch label='Show Only Failed' value={ showOnlyFailed } onValueChange={ setShowOnlyFailed }/>
                </FlexRow>
                <FlexRow>
                    <DataTable
                        getRows={ view.getVisibleRows }
                        value={ table }
                        onValueChange={ setTable }
                        columns={ featureColumns }
                        headerTextCase='upper'
                        { ...view.getListProps() }
                    />
                </FlexRow>
            </Panel>
        </FlexRow>
    );
};
