import { MainMenu, FlexSpacer, MainMenuButton } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { AdaptiveItemProps } from '@epam/uui-components';
import { MetadataModal } from './components/MetadataModal';
import { useReport } from './ReportContext';
import { showModal } from './utils/showModal';

const TITLE = '@qavajs/html-formatter';

export const AppHeader = () => {
    const { uuiModals } = useUuiContext();
    const { metadata } = useReport();

    const items: AdaptiveItemProps[] = [
        {
            id: 'main',
            priority: 1,
            render: p => <MainMenuButton key={p.id} href='#' caption={TITLE}/>
        },
        { id: 'flexSpacer', priority: 2, render: p => <FlexSpacer key={p.id}/> },
        {
            id: 'Metadata',
            priority: 3,
            render: p => <MainMenuButton
                key={p.id}
                caption='Metadata'
                onClick={() => showModal(uuiModals, props => <MetadataModal {...props} metadata={metadata}/>)}
            />
        },
        {
            id: 'Failed',
            priority: 4,
            render: p => <MainMenuButton key={p.id} href='#/failed-scenarios' caption='Failed Scenarios'/>
        }
    ];

    return <MainMenu items={items}/>;
};
