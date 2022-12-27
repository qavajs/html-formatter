import React from 'react';
import { FlexRow, Text, Badge, FlexCell, Accordion } from '@epam/promo';
import { Step } from './Step';
import css from '../App.module.scss';
import clipboard from '../utils/clipboard';

const filterByStatus = (scenario: any, status: string) => scenario.steps.filter((step: any) => step.result.status === status);
const scenarioTitle = (scenario: any) => () => {
    const passed = filterByStatus(scenario, 'passed').length;
    const failed = filterByStatus(scenario, 'failed').length;
    const skipped = filterByStatus(scenario, 'skipped').length;
    const undefinedSteps = filterByStatus(scenario, 'undefined').length;
    const ambiguous = filterByStatus(scenario, 'ambiguous').length;
    const pending = filterByStatus(scenario, 'pending').length;

    return <FlexRow spacing='12' padding='6' vPadding='12' cx={css.scenarioTitle}>
        <Text fontSize='16' font='sans-semibold'>Scenario: {scenario.name}</Text>
        {passed > 0 && <Badge color='green' fill='semitransparent' caption={passed}/>}
        {failed > 0 && <Badge color='red' fill='semitransparent' caption={failed}/>}
        {skipped > 0 && <Badge color='blue' fill='semitransparent' caption={skipped}/>}
        {undefinedSteps > 0 && <Badge color='amber' fill='semitransparent' caption={undefinedSteps}/>}
        {ambiguous > 0 && <Badge color='orange' fill='semitransparent' caption={ambiguous}/>}
        {pending > 0 && <Badge color='gray30' fill='semitransparent' caption={pending}/>}
        {scenario.tags.map((tag: any) => <Badge
            key={tag.name}
            cx={css.tagBadge}
            size='18'
            color='blue'
            fill='semitransparent'
            caption={tag.name}
            onClick={clipboard(tag.name)}
        />)}
    </FlexRow>
}

export const Scenario = ({scenario}: { scenario: any }) => {
    return <FlexRow margin='12' spacing='12' key={scenario.id}>
        <FlexCell width='100%'>
            <Accordion renderTitle={scenarioTitle(scenario)} mode='block'>
                {scenario.steps.map((step: any, index: number) =>
                    <Step key={index} step={step}/>
                )}
            </Accordion>
        </FlexCell>
    </FlexRow>
};
