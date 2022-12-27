import React from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel,
    ScrollBars,
    LinkButton
} from '@epam/promo';
import { openInNewTab } from '../utils/openInNewTab';
import { image, iframe, json, text } from '../utils/supportedMimeTypes';

const OpenInNewTab = (props: any) => <LinkButton
    caption={props.title}
    size='30'
    onClick={openInNewTab(props.embedding.data, props.embedding.mime_type)}
/>
const Attachment = (props: any) => {
    if (image.includes(props.embedding.mime_type)) {
        return <div>
            <OpenInNewTab embedding={props.embedding} title='Open in new tab'/>
            <img
                src={`data:${props.embedding.mime_type};base64,${props.embedding.data}`}
                alt='attachment'
                style={{width: '100%'}}
            />
        </div>
    }
    if (text.includes(props.embedding.mime_type)) {
        return <pre style={{width: '100vw'}}>{props.embedding.data}</pre>
    }
    if (json.includes(props.embedding.mime_type)) {
        const pretty = JSON.stringify(JSON.parse(props.embedding.data), null, 2)
        return <pre style={{width: '100vw'}}>{pretty}</pre>
    }
    if (iframe.includes(props.embedding.mime_type)) {
        return <div style={{width: '90vw', height: '60vh'}}>
            <OpenInNewTab embedding={props.embedding} title='Open in new tab'/>
            <iframe
                style={{width: '100%', height: '95%', border: '1px gray solid'}}
                title='html attachment'
                src={`data:${props.embedding.mime_type};base64,${props.embedding.data}`}
            />
        </div>
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
                            <Attachment embedding={modalProps.embedding}/>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
