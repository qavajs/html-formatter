import { FlexRow } from '@epam/loveship';
import { BaseModal, ModalProps } from './BaseModal';

export const ErrorModal = ({ error, ...modal }: ModalProps & { error: string }) =>
    <BaseModal modal={modal} title='Error'>
        <FlexRow padding='24'>
            <pre className='errorModalPre'>{error}</pre>
        </FlexRow>
    </BaseModal>;
