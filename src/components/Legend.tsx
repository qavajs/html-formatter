import { percent } from '../utils/format';
import css from '../App.module.scss';

export interface ChartItem {
    name: 'Passed' | 'Failed' | 'Undefined' | 'Ambiguous' | 'Pending' | 'Skipped';
    /** hover hint explaining the item */
    hint?: string;
    value: number;
}

export const Legend = ({ items, total }: { items: ChartItem[], total: number }) => <ul className={css.legend}>
    {items.map(item => <li key={item.name} className={css.legendItem} title={item.hint}>
        <span className={[css.legendSwatch, css[`swatch-${item.name.toLowerCase()}`]].join(' ')}/>
        <span className={css.legendName}>{item.name}</span>
        <span className={css.legendValue}>{item.value}</span>
        <span className={css.legendPercent}>{percent(item.value, total)}%</span>
    </li>)}
</ul>;
