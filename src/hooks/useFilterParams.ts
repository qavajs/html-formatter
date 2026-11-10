import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const SEARCH_PARAM = 'q';
const FAILED_PARAM = 'failed';

function readStorage(key: string): boolean {
    try {
        return window.sessionStorage.getItem(key) === 'true';
    } catch {
        return false;
    }
}

function writeStorage(key: string, value: boolean) {
    try {
        window.sessionStorage.setItem(key, String(value));
    } catch {
        // storage can be unavailable (e.g. file:// in some browsers), filter still works via url
    }
}

/**
 * Search / "show only failed" filter state kept in url query params (so filtered view can be shared),
 * "show only failed" falls back to the last value stored in session storage.
 */
export function useFilterParams(storageKey: string) {
    const [params, setParams] = useSearchParams();
    const search = params.get(SEARCH_PARAM) ?? '';
    const failedParam = params.get(FAILED_PARAM);
    const showOnlyFailed = failedParam !== null ? failedParam === 'true' : readStorage(storageKey);

    const update = useCallback((key: string, value: string | null) => {
        setParams(prev => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value); else next.delete(key);
            return next;
        }, { replace: true });
    }, [setParams]);

    const setSearch = useCallback((value?: string) => update(SEARCH_PARAM, value || null), [update]);
    const setShowOnlyFailed = useCallback((value: boolean) => {
        writeStorage(storageKey, value);
        update(FAILED_PARAM, String(value));
    }, [storageKey, update]);

    return { search, setSearch, showOnlyFailed, setShowOnlyFailed };
}
