import React from 'react';
import { MainMenu, FlexSpacer, LinkButton } from '@epam/uui';
import css from './App.module.scss';
import { useUuiContext } from '@epam/uui-core';
import { MetadataModal } from './components/MetadataModal';

export const AppHeader = () => {
    const svc = useUuiContext();

    return (
        <MainMenu cx={css.header}>
            <LinkButton
                caption='@qavajs/html-formatter'
                href='#/'
                size='48'
                cx={css.title}
                captionCX={css.caption}
            />
            <FlexSpacer/>
            {window.metadata.length > 0 && <LinkButton
                onClick={() => svc.uuiModals.show((props) => <MetadataModal { ...props } metadata={window.metadata}/>)}
                caption='Metadata'
                size='48'
                cx={css.failedTitle}
                captionCX={css.caption}
            />}
            <LinkButton
                caption='Failed Scenarios'
                href='#/failed-scenarios'
                size='48'
                cx={css.failedTitle}
                captionCX={css.caption}
            />
        </MainMenu>
    )
}
