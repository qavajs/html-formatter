import React from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    FlexSpacer,
    Panel,
    ScrollBars,
    Text,
    Button
} from '@epam/promo';

export const ErrorModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '60%', margin: 'auto'}}>
                <Panel background="white">
                    <ModalHeader title="Error" onClose={() => modalProps.success('close')}/>
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding='24'>
                            <Text size='36'>{modalProps.error}</Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
