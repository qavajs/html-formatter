import React from 'react';
import {Panel, FlexSpacer, FlexRow, Text } from '@epam/promo';
import { Features } from '../components/Features';
import css from './MainPage.module.scss';

export const MainPage = () => {
    return (
        <>
            <FlexRow margin='12' spacing='12'>
                <Panel cx={css.statisticsPanel} background='white' shadow>
                    <FlexRow padding='12'>
                        <Text font='sans-semibold' size='48'>Feature Statistics</Text>
                    </FlexRow>
                </Panel>
                {/*<FlexSpacer/>*/}
                <Panel cx={css.statisticsPanel} background='white' shadow>
                    <FlexRow padding='12'>
                        <Text font='sans-semibold' size='48'>Scenario Statistics</Text>
                    </FlexRow>
                </Panel>
            </FlexRow>
            <Features data={window.data}/>
        </>
    );
};
