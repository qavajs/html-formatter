import React from 'react';
import {
    Badge,
    EpamAdditionalColor
} from '@epam/promo';

const color = (status: string): EpamAdditionalColor => {
    return {
        Passed: 'green',
        Failed: 'red'
    }[status] as EpamAdditionalColor
}
export const Legend = ({items, total}: { items: any[], total: number }) => {
    return <>
        {items.map((item: any, index: number) =>
            <Badge key={index} color={color(item.name)} fill='transparent'
                   caption={`${item.name} ${Math.round(item.value * 100 / total)}%`}/>
        )}
    </>
};
