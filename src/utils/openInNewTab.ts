import type { Embedding } from '../types';
import { embeddingAsBytes } from './encoding';
import { mimeExtension } from './supportedMimeTypes';

const REVOKE_TIMEOUT = 60_000;

function embeddingBlobUrl(embedding: Embedding): string {
    const blob = new Blob([embeddingAsBytes(embedding)], { type: embedding.mime_type });
    return URL.createObjectURL(blob);
}

export function openInNewTab(embedding: Embedding): () => void {
    return function () {
        const blobUrl = embeddingBlobUrl(embedding);
        window.open(blobUrl, '_blank');
        // the opened tab keeps its own reference to the document, so the url can be released afterwards
        setTimeout(() => URL.revokeObjectURL(blobUrl), REVOKE_TIMEOUT);
    };
}

/** File name used when saving attachment, e.g. attachment.json */
export function embeddingFileName(embedding: Embedding): string {
    return embedding.fileName ?? `attachment.${mimeExtension(embedding.mime_type)}`;
}

export function downloadEmbedding(embedding: Embedding): () => void {
    return function () {
        const blobUrl = embeddingBlobUrl(embedding);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = embeddingFileName(embedding);
        link.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), REVOKE_TIMEOUT);
    };
}
