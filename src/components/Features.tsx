import { useState } from 'react';
import { Panel, FlexRow, DataTable, Text, Badge, LinkButton, TextInput, Switch, FlexSpacer } from '@epam/loveship';
import { DataColumnProps, DataTableState, useArrayDataSource } from '@epam/uui-core';
import { TagList } from './TagList';
import { StatusBar } from './StatusBar';
import type { Feature } from '../types';
import { formatDuration, matchesSearch, percent } from '../utils/format';
import { useFilterParams } from '../hooks/useFilterParams';
import css from '../App.module.scss';

const statusColors = {
    passed: 'success',
    failed: 'fire',
    skipped: 'cobalt'
} as const;

const Count = ({ value, status }: { value: number, status?: 'passed' | 'failed' | 'skipped' }) =>
    <span className={value === 0 ? css.muted : status ? css[`text-${status}`] : undefined}>{value}</span>;

const featureColumns: DataColumnProps<Feature>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: item => <LinkButton caption={item.name} href={`#/feature/${item.id}`} size='36'/>,
        isSortable: true,
        width: 280
    },
    {
        key: 'status',
        caption: 'Status',
        render: item => <FlexRow>
            <Badge size='24' color={statusColors[item.status]} fill='outline' caption={item.status}/>
        </FlexRow>,
        isSortable: true,
        width: 100
    },
    {
        key: 'progress',
        caption: 'Progress',
        render: item => <div className={css.progressCell}>
            <StatusBar passed={item.passed} failed={item.failed} skipped={item.skipped} total={item.total}/>
            <span className={css.progressPercent}>{percent(item.passed, item.total)}%</span>
        </div>,
        width: 160,
        grow: 1
    },
    {
        key: 'tags',
        caption: 'Tags',
        render: item => <div className={css.tableCell}><TagList tags={item.tags} itemsToRender={3}/></div>,
        grow: 2,
        width: 260,
    },
    {
        key: 'total',
        caption: 'Total',
        render: item => <Text><Count value={item.total}/></Text>,
        isSortable: true,
        grow: 1,
        width: 80,
    },
    {
        key: 'passed',
        caption: 'Passed',
        render: item => <Text><Count value={item.passed} status='passed'/></Text>,
        isSortable: true,
        grow: 1,
        width: 80,
    },
    {
        key: 'failed',
        caption: 'Failed',
        render: item => <Text><Count value={item.failed} status='failed'/></Text>,
        isSortable: true,
        grow: 1,
        width: 80,
    },
    {
        key: 'skipped',
        caption: 'Skipped',
        render: item => <Text><Count value={item.skipped} status='skipped'/></Text>,
        isSortable: true,
        grow: 1,
        width: 80,
    },
    {
        key: 'duration',
        caption: 'Duration',
        render: item => <Text><span className={css.muted}>{formatDuration(item.duration)}</span></Text>,
        isSortable: true,
        grow: 1,
        width: 100,
    },
];

export const Features = ({ data }: { data: Feature[] }) => {
    const [table, setTable] = useState<DataTableState>({});
    const { search, setSearch, showOnlyFailed, setShowOnlyFailed } = useFilterParams('isMainShowOnlyFailed');

    const items = data.filter(feature => matchesSearch(feature.name, search) && (!showOnlyFailed || feature.failed > 0));
    const dataSource = useArrayDataSource<Feature, string, unknown>({ items }, [data, search, showOnlyFailed]);
    // useView is UUI data source API hook, it is stable for a given data source
    // oxlint-disable-next-line react/hooks
    const view = dataSource.useView(table, setTable, {});

    return (
        <section className={css.card}>
            <h2 className={css.cardTitle}>All features</h2>
            <Panel cx={css.features}>
                <FlexRow vPadding='12'>
                    <TextInput cx={css.searchInput} value={search} onValueChange={setSearch} placeholder='Search'/>
                    <FlexSpacer/>
                    <Switch label='Show Only Failed' value={showOnlyFailed} onValueChange={setShowOnlyFailed}/>
                </FlexRow>
                <FlexRow>
                    <DataTable
                        getRows={view.getVisibleRows}
                        value={table}
                        onValueChange={setTable}
                        columns={featureColumns}
                        headerTextCase='upper'
                        {...view.getListProps()}
                    />
                </FlexRow>
            </Panel>
        </section>
    );
};
