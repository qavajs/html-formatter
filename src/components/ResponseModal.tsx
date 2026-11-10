import { useState } from 'react';
import { FlexRow, Badge, Text, TextInput, TextArea, FlexCell, TabButton } from '@epam/loveship';
import { BaseModal, ModalProps } from './BaseModal';
import type { Embedding } from '../types';
import { decodeBase64, embeddingAsText, tryParseJson } from '../utils/encoding';
import css from '../App.module.scss';

interface HttpMessage {
    body?: string;
    headers?: Record<string, string>;
}

interface ApiData {
    request: HttpMessage & { method?: string; url?: string };
    response: HttpMessage & { status?: number | string };
}

type BodyView = 'Base64' | 'Text';

const noop = () => {};

function formatHeaders(headers: Record<string, string> = {}): string {
    return Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n');
}

function decodeBody(body: string): string {
    try {
        return decodeBase64(body);
    } catch {
        return body;
    }
}

export function statusColor(status?: number | string): 'success' | 'sun' | 'fire' | 'night300' {
    const code = Number(status);
    if (!Number.isFinite(code)) return 'night300';
    if (code >= 500) return 'fire';
    if (code >= 400) return 'sun';
    return 'success';
}

/** Short "METHOD status" summary of a response attachment, undefined if it cannot be parsed */
export function responseSummary(response: Embedding): { method?: string, status?: number | string } | undefined {
    const parsed = tryParseJson<ApiData>(embeddingAsText(response));
    if (!parsed.ok || !parsed.value?.request || !parsed.value?.response) return undefined;
    return { method: parsed.value.request.method, status: parsed.value.response.status };
}

const Body = ({ caption, body = '' }: { caption: string, body?: string }) => {
    const [view, setView] = useState<BodyView>('Base64');
    return <>
        <FlexRow padding='24' vPadding='18'>
            <Text>{caption}</Text>
            {(['Base64', 'Text'] as BodyView[]).map(option => <TabButton
                key={option}
                caption={option}
                isLinkActive={view === option}
                onClick={() => setView(option)}
                size='36'
            />)}
        </FlexRow>
        <FlexRow padding='24' vPadding='18'>
            <TextArea cx={css.responseTextArea} rows={8} value={view === 'Text' ? decodeBody(body) : body} onValueChange={noop}/>
        </FlexRow>
    </>;
};

const Headers = ({ caption, headers }: { caption: string, headers?: Record<string, string> }) => <>
    <FlexRow padding='24' vPadding='18'>
        <Text>{caption}</Text>
    </FlexRow>
    <FlexRow padding='24' vPadding='18'>
        <TextArea cx={css.responseTextArea} rows={8} value={formatHeaders(headers)} onValueChange={noop}/>
    </FlexRow>
</>;

const ResponseContent = ({ response }: { response: Embedding }) => {
    const raw = embeddingAsText(response);
    const parsed = tryParseJson<ApiData>(raw);
    if (!parsed.ok || !parsed.value?.request || !parsed.value?.response) {
        return <FlexRow padding='24'>
            <div>
                <div className={css.attachmentWarning}>
                    Cannot parse response attachment{parsed.ok ? '' : `: ${parsed.error}`}
                </div>
                <pre className='errorModalPre'>{raw}</pre>
            </div>
        </FlexRow>;
    }
    const { request, response: apiResponse } = parsed.value;
    return <>
        <FlexRow padding='24'>
            <FlexRow columnGap='18'>
                <TextInput cx={css.responseUrlInput} value={request.url} onValueChange={noop} isReadonly/>
                <Badge size='36' color={statusColor(apiResponse.status)} fill='outline' caption={`${request.method}: ${apiResponse.status}`}/>
            </FlexRow>
        </FlexRow>
        <FlexRow padding='24' vPadding='18'>
            <FlexCell width='100%'>
                <Body caption='Request body:' body={request.body}/>
                <Headers caption='Request headers:' headers={request.headers}/>
            </FlexCell>
            <FlexCell width='100%'>
                <Body caption='Response body:' body={apiResponse.body}/>
                <Headers caption='Response headers:' headers={apiResponse.headers}/>
            </FlexCell>
        </FlexRow>
    </>;
};

export const ResponseModal = ({ response, ...modal }: ModalProps & { response: Embedding }) =>
    <BaseModal modal={modal} title='Response'>
        <ResponseContent response={response}/>
    </BaseModal>;
