export function openInNewTab(data: string, mimeType: string): () => void {
    return async function() {
        const f = await fetch(`data:${mimeType};base64,${data}`);
        const blob = await f.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }
}
