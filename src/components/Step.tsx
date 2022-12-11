import React from 'react';
import { Text, IconContainer, IconButton } from '@epam/promo';
import { ErrorModal } from './ErrorModal';
import { ReactComponent as PassedIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as FailedIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { ReactComponent as SkippedIcon } from '@epam/assets/icons/common/navigation-chevron-right_right-24.svg';

import { ReactComponent as ErrorIcon } from '@epam/assets/icons/common/notification-info-fill-24.svg';
import { ReactComponent as AttachmentIcon } from '@epam/assets/icons/common/file-attachment-24.svg';

import css from '../App.module.scss';
import { useUuiContext } from '@epam/uui-core';
import { AttachmentModal } from './AttachmentModal';

const icon = (status: string) => {
    switch (status) {
        case 'passed': return <IconContainer icon={ PassedIcon } color='green' cx={css.icon} onClick={() => null}/>
        case 'failed': return <IconContainer icon={ FailedIcon } color='red' cx={css.icon} onClick={() => null}/>
        case 'skipped': return <IconContainer icon={ SkippedIcon } color='blue' cx={css.icon} onClick={() => null}/>
    }
};

export const Step = ({step}: {step: any}) => {
    const svc = useUuiContext();

    return <div style={{display: 'block'}}>
        <div style={{display: 'inline-flex'}}>
            { icon(step.result.status) }
            <Text fontSize='16'>{`${step.name ?? step.keyword}`}</Text>
            {step.result.status === 'failed' && step.result.error_message && <IconButton
                icon={ ErrorIcon }
                color='red'
                onClick={ () => svc.uuiModals.show((props) => <ErrorModal { ...props } error={step.result.error_message}/>) }
            />}
            {step.embeddings && <IconButton
                icon={ AttachmentIcon }
                onClick={ () => svc.uuiModals.show((props) => <AttachmentModal { ...props } embeddings={step.embeddings}/>) }
            />}
        </div>
    </div>
};
