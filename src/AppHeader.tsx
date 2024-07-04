import React from 'react';
import { MainMenu, FlexSpacer, MainMenuButton } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { MetadataModal } from './components/MetadataModal';
import { AdaptiveItemProps } from '@epam/uui-components';

export const AppHeader = () => {
    const svc = useUuiContext();

    const getMenuItems = (): AdaptiveItemProps<{ caption?: string; onClose?: () => void }>[] => {
        return [
            {
                id: 'main',
                priority: 1,
                render: (p) => <MainMenuButton key={p.id} href="/" caption="@qavajs/html-formatter" />,
                caption: '@qavajs/html-formatter'
            },
            { id: 'flexSpacer', priority: 2, render: (p) => <FlexSpacer key={p.id} /> },
            {
                id: 'Metadata',
                priority: 3,
                render: (p) =>
                    <MainMenuButton
                        key={p.id}
                        onClick={() => svc.uuiModals.show((props) => <MetadataModal {...props} metadata={window.metadata} />)} caption="Metadata" />,
                caption: 'Metadata'
            },
            {
                id: 'Failed',
                priority: 4,
                render: (p) => <MainMenuButton key={p.id} href="#/failed-scenarios" caption="Failed Scenarios" />,
                caption: 'Failed Scenarios'
            }
        ];
    };

    return (
        <MainMenu items={getMenuItems()} />
    );
};
