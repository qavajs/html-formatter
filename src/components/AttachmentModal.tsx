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

const OpenInNewTab = (props: any) => <LinkButton
    caption='Open in new tab'
    size='30'
    onClick={async () => {
        const f = await fetch(`data:${props.embedding.mime_type};base64,${props.embedding.data}`);
        const blob = await f.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }}
/>
const Attachment = (props: any) => {
    if (props.embedding.mime_type === 'image/png') {
        return <div>
            <OpenInNewTab embedding={props.embedding}/>
            <img
                src={`data:${props.embedding.mime_type};base64,${props.embedding.data}`}
                alt='attachment'
                style={{width: '100%'}}
            />
        </div>
    }
    if (props.embedding.mime_type === 'text/plain') {
        return <pre style={{width: '100vw'}}>{props.embedding.data}</pre>
    }
    if (props.embedding.mime_type === 'application/json') {
        const pretty = JSON.stringify(JSON.parse(props.embedding.data), null, 2)
        return <pre style={{width: '100vw'}}>{pretty}</pre>
    }
    if (props.embedding.mime_type === 'text/html') {
        return <div style={{width: '90vw', height: '60vh'}}>
            <OpenInNewTab embedding={props.embedding}/>
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
                            <Attachment embedding={modalProps.embeddings[0]}/>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
