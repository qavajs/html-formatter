import { LinkButton } from '@epam/loveship';
import CopyIcon from '@epam/assets/icons/common/action-copy_content-18.svg?react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { stripAnsi } from '../report';
import css from '../App.module.scss';

interface Props {
    error: string;
    /** opens full error */
    onOpen: () => void;
    lines?: number;
}

/** First lines of an error; click opens the full error, "Copy" (same as in attachment toolbar) copies all of it without ansi colors */
export const ErrorPreview = ({ error, onOpen, lines = 4 }: Props) => {
    const copy = useCopyToClipboard();
    return <div className={css.errorPreview}>
        <button type='button' className={css.stepError} onClick={onOpen} title='Show full error'>
            {error.split('\n').slice(0, lines).join('\n')}
        </button>
        <LinkButton
            cx={css.errorCopy}
            caption='Copy'
            icon={CopyIcon}
            size='24'
            onClick={copy(stripAnsi(error), 'error')}
            rawProps={{ 'aria-label': 'Copy error' }}
        />
    </div>;
};
