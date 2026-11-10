import { ReactNode } from 'react';
import { FlexRow, FlexSpacer, LinkButton, Switch, TextInput } from '@epam/loveship';
import { ActiveTagFilter } from './TagList';
import { useShowPassedHooks } from '../hooks/useFilterParams';
import css from '../App.module.scss';

/** "Expand all" renders every step of every listed scenario, so it is offered only up to this many scenarios */
export const EXPAND_ALL_LIMIT = 200;

interface Props {
    search: string;
    onSearchChange: (value?: string) => void;
    showOnlyFailed?: boolean;
    onShowOnlyFailedChange?: (value: boolean) => void;
    /** number of listed scenarios, used to limit "Expand all" */
    scenarioCount: number;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    /** additional controls rendered before "Show Only Failed" */
    children?: ReactNode;
}

export const SEARCH_PLACEHOLDER = 'Search names, steps, errors, tags';

export const ScenarioFilters = (props: Props) => {
    const [showPassedHooks, setShowPassedHooks] = useShowPassedHooks();
    const canExpandAll = props.scenarioCount <= EXPAND_ALL_LIMIT;
    return <FlexRow cx={css.filters} columnGap='12'>
        <TextInput cx={css.searchInput} value={props.search} onValueChange={props.onSearchChange} placeholder={SEARCH_PLACEHOLDER}/>
        <ActiveTagFilter/>
        <LinkButton
            cx={css.filterButton}
            caption='Expand all'
            size='30'
            onClick={props.onExpandAll}
            isDisabled={!canExpandAll}
            rawProps={{ title: canExpandAll ? undefined : `Too many scenarios to expand at once (${props.scenarioCount}), narrow down the list with filters` }}
        />
        <LinkButton cx={css.filterButton} caption='Collapse all' size='30' onClick={props.onCollapseAll}/>
        <FlexSpacer/>
        {props.children}
        <Switch label='Show passed hooks' value={showPassedHooks} onValueChange={setShowPassedHooks}/>
        {props.onShowOnlyFailedChange && <Switch
            label='Show Only Failed'
            value={props.showOnlyFailed ?? false}
            onValueChange={props.onShowOnlyFailedChange}
        />}
    </FlexRow>;
};
