import { FlexRow, Accordion } from '@epam/loveship';
import { FlexSpacer } from '@epam/uui';
import { Step } from './Step';
import { TimeLabel } from './TimeLabel';
import { TagList } from './TagList';
import type { Scenario as ScenarioType, StepStatus } from '../types';
import { formatDuration } from '../utils/format';
import css from '../App.module.scss';

const countedStatuses: StepStatus[] = ['passed', 'failed', 'skipped', 'undefined', 'ambiguous', 'pending'];

const ScenarioTitle = ({ scenario }: { scenario: ScenarioType }) =>
    <FlexRow columnGap='12' cx={css.scenarioTitle}>
        <span className={css.scenarioName}>
            <span className={css.keyword}>{scenario.keyword ?? 'Scenario'}</span>
            {scenario.name}
        </span>
        <span className={css.stepCounts}>
            {countedStatuses.map(status => {
                const count = scenario.steps.filter(step => step.result.status === status).length;
                return count > 0 && <span
                    key={status}
                    className={[css.stepCount, css[`stepCount-${status}`]].join(' ')}
                    title={`${count} ${status} step${count > 1 ? 's' : ''}`}
                >{count}</span>;
            })}
        </span>
        <TagList tags={scenario.tags} itemsToRender={10}/>
        <FlexSpacer/>
        <TimeLabel time={formatDuration(scenario.duration)}/>
    </FlexRow>;

export const Scenario = ({ scenario }: { scenario: ScenarioType }) =>
    <div className={[css.scenario, css[`scenario-${scenario.isFailed ? 'failed' : scenario.outcome}`]].join(' ')}>
        <Accordion renderTitle={() => <ScenarioTitle scenario={scenario}/>} mode='block'>
            <div className={css.steps}>
                {scenario.steps.map(step => <Step key={step.id} step={step}/>)}
            </div>
        </Accordion>
    </div>;
