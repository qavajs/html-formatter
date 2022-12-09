import React from 'react';
import {Panel, FlexSpacer, FlexRow, FlexCell, Accordion, Text, IconContainer} from '@epam/promo';
import { Step } from '../components/Step';
import {useParams} from 'react-router-dom';
import {Scenario} from '../components/Scenario';


export const FeaturePage = (props: any) => {
    const { id }: { id: string } = useParams();
    const feature = window.data.find((feature: any) => feature.id === id);
    return feature.elements.map((scenario: any) => <Scenario scenario={scenario}/>
    );
};
