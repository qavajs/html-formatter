import { useMemo, useState } from 'react';
import { FlexRow, FlexSpacer, IconContainer, LinkButton, Switch } from '@epam/loveship';
import type { Icon } from '@epam/uui-core';
import CopyIcon from '@epam/assets/icons/common/action-copy_content-18.svg?react';
import DownloadIcon from '@epam/assets/icons/common/file-download-18.svg?react';
import ExternalIcon from '@epam/assets/icons/common/action-external_link-18.svg?react';
import FileIcon from '@epam/assets/icons/common/file-file-24.svg?react';
import ImageIcon from '@epam/assets/icons/common/file-file_image-24.svg?react';
import TextIcon from '@epam/assets/icons/common/file-file_text-24.svg?react';
import UnsupportedIcon from '@epam/assets/icons/common/file-file-36.svg?react';
import { BaseModal, ModalProps } from './BaseModal';
import { downloadEmbedding, openInNewTab } from '../utils/openInNewTab';
import { image, iframe, json, mimeLabel, text } from '../utils/supportedMimeTypes';
import { embeddingAsBytes, embeddingAsText, embeddingDataUrl, tryParseJson } from '../utils/encoding';
import { formatBytes } from '../utils/format';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import type { Embedding } from '../types';
import css from '../App.module.scss';

type Kind = 'image' | 'text' | 'json' | 'html' | 'unsupported';

function attachmentKind(mimeType: string): Kind {
    if (image.includes(mimeType)) return 'image';
    if (text.includes(mimeType)) return 'text';
    if (json.includes(mimeType)) return 'json';
    if (iframe.includes(mimeType)) return 'html';
    return 'unsupported';
}

const kindIcons: Record<Kind, Icon> = {
    image: ImageIcon,
    text: TextIcon,
    json: TextIcon,
    html: TextIcon,
    unsupported: FileIcon
};

/** Text shown in the code view and copied to the clipboard; JSON is pretty printed when valid */
function textContent(embedding: Embedding, kind: Kind): { content: string, error?: string } | undefined {
    if (kind !== 'text' && kind !== 'json') return undefined;
    const raw = embeddingAsText(embedding);
    if (kind === 'text') return { content: raw };
    const parsed = tryParseJson(raw);
    return parsed.ok
        ? { content: JSON.stringify(parsed.value, null, 2) }
        : { content: raw, error: parsed.error };
}

const plural = (count: number, word: string) => `${count.toLocaleString()} ${word}${count === 1 ? '' : 's'}`;

/** Image on a checkerboard backdrop; click toggles between fit-to-window and actual size */
export const ImageAttachment = ({ embedding, onDimensions }: { embedding: Embedding, onDimensions?: (value: string) => void }) => {
    const [actualSize, setActualSize] = useState(false);
    return <div className={`${css.attachmentImageFrame} ${actualSize ? css.attachmentImageActual : ''}`}>
        <img
            className={css.attachmentImage}
            src={embeddingDataUrl(embedding)}
            alt={embedding.fileName ?? 'attachment'}
            title={actualSize ? 'Click to fit to window' : 'Click to view actual size'}
            onClick={() => setActualSize(value => !value)}
            onLoad={event => onDimensions?.(`${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight}`)}
        />
    </div>;
};

const Unsupported = ({ embedding }: { embedding: Embedding }) =>
    <div className={css.attachmentEmpty}>
        <IconContainer icon={UnsupportedIcon} cx={css.attachmentEmptyIcon}/>
        <div className={css.attachmentEmptyTitle}>Preview is not available</div>
        <div className={css.attachmentEmptyText}>{embedding.mime_type} attachments cannot be rendered in the report</div>
        <LinkButton caption='Download file' icon={DownloadIcon} size='30' onClick={downloadEmbedding(embedding)}/>
    </div>;

export const AttachmentModal = ({ embedding, ...modal }: ModalProps & { embedding: Embedding }) => {
    const kind = attachmentKind(embedding.mime_type);
    const label = mimeLabel(embedding.mime_type);
    const size = useMemo(() => embeddingAsBytes(embedding).byteLength, [embedding]);
    const textView = useMemo(() => textContent(embedding, kind), [embedding, kind]);
    const [dimensions, setDimensions] = useState<string>();
    const [wrap, setWrap] = useState(true);
    const copy = useCopyToClipboard();

    const details = [
        formatBytes(size),
        dimensions,
        textView && plural(textView.content.split('\n').length, 'line')
    ].filter(Boolean);

    return <BaseModal modal={modal} title={embedding.fileName ?? `${label} attachment`} width={1200}>
        <div className={css.attachmentModal}>
            <FlexRow cx={css.attachmentToolbar} columnGap='12'>
                <IconContainer icon={kindIcons[kind]} cx={css.attachmentToolbarIcon}/>
                <span className={css.attachmentType}>{label}</span>
                {details.map(detail => <span key={detail} className={css.attachmentDetail}>{detail}</span>)}
                <FlexSpacer/>
                {textView && <Switch label='Wrap lines' size='12' value={wrap} onValueChange={setWrap}/>}
                {textView && <LinkButton
                    caption='Copy'
                    icon={CopyIcon}
                    size='30'
                    onClick={copy(textView.content, `${label} content`)}
                />}
                <LinkButton caption='Download' icon={DownloadIcon} size='30' onClick={downloadEmbedding(embedding)}/>
                {kind !== 'unsupported' && <LinkButton caption='Open in new tab' icon={ExternalIcon} size='30' onClick={openInNewTab(embedding)}/>}
            </FlexRow>
            {textView?.error && <div className={css.attachmentWarning} role='alert'>Invalid JSON: {textView.error}</div>}
            {textView && <pre className={`errorModalPre ${css.attachmentCode} ${wrap ? '' : css.attachmentNoWrap}`}>{textView.content}</pre>}
            {kind === 'image' && <ImageAttachment embedding={embedding} onDimensions={setDimensions}/>}
            {kind === 'html' && <iframe
                className={css.htmlAttachmentFrame}
                title='html attachment'
                sandbox='allow-scripts allow-popups'
                src={embeddingDataUrl(embedding)}
            />}
            {kind === 'unsupported' && <Unsupported embedding={embedding}/>}
        </div>
    </BaseModal>;
};
