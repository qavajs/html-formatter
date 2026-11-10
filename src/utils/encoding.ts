import type { Embedding } from '../types';
import { image } from './supportedMimeTypes';

export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

/** Decodes base64 string into UTF-8 text */
export function decodeBase64(base64: string): string {
    return new TextDecoder().decode(base64ToBytes(base64));
}

/** Encodes UTF-8 text into base64 string */
export function encodeBase64(text: string): string {
    return bytesToBase64(new TextEncoder().encode(text));
}

/**
 * Whether embedding data is base64 encoded.
 * Falls back to guessing by mime type for reports produced without contentEncoding.
 */
export function isBase64Encoded(embedding: Embedding): boolean {
    if (embedding.contentEncoding) return embedding.contentEncoding === 'BASE64';
    return image.includes(embedding.mime_type);
}

export function isValidBase64(value: string): boolean {
    try {
        atob(value);
        return true;
    } catch {
        return false;
    }
}

/** Embedding marked as base64 may still contain plain data (e.g. attached with `base64:` prefix without encoding) */
function hasBase64Data(embedding: Embedding): boolean {
    return isBase64Encoded(embedding) && isValidBase64(embedding.data);
}

export function embeddingAsBase64(embedding: Embedding): string {
    return hasBase64Data(embedding) ? embedding.data : encodeBase64(embedding.data);
}

export function embeddingAsText(embedding: Embedding): string {
    return hasBase64Data(embedding) ? decodeBase64(embedding.data) : embedding.data;
}

export function embeddingAsBytes(embedding: Embedding): Uint8Array<ArrayBuffer> {
    return hasBase64Data(embedding)
        ? base64ToBytes(embedding.data)
        : new TextEncoder().encode(embedding.data);
}

export function embeddingDataUrl(embedding: Embedding): string {
    return `data:${embedding.mime_type};base64,${embeddingAsBase64(embedding)}`;
}

/** Parses JSON returning result object instead of throwing */
export function tryParseJson<T = unknown>(text: string): { ok: true, value: T } | { ok: false, error: string } {
    try {
        return { ok: true, value: JSON.parse(text) as T };
    } catch (err) {
        return { ok: false, error: (err as Error).message };
    }
}
