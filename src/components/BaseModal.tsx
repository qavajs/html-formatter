import { ReactNode } from 'react';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Panel, ScrollBars } from '@epam/loveship';
import { IModal } from '@epam/uui-core';
import { ErrorBoundary } from './ErrorBoundary';
import css from '../App.module.scss';

export type ModalProps = IModal<string>;

interface BaseModalProps {
    modal: ModalProps;
    title: string;
    width?: number;
    children: ReactNode;
}

export const BaseModal = ({ modal, title, width = 900, children }: BaseModalProps) =>
    <ModalBlocker {...modal}>
        <ModalWindow width={width} cx={css.modalWindow}>
            <Panel>
                <ModalHeader title={title} onClose={() => modal.success('close')}/>
                <ScrollBars overflowTopEffect='shadow' overflowBottomEffect='shadow'>
                    <ErrorBoundary caption={`Cannot render ${title.toLowerCase()}`}>
                        {children}
                    </ErrorBoundary>
                </ScrollBars>
                <ModalFooter/>
            </Panel>
        </ModalWindow>
    </ModalBlocker>;
