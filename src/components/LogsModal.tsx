import React from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel
} from '@epam/promo';

export const LogsModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow style={{width: '90vw', margin: 'auto', height: '60vh'}}>
                <Panel background="white">
                    <ModalHeader title="Logs" onClose={() => modalProps.success('close')}/>
                        <FlexRow padding='24'>
                            <pre style={{width: '100%', overflow: 'auto'}}>
                                {modalProps.logs.map((log: any, index: number) => <div key={index}>{log.data}</div>)}
                            </pre>
                        </FlexRow>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
