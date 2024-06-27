import {Text, IconContainer, IconButton, LinkButton, FlexRow} from '@epam/loveship';
import { ErrorModal } from './ErrorModal';
import { ReactComponent as PassedIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as FailedIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { ReactComponent as SkippedIcon } from '@epam/assets/icons/common/navigation-chevron-right_right-24.svg';
import { ReactComponent as UndefinedIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { ReactComponent as AmbiguousIcon } from '@epam/assets/icons/common/empty-24.svg';
import { ReactComponent as PendingIcon } from '@epam/assets/icons/common/navigation-more_horiz-24.svg';
import { ReactComponent as ErrorIcon } from '@epam/assets/icons/common/notification-info-fill-24.svg';
import { ReactComponent as AttachmentIcon } from '@epam/assets/icons/common/file-attachment-24.svg';
import { ReactComponent as LogsIcon } from '@epam/assets/icons/common/content-code-24.svg';

import css from '../App.module.scss';
import { useUuiContext } from '@epam/uui-core';
import { AttachmentModal } from './AttachmentModal';
import { supportedMimeTypes } from '../utils/supportedMimeTypes';
import { openInNewTab } from '../utils/openInNewTab';
import { LogsModal } from './LogsModal';
import { TimeLabel } from './TimeLabel';
import { FlexSpacer } from '@epam/uui';

const icon = (status: string) => {
    switch (status) {
        case 'passed': return <IconContainer icon={ PassedIcon } style={{fill: 'lightgreen'}} cx={css.icon} onClick={() => null}/>
        case 'failed': return <IconContainer icon={ FailedIcon } style={{fill: 'coral'}} cx={css.icon} onClick={() => null}/>
        case 'skipped': return <IconContainer icon={ SkippedIcon } style={{fill: 'lightblue'}} cx={css.icon} onClick={() => null}/>
        case 'undefined': return <IconContainer icon={ UndefinedIcon } style={{fill: 'khaki'}} cx={css.icon} onClick={() => null}/>
        case 'ambiguous': return <IconContainer icon={ AmbiguousIcon } style={{fill: 'orange'}} cx={css.icon} onClick={() => null}/>
        case 'pending': return <IconContainer icon={ PendingIcon } style={{fill: 'lightgrey'}} cx={css.icon} onClick={() => null}/>
    }
};

const Table = (props: any) => {
    const cellStyle = {
        borderRight: 'solid gray 1px',
        paddingLeft: '6px',
        paddingRight: '6px'
    }
    const firstCellStyle = {
        ...cellStyle,
        borderLeft: 'solid gray 1px',
    }
    return <table>
        <tbody>
            {props.rows.map((row: any, index: number) => <tr key={index}>
                {row.cells.map((cell: any, index: number) => <td style={index ? cellStyle : firstCellStyle} key={index}>
                    <Text fontSize='14'>{cell.value}</Text>
                </td>)}
            </tr>)}
        </tbody>
    </table>
}

const Argument = (props: any) => {
    let argument;
    if (props.arg.rows) argument = <Table rows={props.arg.rows}/>
    if (props.arg.content) argument = <pre>{`"""\n${props.arg.content}\n"""`}</pre>
    return <div style={{marginLeft: '24px'}}>{argument}</div>
}

const handleAttachmentClick = (embedding: any, svc: any) => {
    if (supportedMimeTypes.includes(embedding.mime_type)) {
        return () => svc.uuiModals.show((props: any) => <AttachmentModal { ...props } embedding={embedding}/>)
    }
    return openInNewTab(embedding.data, embedding.mime_type)
}

const handleLogsClick = (logs: any[], svc: any) => {
    return () => svc.uuiModals.show((props: any) => <LogsModal { ...props } logs={logs}/>)
}

export const Step = ({step}: {step: any}) => {
    const svc = useUuiContext();
    const logs = step.embeddings
        ? step.embeddings.filter((embedding: any) => embedding.mime_type === 'text/x.cucumber.log+plain')
        : [];
    return <div>
        <FlexRow>
            {icon(step.result.status)}
            <Text fontSize='16' cx={css.stepText}>{`${step.name ?? step.keyword}`}</Text>
            {step.result.status === 'failed' && step.result.error_message && <IconButton
                icon={ ErrorIcon }
                color='fire'
                onClick={ () => svc.uuiModals.show((props) => <ErrorModal { ...props } error={step.result.error_message}/>) }
            />}
            {logs.length > 0 && <LinkButton
                icon={ LogsIcon }
                caption='Logs'
                onClick={ handleLogsClick(logs, svc) }
            />}
            {step.embeddings && step.embeddings
                .filter((embedding: any) => embedding.mime_type !== 'text/x.cucumber.log+plain')
                .map((embedding: any, index: any) => <LinkButton
                    key={index}
                    icon={ AttachmentIcon }
                    caption={ embedding.fileName ?? embedding.mime_type }
                    onClick={ handleAttachmentClick(embedding, svc) }
                />)
            }
            <FlexSpacer/>
            <TimeLabel time={`${(step.result.duration / 1_000_000_000).toFixed(2)}s`}/>
        </FlexRow>
        <div style={{display: 'flex'}}>
            {step.arguments && step.arguments.map((arg: any, index: number) => <Argument key={index} arg={arg}/>)}
        </div>
    </div>
};
