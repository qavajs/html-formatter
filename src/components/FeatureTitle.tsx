import {FlexRow, Text} from '@epam/loveship';
import css from '../App.module.scss';
import {TagList} from './TagList';

export const FeatureTitle = (props: any) => <FlexRow padding='12' vPadding='12'>
    <Text cx={css.featureTitle}>Feature: {props.feature.name}</Text>
    <TagList tags={props.feature.tags} itemsToRender={10}/>
</FlexRow>
