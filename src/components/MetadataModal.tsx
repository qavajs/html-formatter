import {useState} from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Panel,
    ScrollBars,
    Text,
    DataTable
} from '@epam/promo';
import { DataColumnProps, useArrayDataSource } from '@epam/uui-core';

type Metadata = {
    key: string,
    value: string,
    id: string
}

const metadataColumns: DataColumnProps<Metadata>[] = [
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

export const MetadataModal = (modalProps: any) => {
    const [table, setTable] = useState({});

    const dataSource = useArrayDataSource<Metadata, number, unknown>({
        items: window.metadata
    }, []);

    const view = dataSource.useView(table, setTable, {});

    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow width={900} style={{ margin: 'auto'}}>
                <Panel>
                    <ModalHeader title="Metadata" onClose={() => modalProps.success('close')}/>
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <DataTable
                            { ...view.getListProps() }
                            getRows={ view.getVisibleRows }
                            value={ table }
                            onValueChange={ setTable }
                            columns={ metadataColumns }
                            headerTextCase='upper'
                        />
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
