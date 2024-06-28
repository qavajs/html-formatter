import {Badge, FlexRow} from '@epam/loveship';

const color = (status: string): any => {
    return {
        Passed: 'success',
        Failed: 'error'
    }[status] as any
}
export const Legend = ({items, total}: { items: any[], total: number }) => {
    return <>
        {items.map((item: any, index: number) => <FlexRow columnGap="18" key="02">
                <Badge key={index} color={color(item.name)} fill='outline' size='24'
                       caption={`${item.name} ${Math.round(item.value * 100 / total)}%`}/>
            </FlexRow>
        )}
    </>
};
