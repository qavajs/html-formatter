import type { KeyboardEvent } from 'react';

/**
 * Controls rendered inside an accordion header: the header toggles on Enter / Space and prevents default,
 * which would swallow the control's own activation, so keyboard events must not bubble up to it
 */
export function stopKeyboardPropagation(event: KeyboardEvent) {
    event.stopPropagation();
}
