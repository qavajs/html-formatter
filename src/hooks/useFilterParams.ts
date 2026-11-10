import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const SEARCH_PARAM = 'q';
const FAILED_PARAM = 'failed';
const TAG_PARAM = 'tag';
const HOOKS_PARAM = 'hooks';
const HOOKS_STORAGE_KEY = 'showPassedHooks';

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

/** Single query param setter that keeps the other params and does not add history entries */
export function useQueryParam(key: string): [string | null, (value: string | null) => void] {
    const [params, setParams] = useSearchParams();
    const setValue = useCallback((value: string | null) => {
        setParams(prev => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value); else next.delete(key);
            return next;
        }, { replace: true });
    }, [key, setParams]);
    return [params.get(key), setValue];
}

/** Boolean kept in url (shareable) that falls back to the last value stored in session storage */
function usePersistentFlag(param: string, storageKey: string): [boolean, (value: boolean) => void] {
    const [raw, setRaw] = useQueryParam(param);
    const value = raw !== null ? raw === 'true' : readStorage(storageKey);
    const setValue = useCallback((next: boolean) => {
        writeStorage(storageKey, next);
        setRaw(String(next));
    }, [storageKey, setRaw]);
    return [value, setValue];
}

/** Tag filter applied by clicking a tag anywhere on the page */
export function useTagFilter() {
    const [tag, setTag] = useQueryParam(TAG_PARAM);
    return { tag: tag ?? '', setTag: useCallback((value?: string) => setTag(value || null), [setTag]) };
}

/** Passed Before / After hooks are hidden by default to keep scenarios short */
export function useShowPassedHooks() {
    return usePersistentFlag(HOOKS_PARAM, HOOKS_STORAGE_KEY);
}

/**
 * Search / tag / "show only failed" filter state kept in url query params (so filtered view can be shared),
 * "show only failed" falls back to the last value stored in session storage.
 */
export function useFilterParams(storageKey: string) {
    const [search, setSearchParam] = useQueryParam(SEARCH_PARAM);
    const [showOnlyFailed, setShowOnlyFailed] = usePersistentFlag(FAILED_PARAM, storageKey);
    const { tag, setTag } = useTagFilter();
    const setSearch = useCallback((value?: string) => setSearchParam(value || null), [setSearchParam]);
    return { search: search ?? '', setSearch, showOnlyFailed, setShowOnlyFailed, tag, setTag };
}
