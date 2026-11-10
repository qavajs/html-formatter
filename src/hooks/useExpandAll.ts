import { useCallback, useState } from 'react';

/**
 * Expand all / collapse all for a list of uncontrolled accordions:
 * pass `open` as defaultOpen and append `version` to the item key so items remount with the new state
 */
export function useExpandAll(initialOpen: boolean) {
    const [state, setState] = useState({ open: initialOpen, version: 0 });
    const expandAll = useCallback(() => setState(prev => ({ open: true, version: prev.version + 1 })), []);
    const collapseAll = useCallback(() => setState(prev => ({ open: false, version: prev.version + 1 })), []);
    return { ...state, expandAll, collapseAll };
}
