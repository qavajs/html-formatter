import React from 'react';
import { MainMenu, FlexSpacer, LinkButton } from '@epam/promo';
import css from './App.module.scss';

export const AppHeader = () => {
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
