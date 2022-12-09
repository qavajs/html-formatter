import React, { useMemo, useState} from 'react';
import {Panel, FlexRow, DataTable, Text, Badge, LinkButton} from '@epam/promo';
import { DataColumnProps, useArrayDataSource } from "@epam/uui-core";
import css from './Features.module.scss';

type Feature = {
    id: string,
    name: string,
    status: string,
    tags: string[],
    total: number,
    passed: number,
    failed: number
}

export const Features = (props: any) => {
    const [value, onValueChange] = useState({});

    const dataSource = useArrayDataSource<Feature, number, unknown>({
        items: props.data,
    }, []);

    const view = dataSource.useView(value, onValueChange, {});

    const featureColumns: DataColumnProps<Feature>[] = useMemo(() => [
        {
            key: 'name',
            caption: 'Name',
            render: item => <LinkButton caption={item.name} link={ { pathname: `/${item.id}` } } size='42' />,
            isSortable: true,
            width: 400,
        },
        {
            key: 'status',
            caption: 'Status',
            render: item => <FlexRow>
                <Badge cx={css.tagBadge} size='24' color={item.status === 'failed' ? 'red' : 'green'} fill='transparent' caption={item.status} />
            </FlexRow>,
            isSortable: true,
            width: 100,
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
    ], []);

    return (
        <FlexRow margin='12'>
            <Panel cx={css.features} background='white' shadow>
                <DataTable
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    value={ value }
                    onValueChange={ onValueChange }
                    columns={ featureColumns }
                    headerTextCase='upper'
                />
            </Panel>
        </FlexRow>
    );
};
