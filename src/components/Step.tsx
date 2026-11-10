import { Text, IconContainer, IconButton, FlexRow } from '@epam/loveship';
import { FlexSpacer } from '@epam/uui';
import { Icon, IModalContext, useUuiContext } from '@epam/uui-core';
import { showModal } from '../utils/showModal';
import { ErrorModal } from './ErrorModal';
import { ErrorPreview } from './ErrorPreview';
import { AttachmentModal } from './AttachmentModal';
import { ResponseModal, responseSummary, statusColor } from './ResponseModal';
import { AttachmentChip } from './AttachmentChip';
import { LogsModal } from './LogsModal';
import { SlideshowModal } from './SlideshowModal';
import { TimeLabel } from './TimeLabel';
import type { DataTable, Embedding, Step as StepType, StepArgument, StepStatus } from '../types';
import { supportedMimeTypes, image, mimeLabel } from '../utils/supportedMimeTypes';
import { openInNewTab } from '../utils/openInNewTab';
import { formatDuration } from '../utils/format';

import PassedIcon from '@epam/assets/icons/common/notification-done-24.svg?react';
import FailedIcon from '@epam/assets/icons/common/navigation-close-24.svg?react';
import SkippedIcon from '@epam/assets/icons/common/navigation-chevron-right_right-24.svg?react';
import UndefinedIcon from '@epam/assets/icons/common/notification-help-outline-24.svg?react';
import AmbiguousIcon from '@epam/assets/icons/common/empty-24.svg?react';
import PendingIcon from '@epam/assets/icons/common/navigation-more_horiz-24.svg?react';
import ErrorIcon from '@epam/assets/icons/common/notification-info-fill-24.svg?react';
import FileIcon from '@epam/assets/icons/common/file-file-18.svg?react';
import TextFileIcon from '@epam/assets/icons/common/file-file_text-18.svg?react';
import PdfIcon from '@epam/assets/icons/common/file-file_pdf-18.svg?react';
import TableFileIcon from '@epam/assets/icons/common/file-file_table-18.svg?react';
import ArchiveIcon from '@epam/assets/icons/common/file-file_archive-18.svg?react';
import VideoIcon from '@epam/assets/icons/common/file-file_video-18.svg?react';
import ImageIcon from '@epam/assets/icons/common/action-photo-18.svg?react';
import LogsIcon from '@epam/assets/icons/common/editor-list_bullet-18.svg?react';
import HtmlIcon from '@epam/assets/icons/common/content-code-18.svg?react';
import JsonIcon from '@epam/assets/icons/common/content-code_braces-18.svg?react';
import ResponseIcon from '@epam/assets/icons/common/content-link-18.svg?react';

import css from '../App.module.scss';

const logPlainMimeType = 'text/x.cucumber.log+plain';
const responseMimeType = 'text/x.response.json';

const statusIcons: Partial<Record<StepStatus, Icon>> = {
    passed: PassedIcon,
    failed: FailedIcon,
    skipped: SkippedIcon,
    undefined: UndefinedIcon,
    ambiguous: AmbiguousIcon,
    pending: PendingIcon
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
    const icon = statusIcons[status];
    if (!icon) return null;
    return <IconContainer icon={icon} cx={[css.icon, css[`status-${status}`]]} rawProps={{ title: status }}/>;
};

const Table = ({ rows }: { rows: DataTable['rows'] }) => <table className={css.dataTable}>
    <tbody>
        {rows.map((row, rowIndex) => <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell.value}</td>)}
        </tr>)}
    </tbody>
</table>;

const Argument = ({ arg }: { arg: StepArgument }) => {
    if (arg.rows) return <div className={css.stepArgument}><Table rows={arg.rows}/></div>;
    if (arg.content !== undefined) return <div className={css.stepArgument}><pre className={css.docString}>{arg.content}</pre></div>;
    return null;
};

const mimeIcons: Record<string, Icon> = {
    'text/plain': TextFileIcon,
    'text/html': HtmlIcon,
    'application/json': JsonIcon,
    'application/xml': HtmlIcon,
    'text/xml': HtmlIcon,
    'application/pdf': PdfIcon,
    'text/csv': TableFileIcon,
    'application/zip': ArchiveIcon
};

const mimeIcon = (mimeType: string): Icon =>
    mimeIcons[mimeType] ?? (mimeType.startsWith('video/') ? VideoIcon : FileIcon);

const statusTone = { success: 'passed', sun: 'warning', fire: 'failed', night300: undefined } as const;

const ResponseChip = ({ response, onClick }: { response: Embedding, onClick: () => void }) => {
    const summary = responseSummary(response);
    const meta = summary && [summary.method, summary.status].filter(Boolean).join(' ');
    return <AttachmentChip
        icon={ResponseIcon}
        label='Response'
        meta={meta || undefined}
        tone={summary ? statusTone[statusColor(summary.status)] : undefined}
        onClick={onClick}
    />;
};

const handleAttachmentClick = (embedding: Embedding, modals: IModalContext) => {
    if (supportedMimeTypes.includes(embedding.mime_type)) {
        return () => showModal(modals, props => <AttachmentModal {...props} embedding={embedding}/>);
    }
    return openInNewTab(embedding);
};

export const Step = ({ step }: { step: StepType }) => {
    const { uuiModals } = useUuiContext();
    const embeddings = step.embeddings ?? [];
    const logs = embeddings.filter(embedding => embedding.mime_type === logPlainMimeType);
    const responses = embeddings.filter(embedding => embedding.mime_type === responseMimeType);
    const allAttachments = embeddings.filter(embedding => ![logPlainMimeType, responseMimeType].includes(embedding.mime_type));
    const screenshots = allAttachments.filter(embedding => image.includes(embedding.mime_type));
    const attachments = allAttachments.filter(embedding => !image.includes(embedding.mime_type));
    const errorMessage = step.result.error_message;

    const isFailed = step.result.status === 'failed';
    const showError = () => errorMessage && showModal(uuiModals, props => <ErrorModal {...props} error={errorMessage}/>);

    return <div className={[css.step, isFailed && css.stepFailed].filter(Boolean).join(' ')}>
        <FlexRow size='30' columnGap='6'>
            <StatusIcon status={step.result.status}/>
            <Text size='30' fontSize='16' cx={css.stepText}>
                {step.keyword && <span className={css.stepKeyword}>{step.keyword}</span>}
                {step.name && step.name !== step.keyword && <span>{step.name}</span>}
            </Text>
            {isFailed && errorMessage && <IconButton
                icon={ErrorIcon}
                color='fire'
                onClick={showError}
                rawProps={{ title: 'Show error' }}
            />}
            {logs.length > 0 && <AttachmentChip
                icon={LogsIcon}
                label='Logs'
                meta={logs.length > 1 ? logs.length : undefined}
                onClick={() => showModal(uuiModals, props => <LogsModal {...props} logs={logs}/>)}
            />}
            {responses.map((embedding, index) => <ResponseChip
                key={`response-${index}`}
                response={embedding}
                onClick={() => showModal(uuiModals, props => <ResponseModal {...props} response={embedding}/>)}
            />)}
            {screenshots.length > 0 && <AttachmentChip
                icon={ImageIcon}
                label={screenshots.length > 1 ? 'Screenshots' : (screenshots[0].fileName ?? 'Screenshot')}
                meta={screenshots.length > 1 ? screenshots.length : undefined}
                onClick={() => showModal(uuiModals, props => <SlideshowModal {...props} embeddings={screenshots}/>)}
            />}
            {attachments.map((embedding, index) => {
                const type = mimeLabel(embedding.mime_type);
                return <AttachmentChip
                    key={`attachment-${index}`}
                    icon={mimeIcon(embedding.mime_type)}
                    label={embedding.fileName ?? type}
                    meta={embedding.fileName ? type : undefined}
                    external={!supportedMimeTypes.includes(embedding.mime_type)}
                    title={embedding.mime_type}
                    onClick={handleAttachmentClick(embedding, uuiModals)}
                />;
            })}
            <FlexSpacer/>
            <TimeLabel time={formatDuration(step.result.duration)}/>
        </FlexRow>
        {isFailed && errorMessage && <ErrorPreview error={errorMessage} onOpen={() => showError()}/>}
        {step.arguments && <div className={css.stepArguments}>
            {step.arguments.map((arg, index) => <Argument key={index} arg={arg}/>)}
        </div>}
    </div>;
};
