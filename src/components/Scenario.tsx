import { useEffect, useRef, useState } from 'react';
import { FlexRow, Accordion, IconButton } from '@epam/loveship';
import { FlexSpacer } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import LinkIcon from '@epam/assets/icons/common/content-link-18.svg?react';
import { Step } from './Step';
import { TimeLabel } from './TimeLabel';
import { TagList } from './TagList';
import { ErrorModal } from './ErrorModal';
import { ErrorPreview } from './ErrorPreview';
import { showModal } from '../utils/showModal';
import { stopKeyboardPropagation } from '../utils/events';
import type { AttemptSummary, Scenario as ScenarioType, Step as StepType, StepStatus } from '../types';
import { formatDuration } from '../utils/format';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import css from '../App.module.scss';

const countedStatuses: StepStatus[] = ['passed', 'failed', 'skipped', 'undefined', 'ambiguous', 'pending'];
const ERROR_PREVIEW_LINES = 6;

const retriesText = (count: number) => `${count} ${count === 1 ? 'retry' : 'retries'}`;

/** Shareable link that opens the feature page with this scenario expanded */
export function scenarioLink(featureId: string, scenarioId: string): string {
    const base = window.location.href.split('#')[0];
    return `${base}#/feature/${encodeURIComponent(featureId)}?scenario=${encodeURIComponent(scenarioId)}`;
}

const isPassedHook = (step: StepType) => step.hookId !== undefined && step.result.status === 'passed';

const RetryBadge = ({ scenario }: { scenario: ScenarioType }) => {
    if (scenario.retries === 0) return null;
    return scenario.isFlaky
        ? <span className={css.flakyBadge} title={`Passed after ${retriesText(scenario.retries)}`}>flaky</span>
        : <span className={css.retryBadge} title={`Reported result of attempt ${scenario.retries + 1}`}>
            {retriesText(scenario.retries)}
        </span>;
};

const ExampleValues = ({ scenario }: { scenario: ScenarioType }) => {
    if (!scenario.examples?.length) return null;
    return <span className={css.exampleValues} title='Examples row'>
        {scenario.examples.map((example, index) => <span key={index} className={css.exampleValue}>
            <span className={css.exampleName}>{example.name}</span>{example.value}
        </span>)}
    </span>;
};

interface TitleProps {
    scenario: ScenarioType;
    featureName?: string;
    featureId?: string;
}

const ScenarioTitle = ({ scenario, featureName, featureId }: TitleProps) => {
    const copy = useCopyToClipboard();
    return <FlexRow columnGap='12' cx={css.scenarioTitle}>
        <span className={css.scenarioName}>
            {featureName && <span className={css.scenarioFeature}>{featureName} ›</span>}
            <span className={css.keyword}>{scenario.keyword ?? 'Scenario'}</span>
            {scenario.name}
        </span>
        <ExampleValues scenario={scenario}/>
        <RetryBadge scenario={scenario}/>
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
        {featureId && <span className={css.scenarioLink} onKeyDown={stopKeyboardPropagation}>
            <IconButton
                icon={LinkIcon}
                onClick={copy(scenarioLink(featureId, scenario.id), 'link to scenario')}
                rawProps={{ title: 'Copy link to scenario', 'aria-label': 'Copy link to scenario' }}
            />
        </span>}
        <TimeLabel time={formatDuration(scenario.duration)}/>
    </FlexRow>;
};

const PreviousAttempt = ({ attempt }: { attempt: AttemptSummary }) => {
    const { uuiModals } = useUuiContext();
    const error = attempt.error;
    return <li className={css.attempt}>
        <div className={css.attemptHeader}>
            <span className={css.attemptNumber}>Attempt {attempt.attempt + 1}</span>
            <span className={css[`text-${attempt.status}`]}>{attempt.status}</span>
            {attempt.step && <span className={css.attemptStep}>at <b>{attempt.step}</b></span>}
            <span className={css.muted}>{formatDuration(attempt.duration)}</span>
        </div>
        {error && <ErrorPreview
            error={error}
            lines={ERROR_PREVIEW_LINES}
            onOpen={() => showModal(uuiModals, props => <ErrorModal {...props} error={error}/>)}
        />}
    </li>;
};

const PreviousAttempts = ({ attempts }: { attempts?: AttemptSummary[] }) => {
    if (!attempts?.length) return null;
    return <section className={css.attempts} aria-label='Previous attempts'>
        <h3 className={css.attemptsTitle}>Previous attempts</h3>
        <ul>{attempts.map(attempt => <PreviousAttempt key={attempt.attempt} attempt={attempt}/>)}</ul>
    </section>;
};

interface Props {
    scenario: ScenarioType;
    /** initial expanded state; remount (change key) to apply a new value */
    defaultOpen?: boolean;
    /** shown before scenario name when scenarios of different features are listed together */
    featureName?: string;
    /** enables "copy link to scenario" */
    featureId?: string;
    /** hide Before / After hooks that passed */
    hidePassedHooks?: boolean;
    /** scroll to the scenario and highlight it (deep link target) */
    highlight?: boolean;
}

export const Scenario = ({ scenario, defaultOpen = false, featureName, featureId, hidePassedHooks = false, highlight = false }: Props) => {
    const [isOpen, setIsOpen] = useState(defaultOpen || highlight);
    // open when the scenario becomes a deep link target without remounting (link opened in the same tab)
    const [wasHighlighted, setWasHighlighted] = useState(highlight);
    if (highlight !== wasHighlighted) {
        setWasHighlighted(highlight);
        if (highlight) setIsOpen(true);
    }
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (highlight) ref.current?.scrollIntoView?.({ block: 'start' });
    }, [highlight]);

    const steps = hidePassedHooks ? scenario.steps.filter(step => !isPassedHook(step)) : scenario.steps;
    const hiddenHooks = scenario.steps.length - steps.length;

    return <div
        ref={ref}
        id={`scenario-${scenario.id}`}
        className={[
            css.scenario,
            css[`scenario-${scenario.isFailed ? 'failed' : scenario.outcome}`],
            highlight && css.scenarioHighlight
        ].filter(Boolean).join(' ')}
    >
        <Accordion
            renderTitle={() => <ScenarioTitle scenario={scenario} featureName={featureName} featureId={featureId}/>}
            mode='block'
            value={isOpen}
            onValueChange={setIsOpen}
        >
            <PreviousAttempts attempts={scenario.previousAttempts}/>
            <div className={css.steps}>
                {steps.map(step => <Step key={step.id} step={step}/>)}
            </div>
            {hiddenHooks > 0 && <div className={css.hiddenHooks}>
                {hiddenHooks} passed hook{hiddenHooks > 1 ? 's' : ''} hidden
            </div>}
        </Accordion>
    </div>;
};
