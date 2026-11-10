import { ReactNode } from 'react';
import { IModal, IModalContext } from '@epam/uui-core';

/**
 * Shows modal ignoring abort (Escape / click outside) rejection,
 * otherwise it surfaces as unhandled promise rejection.
 */
export function showModal(modals: IModalContext, render: (props: IModal<string>) => ReactNode): void {
    modals.show<string>(render).catch(() => {});
}
