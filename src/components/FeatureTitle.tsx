import { TagList } from './TagList';
import { StatusBar } from './StatusBar';
import { TimeLabel } from './TimeLabel';
import type { Feature } from '../types';
import { formatDuration, percent } from '../utils/format';
import css from '../App.module.scss';

export const FeatureTitle = ({ feature }: { feature: Feature }) => <header className={css.featureHeader}>
    <div className={css.featureHeading}>
        <span className={css.keyword}>{feature.keyword ?? 'Feature'}</span>
        <h2 className={css.featureTitle}>{feature.name}</h2>
        <TagList tags={feature.tags} itemsToRender={10}/>
    </div>
    {feature.description?.trim() && <p className={css.featureDescription}>{feature.description.trim()}</p>}
    <div className={css.featureSummary}>
        <div className={css.featureSummaryBar}>
            <StatusBar passed={feature.passed} failed={feature.failed} skipped={feature.skipped} total={feature.total}/>
        </div>
        <span className={css.summaryCounts}>
            <span>{feature.total} scenarios</span>
            <span className={css['text-passed']}>{feature.passed} passed</span>
            {feature.failed > 0 && <span className={css['text-failed']}>{feature.failed} failed</span>}
            {feature.skipped > 0 && <span className={css['text-skipped']}>{feature.skipped} skipped</span>}
            <span className={css.muted}>{percent(feature.passed, feature.total)}% pass rate</span>
        </span>
        <TimeLabel time={formatDuration(feature.duration)}/>
    </div>
</header>;
