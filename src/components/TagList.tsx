import { Badge, Dropdown, DropdownMenuButton, FlexRow } from '@epam/promo';
import css from '../App.module.scss';
import clipboard from '../utils/clipboard';
import { DropdownBodyProps } from '@epam/uui-core';
import { DropdownContainer } from '@epam/uui';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';

const renderDropdownBody = (tags: Array<{ name: string }>) => {
    return (props: DropdownBodyProps) => (
        <DropdownContainer { ...props } width="auto">
            {tags.map((tag, index) => (
                <DropdownMenuButton
                    key={index}
                    caption={tag.name }
                    onClick={clipboard(tag.name)}
                />
            ))}
        </DropdownContainer>
    );
};
function renderTags(tags: Array<{ name: string }>, itemsToRender: number) {
    const visibleTags = tags.slice(0, itemsToRender);
    const restTags = tags.slice(itemsToRender);
    return <>
        {visibleTags.map((tag: any, index: number) => <Badge
            cx={css.tagBadge}
            size='18'
            color='blue'
            fill='semitransparent'
            caption={tag.name}
            key={index}
            onClick={clipboard(tag.name)}
        />)}
        {restTags.length > 0 && <Dropdown
            renderBody={ renderDropdownBody(restTags) }
            renderTarget={ (props) => (
                <Badge
                    { ...props }
                    dropdownIcon={ navigationDownIcon }
                    cx={css.tagBadge}
                    size='18'
                    color='blue'
                    fill='semitransparent'
                    caption='Other'
                />
            ) }
            placement='auto'
            openOnHover={true}
            openOnClick={false}
            closeOnMouseLeave='boundary'
        />}
    </>
}
export const TagList = ({ tags, itemsToRender = 5 }: { tags: Array<{ name: string }>, itemsToRender: number }) => {
    return <FlexRow>{renderTags(tags, itemsToRender)}</FlexRow>
}
