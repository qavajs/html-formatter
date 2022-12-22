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

const Attachment = (props: any) => {
    if (props.embedding.mime_type === 'image/png') {
        return <img
            src={`data:${props.embedding.mime_type};base64,${props.embedding.data}`}
            alt='attachment'
            style={{width: '100%'}}
        />
    }
    if (props.embedding.mime_type === 'text/plain') {
        return <pre style={{width: '100vw'}}>{props.embedding.data}</pre>
    }
    return <span style={{width: '100vw'}}>Cannot render {props.embedding.mime_type}</span>
}

export const AttachmentModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '90%', margin: 'auto'}}>
                <Panel background="white">
                    <ModalHeader title="Attachment" onClose={() => modalProps.success('close')}/>
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding='24'>
                            <Attachment embedding={modalProps.embeddings[0]}/>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
