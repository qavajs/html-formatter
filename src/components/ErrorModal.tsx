import React from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel
} from '@epam/promo';

export const ErrorModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '90vw', margin: 'auto'}}>
                <Panel background="white">
                    <ModalHeader title="Error" onClose={() => modalProps.success('close')}/>
                        <FlexRow padding='24'>
                            <pre style={{width: '100%', overflow: 'auto', height: '60vh'}}>
                                {modalProps.error}
                            </pre>
                        </FlexRow>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
