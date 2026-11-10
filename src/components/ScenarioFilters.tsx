import { FlexRow, FlexSpacer, Switch, TextInput } from '@epam/loveship';
import css from '../App.module.scss';

interface Props {
    search: string;
    onSearchChange: (value?: string) => void;
    showOnlyFailed?: boolean;
    onShowOnlyFailedChange?: (value: boolean) => void;
}

export const ScenarioFilters = ({ search, onSearchChange, showOnlyFailed, onShowOnlyFailedChange }: Props) =>
    <FlexRow cx={css.filters} columnGap='12'>
        <TextInput cx={css.searchInput} value={search} onValueChange={onSearchChange} placeholder='Search'/>
        <FlexSpacer/>
        {onShowOnlyFailedChange && <Switch label='Show Only Failed' value={showOnlyFailed ?? false} onValueChange={onShowOnlyFailedChange}/>}
    </FlexRow>;
