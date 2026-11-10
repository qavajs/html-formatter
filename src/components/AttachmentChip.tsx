import type { ReactNode } from 'react';
import { IconContainer } from '@epam/loveship';
import type { Icon } from '@epam/uui-core';
import ExternalIcon from '@epam/assets/icons/common/action-external_link-18.svg?react';
import css from '../App.module.scss';

interface Props {
    icon: Icon;
    label: string;
    /** secondary text, e.g. count or http status */
    meta?: ReactNode;
    tone?: 'passed' | 'failed' | 'warning';
    /** shows that the attachment opens in a new tab instead of a modal */
    external?: boolean;
    title?: string;
    onClick: () => void;
}

export const AttachmentChip = ({ icon, label, meta, tone, external, title, onClick }: Props) =>
    <button
        type='button'
        className={css.attachmentChip}
        onClick={onClick}
        title={title ?? (external ? `Open ${label} in new tab` : `Open ${label}`)}
    >
        <IconContainer icon={icon} cx={css.attachmentChipIcon}/>
        <span className={css.attachmentChipLabel}>{label}</span>
        {meta !== undefined && <span className={[css.attachmentChipMeta, tone && css[`chipTone-${tone}`]].filter(Boolean).join(' ')}>{meta}</span>}
        {external && <IconContainer icon={ExternalIcon} cx={css.attachmentChipIcon}/>}
    </button>;
