import { useState, useEffect, useCallback } from 'react';
import { FlexRow, LinkButton, IconButton, Text } from '@epam/loveship';
import { BaseModal, ModalProps } from './BaseModal';
import { ImageAttachment } from './AttachmentModal';
import { downloadEmbedding, openInNewTab } from '../utils/openInNewTab';
import type { Embedding } from '../types';
import css from '../App.module.scss';

import PrevIcon from '@epam/assets/icons/common/navigation-chevron-left_left-24.svg?react';
import NextIcon from '@epam/assets/icons/common/navigation-chevron-right_right-24.svg?react';
import DownloadIcon from '@epam/assets/icons/common/file-download-18.svg?react';
import ExternalIcon from '@epam/assets/icons/common/action-external_link-18.svg?react';

export const SlideshowModal = ({ embeddings, ...modal }: ModalProps & { embeddings: Embedding[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const current = embeddings[currentIndex];
    const hasMultiple = embeddings.length > 1;

    const goPrev = useCallback(() => {
        setCurrentIndex(i => (i > 0 ? i - 1 : embeddings.length - 1));
    }, [embeddings.length]);

    const goNext = useCallback(() => {
        setCurrentIndex(i => (i < embeddings.length - 1 ? i + 1 : 0));
    }, [embeddings.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goPrev, goNext]);

    return (
        <BaseModal modal={modal} title='Screenshots' width={1200}>
            <FlexRow padding='24' vPadding='12' alignItems='top'>
                {hasMultiple && (
                    <div className={css.slideshowNav}>
                        <IconButton icon={PrevIcon} onClick={goPrev} color='white' rawProps={{ 'aria-label': 'Previous screenshot' }}/>
                    </div>
                )}
                <div className={css.slideshowContent}>
                    <FlexRow justifyContent='end' columnGap='12' cx={css.slideshowActions}>
                        <LinkButton caption='Download' icon={DownloadIcon} size='30' onClick={downloadEmbedding(current)}/>
                        <LinkButton caption='Open in new tab' icon={ExternalIcon} size='30' onClick={openInNewTab(current)}/>
                    </FlexRow>
                    <ImageAttachment key={currentIndex} embedding={current}/>
                </div>
                {hasMultiple && (
                    <div className={css.slideshowNav}>
                        <IconButton icon={NextIcon} onClick={goNext} color='white' rawProps={{ 'aria-label': 'Next screenshot' }}/>
                    </div>
                )}
            </FlexRow>
            {hasMultiple && (
                <FlexRow padding='24' vPadding='12' justifyContent='center'>
                    <Text fontSize='14'>
                        {current.fileName ? `${current.fileName} — ` : ''}{currentIndex + 1} / {embeddings.length}
                    </Text>
                </FlexRow>
            )}
        </BaseModal>
    );
};
