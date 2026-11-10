import { useMemo } from 'react';
import { ModalProps } from './BaseModal';
import { AttachmentModal } from './AttachmentModal';
import type { Embedding } from '../types';
import { stripAnsi } from '../report';

/** Full error shown with the same viewer and toolbar (wrap, copy, download) as text attachments; ansi colors are removed */
export const ErrorModal = ({ error, ...modal }: ModalProps & { error: string }) => {
    const embedding = useMemo<Embedding>(() => ({
        data: stripAnsi(error),
        mime_type: 'text/plain',
        contentEncoding: 'IDENTITY',
        fileName: 'error.txt'
    }), [error]);
    return <AttachmentModal {...modal} embedding={embedding} title='Error'/>;
};
