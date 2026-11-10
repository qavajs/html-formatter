export const image = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml'
];

export const iframe = [
    'text/html'
];

export const text = [
    'text/plain'
];

export const json = [
    'application/json'
];

export const supportedMimeTypes = [
    ...image,
    ...iframe,
    ...text,
    ...json
];

const mimeLabels: Record<string, string> = {
    'text/plain': 'Text',
    'text/html': 'HTML',
    'application/json': 'JSON',
    'application/pdf': 'PDF',
    'application/xml': 'XML',
    'text/xml': 'XML',
    'text/csv': 'CSV',
    'application/zip': 'ZIP',
    'video/mp4': 'Video',
    'video/webm': 'Video'
};

/** Human-readable attachment type, e.g. "JSON" for application/json */
export function mimeLabel(mimeType: string): string {
    if (mimeLabels[mimeType]) return mimeLabels[mimeType];
    if (image.includes(mimeType)) return 'Image';
    const subtype = mimeType.split('/')[1]?.split(/[+;]/)[0];
    return subtype ? subtype.toUpperCase() : mimeType;
}

const mimeExtensions: Record<string, string> = {
    'text/plain': 'txt',
    'image/jpeg': 'jpg',
    'image/svg+xml': 'svg'
};

/** File extension for mime type, e.g. "json" for application/json */
export function mimeExtension(mimeType: string): string {
    if (mimeExtensions[mimeType]) return mimeExtensions[mimeType];
    const subtype = mimeType.split('/')[1]?.split(/[+;]/)[0];
    return subtype ? subtype.toLowerCase() : 'bin';
}
