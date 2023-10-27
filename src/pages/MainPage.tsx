import { CSSProperties } from 'react';
import { Panel, FlexSpacer, FlexRow, Text, FlexCell } from '@epam/promo';
import { Features } from '../components/Features';
import { StatisticsPieChart } from '../components/StatisticsPieChart';
import css from '../App.module.scss';
import { Legend } from '../components/Legend';

export const MainPage = () => {
    const featuresTotal = window.data.length;
    const scenariosTotal = window.data.reduce(
        (total:number, feature: any) => total + feature.elements.length, 0
    )
    const featureChartData = [
        { name: 'Passed', value: window.data.reduce(
            (passed: number, feature: any) => passed + +!(feature.failed > 0), 0)
        },
        { name: 'Failed', value: window.data.reduce(
            (failed: number, feature: any) => failed + +(feature.failed > 0), 0)
        }
    ];
    const scenarioChartData = [
        { name: 'Passed', value: window.data.reduce((passed: number, feature: any) => passed + feature.passed, 0) },
        { name: 'Failed', value: window.data.reduce((failed: number, feature: any) => failed + feature.failed, 0) }
    ];

    const totalNumberStyle = {
        fontSize: '64px',
        position: 'relative',
        top: '135px',
        left: '35px',
        height: '0px',
        textAlign: 'center',
        width: '200px',
        fontFamily: `Arial, "Sans Semibold", sans-serif,"Museo Sans"`,
        color: '#303240'
    } as CSSProperties;

    return (
        <>
            <FlexRow margin='12' spacing='12'>
                <Panel cx={css.statisticsPanel} background='white' shadow>
                    <span style={totalNumberStyle}>{featuresTotal}</span>
                    <FlexRow padding='12'>
                        <Text font='sans-semibold' size='48'>Feature Statistics</Text>
                    </FlexRow>
                    <FlexRow padding='12'>
                        <FlexCell minWidth={300}>
                            <StatisticsPieChart data={featureChartData}/>
                        </FlexCell>
                        <FlexCell minWidth={200}>
                            <Legend items={featureChartData} total={featuresTotal}/>
                        </FlexCell>
                    </FlexRow>
                </Panel>
                <FlexSpacer/>
                <Panel cx={css.statisticsPanel} background='white' shadow>
                    <span style={totalNumberStyle}>{scenariosTotal}</span>
                    <FlexRow padding='12'>
                        <Text font='sans-semibold' size='48'>Scenario Statistics</Text>
                    </FlexRow>
                    <FlexRow padding='12'>
                        <FlexCell minWidth={300}>
                            <StatisticsPieChart data={scenarioChartData}/>
                        </FlexCell>
                        <FlexCell minWidth={200}>
                            <Legend items={scenarioChartData} total={scenariosTotal}/>
                        </FlexCell>
                    </FlexRow>
                </Panel>
            </FlexRow>
            <Features data={window.data}/>
        </>
    );
};
