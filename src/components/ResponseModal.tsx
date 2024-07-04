import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel,
    Badge,
    Text, TextInput, TextArea, FlexCell, TabButton
} from '@epam/loveship';

import css from '../App.module.scss';
import { useState } from 'react';

export const ResponseModal = (modalProps: any) => {
    const apiData = JSON.parse(modalProps.response.body);
    const [requestBodyType, onRequestBodyTypeChange] = useState('Base64');
    const [responseBodyType, onResponseBodyTypeChange] = useState('Base64');
    const [requestBody, updateRequestBody] = useState(apiData.request.body);
    const [responseBody, updateResponseBody] = useState(apiData.response.body);
    const requestHeaders = Object.entries(apiData.request.headers).map(([key, value]) => `${key}: ${value}`).join('\n');
    const responseHeaders = Object.entries(apiData.response.headers).map(([key, value]) => `${key}: ${value}`).join('\n');
    const statusText = apiData.request.method + ': ' + apiData.response.status;
    return <>
        <ModalBlocker blockerShadow="dark" {...modalProps}>
            <ModalWindow width={900}>
                <Panel cx={css.responseModal}>
                    <ModalHeader title="Response" onClose={() => modalProps.success('close')} />
                    <FlexRow padding="24">
                        <FlexRow columnGap="18" key="02">
                            <TextInput cx={css.responseUrlInput} value={apiData.request.url} onValueChange={() => {}} />
                            <Badge size="36" color="success" fill="outline" caption={statusText} />
                            {/*<Badge size="36" color="success" fill="outline" caption={apiData.response.status} />*/}
                        </FlexRow>
                    </FlexRow>
                    <FlexRow padding="24" vPadding="18">
                        <FlexCell width="100%">
                            <FlexRow padding="24" vPadding="18">
                                <Text>Request body:</Text>
                                    <TabButton caption="Base64" isLinkActive={ requestBodyType === 'Base64' } onClick={ () => { onRequestBodyTypeChange('Base64'); updateRequestBody(apiData.request.body) } } size="36" />
                                    <TabButton caption="Text" isLinkActive={ requestBodyType === 'Text' } onClick={ () => { onRequestBodyTypeChange('Text'); updateRequestBody(atob(apiData.request.body).toString()) } } size="36" />
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <TextArea cx={css.responseTextArea} rows={8} value={requestBody}
                                          onValueChange={() => {}} />
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <Text>Request headers:</Text>
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <TextArea cx={css.responseTextArea} rows={8} value={requestHeaders}
                                          onValueChange={() => {}} />
                            </FlexRow>
                        </FlexCell>
                        <FlexCell width="100%">
                            <FlexRow padding="24" vPadding="18">
                                <Text>Response body:</Text>
                                <FlexRow>
                                    <TabButton caption="Base64" isLinkActive={ responseBodyType === 'Base64' } onClick={ () => { onResponseBodyTypeChange('Base64'); updateResponseBody(apiData.response.body) } } size="36" />
                                    <TabButton caption="Text" isLinkActive={ responseBodyType === 'Text' } onClick={ () => { onResponseBodyTypeChange('Text'); updateResponseBody(atob(apiData.response.body).toString()) } } size="36" />
                                </FlexRow>
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <TextArea cx={css.responseTextArea} rows={8} value={responseBody}
                                          onValueChange={() => {}} />
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <Text>Response headers:</Text>
                            </FlexRow>
                            <FlexRow padding="24" vPadding="18">
                                <TextArea cx={css.responseTextArea} rows={8} value={responseHeaders}
                                          onValueChange={() => {}} />
                            </FlexRow>
                        </FlexCell>
                    </FlexRow>
                    <ModalFooter />
                </Panel>

            </ModalWindow>
        </ModalBlocker>
    </>;
};
