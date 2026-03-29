import { useState, useEffect, useCallback } from 'react';
import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel,
    ScrollBars,
    LinkButton,
    IconButton,
    Text
} from '@epam/loveship';
import { openInNewTab } from '../utils/openInNewTab';

import PrevIcon from '@epam/assets/icons/common/navigation-chevron-left_left-24.svg?react';
import NextIcon from '@epam/assets/icons/common/navigation-chevron-right_right-24.svg?react';

export const SlideshowModal = (modalProps: any) => {
    const { embeddings } = modalProps;
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
        <ModalBlocker blockerShadow='dark' {...modalProps}>
            <ModalWindow width={1200} style={{ margin: 'auto' }}>
                <Panel>
                    <ModalHeader title='Screenshots' onClose={() => modalProps.success('close')} />
                    <ScrollBars>
                        <FlexRow padding='24' vPadding='12' alignItems='top'>
                            {hasMultiple && (
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px' }}>
                                    <IconButton icon={PrevIcon} onClick={goPrev} color='white' />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <FlexRow>
                                    <LinkButton
                                        caption='Open in new tab'
                                        size='30'
                                        onClick={openInNewTab(current.data, current.mime_type)}
                                    />
                                </FlexRow>
                                <img
                                    src={`data:${current.mime_type};base64,${current.data}`}
                                    alt={current.fileName ?? `screenshot ${currentIndex + 1}`}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            {hasMultiple && (
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px' }}>
                                    <IconButton icon={NextIcon} onClick={goNext} color='white' />
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
                    </ScrollBars>
                    <ModalFooter />
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
};