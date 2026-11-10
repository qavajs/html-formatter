import type { SyntheticEvent } from 'react';
import { Dropdown, DropdownMenuButton, IconButton } from '@epam/loveship';
import { DropdownBodyProps } from '@epam/uui-core';
import { DropdownContainer } from '@epam/uui';
import CopyIcon from '@epam/assets/icons/common/action-copy_content-12.svg?react';
import CloseIcon from '@epam/assets/icons/common/navigation-close-12.svg?react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useTagFilter } from '../hooks/useFilterParams';
import type { Tag } from '../types';
import { stopKeyboardPropagation } from '../utils/events';
import css from '../App.module.scss';

const uniqueNames = (tags: Tag[]) => [...new Set(tags.map(tag => tag.name))];

/** Clicking a tag filters the current page by it (tags are rendered inside accordion headers and table rows) */
export const TagList = ({ tags, itemsToRender = 5 }: { tags: Tag[], itemsToRender?: number }) => {
    const { tag: activeTag, setTag } = useTagFilter();
    const names = uniqueNames(tags);
    if (names.length === 0) return null;

    const visibleTags = names.slice(0, itemsToRender);
    const restTags = names.slice(itemsToRender);
    const filterBy = (name: string) => (event?: SyntheticEvent) => {
        event?.stopPropagation();
        setTag(name === activeTag ? undefined : name);
    };

    return <span className={css.tagList}>
        {visibleTags.map(name => <button
            type='button'
            key={name}
            className={[css.tag, name === activeTag && css.tagActive].filter(Boolean).join(' ')}
            onClick={filterBy(name)}
            onKeyDown={stopKeyboardPropagation}
            title={name === activeTag ? `Clear ${name} filter` : `Filter by ${name}`}
            aria-pressed={name === activeTag}
        >{name}</button>)}
        {restTags.length > 0 && <Dropdown
            renderBody={(props: DropdownBodyProps) => <DropdownContainer {...props} width='auto'>
                {restTags.map(name => <DropdownMenuButton key={name} caption={name} onClick={filterBy(name)} isActive={name === activeTag}/>)}
            </DropdownContainer>}
            renderTarget={props => <button
                type='button'
                ref={props.ref}
                className={[css.tag, css.tagMore].join(' ')}
                onClick={event => {
                    event.stopPropagation();
                    props.onClick?.(event);
                }}
                onKeyDown={stopKeyboardPropagation}
                aria-expanded={props.isOpen}
                title={restTags.join(', ')}
            >+{restTags.length}</button>}
            openOnHover={true}
            openOnClick={true}
            closeOnMouseLeave='boundary'
        />}
    </span>;
};

/** Active tag filter shown in the filter bar: copy tag name or clear the filter */
export const ActiveTagFilter = () => {
    const { tag, setTag } = useTagFilter();
    const copy = useCopyToClipboard();
    if (!tag) return null;
    return <span className={css.activeTag} data-testid='active-tag'>
        <span className={css.activeTagLabel}>Tag</span>
        <span className={css.activeTagName}>{tag}</span>
        <IconButton icon={CopyIcon} size='18' onClick={copy(tag)} rawProps={{ title: `Copy ${tag}`, 'aria-label': `Copy ${tag}` }}/>
        <IconButton icon={CloseIcon} size='18' onClick={() => setTag(undefined)} rawProps={{ title: 'Clear tag filter', 'aria-label': 'Clear tag filter' }}/>
    </span>;
};
