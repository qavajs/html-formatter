import * as React from "react";
import { MainMenu, Text, LinkButton } from "@epam/promo";
import css from './App.module.scss';

export const AppHeader = () => {
    return (
        <MainMenu>
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
