import React, { useMemo, useState} from 'react';
import {Panel, FlexRow, DataTable, Text, Badge, LinkButton, IconContainer, FlexCell, Accordion} from '@epam/promo';
import {Step} from "./Step";

const filterByStatus = (scenario: any, status: string) => scenario.steps.filter((step: any) => step.result.status === status);
const scenarioTitle = (scenario: any) => () => {
    const passed = filterByStatus(scenario, 'passed').length;
    const failed = filterByStatus(scenario, 'failed').length;
    const skipped = filterByStatus(scenario, 'skipped').length;
    return <FlexCell grow={1}>
        <FlexRow spacing='12' padding="6">
            <Text fontSize='16' font='sans-semibold'>{scenario.name}</Text>
            {passed > 0 && <Badge color='green' fill='semitransparent' caption={passed}/>}
            {failed > 0 && <Badge color='red' fill='semitransparent' caption={failed}/>}
            {skipped > 0 && <Badge color='blue' fill='semitransparent' caption={skipped}/>}
        </FlexRow>
    </FlexCell>
}

export const Scenario = ({scenario}: {scenario: any}) => {
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
