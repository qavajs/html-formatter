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

export const AttachmentModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '90%', margin: 'auto'}}>
                <Panel background="white">
                    <ModalHeader title="Attachment" onClose={() => modalProps.success('close')}/>
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding='24'>
                            <img
                                src={`data:${modalProps.embeddings[0].mime_type};base64,${modalProps.embeddings[0].data}`}
                                alt='attachment'
                                style={{width: '100%'}}
                            />
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
