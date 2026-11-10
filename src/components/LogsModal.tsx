import { useMemo } from 'react';
import { ModalProps } from './BaseModal';
import { AttachmentModal } from './AttachmentModal';
import type { Embedding } from '../types';
import { embeddingAsText } from '../utils/encoding';

/** All log attachments of a step joined into one text file, shown with the same toolbar (copy, wrap, download) as text attachments */
export const LogsModal = ({ logs, ...modal }: ModalProps & { logs: Embedding[] }) => {
    const embedding = useMemo<Embedding>(() => ({
        data: logs.map(embeddingAsText).join('\n'),
        mime_type: 'text/plain',
        contentEncoding: 'IDENTITY',
        fileName: 'logs.txt'
    }), [logs]);
    return <AttachmentModal {...modal} embedding={embedding} title='Logs'/>;
};
