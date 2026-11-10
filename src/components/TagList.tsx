import { Dropdown, DropdownMenuButton } from '@epam/loveship';
import { DropdownBodyProps } from '@epam/uui-core';
import { DropdownContainer } from '@epam/uui';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import type { Tag } from '../types';
import css from '../App.module.scss';

const uniqueNames = (tags: Tag[]) => [...new Set(tags.map(tag => tag.name))];

export const TagList = ({ tags, itemsToRender = 5 }: { tags: Tag[], itemsToRender?: number }) => {
    const copy = useCopyToClipboard();
    const names = uniqueNames(tags);
    if (names.length === 0) return null;

    const visibleTags = names.slice(0, itemsToRender);
    const restTags = names.slice(itemsToRender);

    return <span className={css.tagList}>
        {visibleTags.map(name => <button
            type='button'
            key={name}
            className={css.tag}
            onClick={copy(name)}
            title={`Copy ${name}`}
        >{name}</button>)}
        {restTags.length > 0 && <Dropdown
            renderBody={(props: DropdownBodyProps) => <DropdownContainer {...props} width='auto'>
                {restTags.map(name => <DropdownMenuButton key={name} caption={name} onClick={copy(name)}/>)}
            </DropdownContainer>}
            renderTarget={props => <button
                type='button'
                ref={props.ref}
                className={[css.tag, css.tagMore].join(' ')}
                onClick={event => {
                    event.stopPropagation();
                    props.onClick?.(event);
                }}
                aria-expanded={props.isOpen}
                title={restTags.join(', ')}
            >+{restTags.length}</button>}
            openOnHover={true}
            openOnClick={true}
            closeOnMouseLeave='boundary'
        />}
    </span>;
};
