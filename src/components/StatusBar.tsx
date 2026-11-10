import { percent } from '../utils/format';
import css from '../App.module.scss';

interface Props {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
}

/** Thin stacked bar showing the passed / failed / skipped proportion */
export const StatusBar = ({ passed, failed, skipped, total }: Props) => {
    const segments = [
        { key: 'passed', label: 'Passed', value: passed },
        { key: 'failed', label: 'Failed', value: failed },
        { key: 'skipped', label: 'Skipped', value: skipped }
    ].filter(segment => segment.value > 0);
    const summary = segments.map(segment => `${segment.label}: ${segment.value}`).join(', ');

    return <div className={css.statusBar} role='img' aria-label={summary || 'No scenarios'} title={summary}>
        {total > 0 && segments.map(segment => <span
            key={segment.key}
            className={css[`statusBar-${segment.key}`]}
            style={{ width: `${segment.value * 100 / total}%` }}
            title={`${segment.label}: ${segment.value} (${percent(segment.value, total)}%)`}
        />)}
    </div>;
};
