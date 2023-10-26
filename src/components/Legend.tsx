import {Badge} from '@epam/promo';

const color = (status: string): any => {
    return {
        Passed: 'green',
        Failed: 'red'
    }[status] as any
}
export const Legend = ({items, total}: { items: any[], total: number }) => {
    return <>
        {items.map((item: any, index: number) =>
            <Badge key={index} color={color(item.name)} fill='transparent'
                   caption={`${item.name} ${Math.round(item.value * 100 / total)}%`}/>
        )}
    </>
};
