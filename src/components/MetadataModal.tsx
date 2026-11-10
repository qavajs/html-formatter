import { useState } from 'react';
import { Text, DataTable } from '@epam/loveship';
import { DataColumnProps, DataTableState, useArrayDataSource } from '@epam/uui-core';
import { BaseModal, ModalProps } from './BaseModal';
import type { MetadataItem } from '../types';

const metadataColumns: DataColumnProps<MetadataItem>[] = [
    {
        key: 'key',
        caption: 'Key',
        render: item => <Text fontSize='16' lineHeight='30'>{item.key}</Text>,
        width: 400
    },
    {
        key: 'value',
        caption: 'Value',
        render: item => <Text fontSize='16' lineHeight='30'>{item.value}</Text>,
        width: 400,
    }];

export const MetadataModal = ({ metadata, ...modal }: ModalProps & { metadata: MetadataItem[] }) => {
    const [table, setTable] = useState<DataTableState>({});

    const dataSource = useArrayDataSource<MetadataItem, string, unknown>({
        items: metadata
    }, [metadata]);

    // useView is UUI data source API hook, it is stable for a given data source
    // oxlint-disable-next-line react/hooks
    const view = dataSource.useView(table, setTable, {});

    return <BaseModal modal={modal} title='Metadata'>
        <DataTable
            {...view.getListProps()}
            getRows={view.getVisibleRows}
            value={table}
            onValueChange={setTable}
            columns={metadataColumns}
            headerTextCase='upper'
        />
    </BaseModal>;
};
