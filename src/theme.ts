import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'qavajs-report-theme';
const UUI_THEME_CLASS: Record<Theme, string> = {
    light: 'uui-theme-loveship',
    dark: 'uui-theme-loveship_dark'
};

export function readTheme(): Theme {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
}

function storeTheme(theme: Theme) {
    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // storage can be unavailable (e.g. file:// in some browsers), theme still applies for this page view
    }
}

/** Applies report tokens (html[data-theme]) and the matching UUI theme class on body */
export function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    for (const [name, className] of Object.entries(UUI_THEME_CLASS)) {
        document.body.classList.toggle(className, name === theme);
    }
}

/** Applies the stored theme and prints with the light theme regardless of the selected one */
export function initTheme() {
    applyTheme(readTheme());
    window.addEventListener('beforeprint', () => applyTheme('light'));
    window.addEventListener('afterprint', () => applyTheme(readTheme()));
}

export function useTheme(): [Theme, () => void] {
    const [theme, setTheme] = useState<Theme>(readTheme);
    const toggle = useCallback(() => setTheme(current => {
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        storeTheme(next);
        applyTheme(next);
        return next;
    }), []);
    return [theme, toggle];
}
