import { FlexRow } from '@epam/loveship';
import { BaseModal, ModalProps } from './BaseModal';
import type { Embedding } from '../types';
import { embeddingAsText } from '../utils/encoding';

export const LogsModal = ({ logs, ...modal }: ModalProps & { logs: Embedding[] }) =>
    <BaseModal modal={modal} title='Logs'>
        <FlexRow padding='24'>
            <pre className='errorModalPre'>
                {logs.map((log, index) => <div key={index}>{embeddingAsText(log)}</div>)}
            </pre>
        </FlexRow>
    </BaseModal>;
