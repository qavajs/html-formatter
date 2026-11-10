import { useState } from 'react';
import { Panel, FlexRow, DataTable, Text, Badge, LinkButton, TextInput, Switch, FlexSpacer } from '@epam/loveship';
import { DataColumnProps, DataTableState, useArrayDataSource } from '@epam/uui-core';
import { ActiveTagFilter, TagList } from './TagList';
import { SEARCH_PLACEHOLDER } from './ScenarioFilters';
import { featureHasTag, featureMatchesSearch } from '../report';
import { StatusBar } from './StatusBar';
import type { Feature } from '../types';
import { formatDuration, percent } from '../utils/format';
import { useFilterParams } from '../hooks/useFilterParams';
import css from '../App.module.scss';

const statusColors = {
    passed: 'success',
    failed: 'fire',
    skipped: 'cobalt'
} as const;

const Count = ({ value, status }: { value: number, status?: 'passed' | 'failed' | 'skipped' | 'undefined' }) =>
    <span className={value === 0 ? css.muted : status ? css[`text-${status}`] : undefined}>{value}</span>;

const featureColumns: DataColumnProps<Feature>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: item => <LinkButton caption={item.name} href={`#/feature/${item.id}`} size='36'/>,
        isSortable: true,
        width: 220,
        grow: 2
    },
    {
        key: 'status',
        caption: 'Status',
        render: item => <FlexRow>
            <Badge size='24' color={statusColors[item.status]} fill='outline' caption={item.status}/>
        </FlexRow>,
        isSortable: true,
        width: 90
    },
    {
        key: 'progress',
        caption: 'Progress',
        render: item => <div className={css.progressCell}>
            <StatusBar passed={item.passed} failed={item.failed} skipped={item.skipped} total={item.total}/>
            <span className={css.progressPercent}>{percent(item.passed, item.total)}%</span>
        </div>,
        width: 140,
        grow: 1
    },
    {
        key: 'tags',
        caption: 'Tags',
        render: item => <div className={css.tableCell}><TagList tags={item.tags} itemsToRender={3}/></div>,
        grow: 1,
        width: 140,
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
        width: 92,
    },
    {
        key: 'failed',
        caption: 'Failed',
        render: item => <Text><Count value={item.failed} status='failed'/></Text>,
        isSortable: true,
        grow: 1,
        width: 88,
    },
    {
        key: 'skipped',
        caption: 'Skipped',
        render: item => <Text><Count value={item.skipped} status='skipped'/></Text>,
        isSortable: true,
        grow: 1,
        width: 100,
    },
    {
        key: 'flaky',
        caption: 'Flaky',
        render: item => <Text><Count value={item.flaky} status='undefined'/></Text>,
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
        width: 112,
    },
];

export const Features = ({ data }: { data: Feature[] }) => {
    // failed features first by default ("failed" < "passed" < "skipped")
    const [table, setTable] = useState<DataTableState>({ sorting: [{ field: 'status', direction: 'asc' }] });
    const { search, setSearch, showOnlyFailed, setShowOnlyFailed, tag } = useFilterParams('isMainShowOnlyFailed');

    const items = data.filter(feature => featureMatchesSearch(feature, search)
        && featureHasTag(feature, tag)
        && (!showOnlyFailed || feature.failed > 0));
    const dataSource = useArrayDataSource<Feature, string, unknown>({ items }, [data, search, showOnlyFailed, tag]);
    // useView is UUI data source API hook, it is stable for a given data source
    // oxlint-disable-next-line react/hooks
    const view = dataSource.useView(table, setTable, {});

    return (
        <section className={css.card}>
            <h2 className={css.cardTitle}>All features</h2>
            <Panel cx={css.features}>
                <FlexRow vPadding='12'>
                    <TextInput cx={css.searchInput} value={search} onValueChange={setSearch} placeholder={SEARCH_PLACEHOLDER}/>
                    <ActiveTagFilter/>
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
