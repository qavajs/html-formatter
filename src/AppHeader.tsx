import * as React from "react";
import { MainMenu, Text, LinkButton } from "@epam/promo";
import css from './App.module.scss';

export const AppHeader = () => {
    return (
        <MainMenu cx={css.header}>
            <LinkButton
                caption='@qavajs/html-formatter'
                link={ { pathname: '/' } }
                size='48'
                cx={css.title}
                captionCX={css.caption}
            />
        </MainMenu>
    )
}
