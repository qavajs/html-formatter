import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel
} from '@epam/loveship';

export const ErrorModal = (modalProps: any) => {
    return <>
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow width={900} style={{margin: 'auto'}}>
                <Panel>
                    <ModalHeader title="Error" onClose={() => modalProps.success('close')}/>
                        <FlexRow padding='24'>
                            <pre className='errorModalPre'>
                                {modalProps.error}
                            </pre>
                        </FlexRow>
                    <ModalFooter/>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    </>
}
