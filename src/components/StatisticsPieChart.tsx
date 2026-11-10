import type { ChartItem } from './Legend';
import { percent } from '../utils/format';

export const STATUS_COLORS: Record<ChartItem['name'], string> = {
    Passed: 'var(--report-status-passed)',
    Failed: 'var(--report-status-failed)',
    Undefined: 'var(--report-status-undefined)',
    Ambiguous: 'var(--report-status-ambiguous)',
    Pending: 'var(--report-status-pending)',
    Skipped: 'var(--report-status-skipped)'
};

const SIZE = 200;
const RADIUS = 80;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Lightweight donut chart (plain svg, no charting library) */
export const StatisticsPieChart = ({ data, total, label }: { data: ChartItem[], total: number, label?: string }) => {
    const segments = data
        .filter(item => item.value > 0)
        .reduce<Array<ChartItem & { length: number, offset: number }>>((acc, item) => {
            const previous = acc.at(-1);
            const offset = previous ? previous.offset + previous.length : 0;
            const length = total > 0 ? item.value / total * CIRCUMFERENCE : 0;
            return [...acc, { ...item, length, offset }];
        }, []);

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role='img' aria-label={`Total ${total}`}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill='none' stroke='var(--report-border)' strokeWidth={STROKE} opacity={0.25}/>
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                {segments.map(segment => <circle
                    key={segment.name}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill='none'
                    stroke={STATUS_COLORS[segment.name]}
                    strokeWidth={STROKE}
                    strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                    strokeDashoffset={-segment.offset}
                >
                    <title>{`${segment.name}: ${segment.value} (${percent(segment.value, total)}%)`}</title>
                </circle>)}
            </g>
            <text x='50%' y={label ? '46%' : '50%'} textAnchor='middle' dominantBaseline='central' className='statisticsTotal'>{total}</text>
            {label && <text x='50%' y='62%' textAnchor='middle' dominantBaseline='central' className='statisticsLabel'>{label}</text>}
        </svg>
    );
};
