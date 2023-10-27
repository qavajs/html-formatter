import {Badge, FlexRow, Text} from '@epam/promo';
import css from '../App.module.scss';
import clipboard from '../utils/clipboard';

export const FeatureTitle = (props: any) => <FlexRow padding='12' vPadding='12'>
    <Text font='sans-semibold' cx={css.featureTitle}>Feature: {props.feature.name}</Text>
    {props.feature.tags.map((tag: any, index: number) => <Badge
        cx={css.tagBadge}
        key={index}
        size='18'
        color='blue'
        fill='semitransparent'
        caption={tag.name}
        onClick={clipboard(tag.name)}
    />)}
</FlexRow>
