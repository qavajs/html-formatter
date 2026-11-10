const NANOS_IN_SECOND = 1_000_000_000;

/** Formats duration in nanoseconds into human-readable string, e.g. 340ms, 1.25s, 2m 3.10s, 1h 2m 3s */
export function formatDuration(nanos: number): string {
    const totalSeconds = (nanos ?? 0) / NANOS_IN_SECOND;
    if (totalSeconds < 1) return `${Math.round(totalSeconds * 1000)}ms`;
    if (totalSeconds < 60) return `${totalSeconds.toFixed(2)}s`;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${Math.floor(seconds)}s`;
    return `${minutes}m ${seconds.toFixed(2)}s`;
}

export function matchesSearch(value: string, search: string): boolean {
    return !search || value.toLowerCase().includes(search.toLowerCase());
}

export function percent(value: number, total: number): number {
    return total > 0 ? Math.round(value * 100 / total) : 0;
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

/** Formats byte count into human-readable string, e.g. 512 B, 1.5 KB, 2.3 MB */
export function formatBytes(bytes: number): string {
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
        value /= 1024;
        unit++;
    }
    return unit === 0 ? `${value} B` : `${value.toFixed(value < 10 ? 1 : 0)} ${BYTE_UNITS[unit]}`;
}
