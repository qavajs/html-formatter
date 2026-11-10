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
        if (embedding.url) {
            window.open(embedding.url, '_blank');
            return;
        }
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
        const link = document.createElement('a');
        link.download = embeddingFileName(embedding);
        if (embedding.url) {
            // browsers may ignore `download` for file:// urls and open the file instead
            link.href = embedding.url;
            link.click();
            return;
        }
        const blobUrl = embeddingBlobUrl(embedding);
        link.href = blobUrl;
        link.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), REVOKE_TIMEOUT);
    };
}
