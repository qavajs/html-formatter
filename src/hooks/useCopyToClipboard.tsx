import { useCallback } from 'react';
import type { SyntheticEvent } from 'react';
import { ErrorNotification, SuccessNotification, Text } from '@epam/loveship';
import { useUuiContext } from '@epam/uui-core';

const NOTIFICATION_DURATION = 2;

/** Copies text to the clipboard and shows a short snackbar with the result; `label` replaces the value in the snackbar */
export function useCopyToClipboard() {
    const { uuiNotifications } = useUuiContext();

    return useCallback((value: string, label: string = value) => (event?: SyntheticEvent | Event) => {
        event?.stopPropagation();
        const notify = (ok: boolean) => uuiNotifications
            .show(props => ok
                ? <SuccessNotification {...props}><Text size='30'>Copied {label}</Text></SuccessNotification>
                : <ErrorNotification {...props}><Text size='30'>Cannot copy {label} to clipboard</Text></ErrorNotification>,
            { duration: NOTIFICATION_DURATION, position: 'bot-left' })
            // notifications reject when closed manually
            .catch(() => {});
        const write = navigator.clipboard?.writeText(value) ?? Promise.reject(new Error('Clipboard is not available'));
        return write.then(() => notify(true), () => notify(false));
    }, [uuiNotifications]);
}
