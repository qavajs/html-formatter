import React from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel,
    ScrollBars
} from '@epam/promo';

export const ErrorModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '100%', margin: 'auto'}}>
                <Panel background="white">
                    <ModalHeader title="Error" onClose={() => modalProps.success('close')}/>
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding='24'>
                            <pre style={{width: '100%'}}>
                                {modalProps.error}
                            </pre>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
