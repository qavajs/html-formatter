const { createHash } = require('node:crypto');
const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const MIME_EXTENSIONS = {
    'image/jpeg': 'jpg',
    'image/svg+xml': 'svg',
    'text/plain': 'txt'
};

function mimeExtension(mimeType) {
    if (MIME_EXTENSIONS[mimeType]) return MIME_EXTENSIONS[mimeType];
    const subtype = mimeType.split('/')[1]?.split(/[+;]/)[0];
    return subtype ? subtype.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin' : 'bin';
}

/**
 * Text-like attachments (logs, responses, json, html...) stay inline: they are small and
 * the report needs their content, which cannot be fetched from a local file opened via file://
 */
function isTextual(mimeType) {
    return mimeType.startsWith('text/') || /[/+](json|xml)$/.test(mimeType);
}

/**
 * Writes binary attachments (screenshots, videos, archives...) next to the report instead of base64 inlining.
 * Files are named by content hash, so identical attachments are stored once.
 */
class AttachmentFiles {
    /**
     * @param {string} dir - absolute directory to write attachments to
     * @param {string} urlPrefix - path of that directory relative to the report file
     */
    constructor(dir, urlPrefix) {
        this.dir = dir;
        this.urlPrefix = urlPrefix;
        this.written = new Set();
    }

    externalize(embedding) {
        if (isTextual(embedding.mime_type) || !embedding.data) return embedding;
        const bytes = Buffer.from(embedding.data, embedding.contentEncoding === 'BASE64' ? 'base64' : 'utf8');
        const name = `${createHash('sha1').update(bytes).digest('hex').slice(0, 20)}.${mimeExtension(embedding.mime_type)}`;
        if (!this.written.has(name)) {
            mkdirSync(this.dir, { recursive: true });
            const file = path.join(this.dir, name);
            if (!existsSync(file)) writeFileSync(file, bytes);
            this.written.add(name);
        }
        const external = { ...embedding, data: '', url: `${this.urlPrefix}/${name}`, size: bytes.length };
        delete external.contentEncoding;
        return external;
    }

    /** Replaces binary embeddings of the scenario with references to written files (mutates scenario) */
    apply(scenario) {
        for (const step of scenario.steps) {
            if (step.embeddings) step.embeddings = step.embeddings.map(embedding => this.externalize(embedding));
        }
        return scenario;
    }
}

/**
 * Creates attachment writer for `htmlConfig.attachments: 'external'`.
 * Returns undefined (attachments stay inline) when the report is not written to a file.
 * @param {string | undefined} reportFile - absolute path of the html report
 * @param {string} [attachmentsDir='attachments'] - directory relative to the report file (or absolute)
 */
function createAttachmentFiles(reportFile, attachmentsDir = 'attachments') {
    if (!reportFile) return undefined;
    const reportDir = path.dirname(reportFile);
    const dir = path.resolve(reportDir, attachmentsDir);
    const urlPrefix = path.relative(reportDir, dir).split(path.sep).map(encodeURIComponent).join('/') || '.';
    return new AttachmentFiles(dir, urlPrefix);
}

module.exports = { AttachmentFiles, createAttachmentFiles, isTextual, mimeExtension };
