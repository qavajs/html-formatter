import { screen } from '@testing-library/react';
import { renderWithContextAsync } from '@epam/uui-test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { AttachmentModal } from './AttachmentModal';
import { ResponseModal, statusColor } from './ResponseModal';
import { Step } from './Step';
import { TagList } from './TagList';
import { mimeLabel } from '../utils/supportedMimeTypes';
import { FeaturePage } from '../pages/FeaturePage';
import { ReportProvider } from '../ReportContext';
import { buildReport } from '../report';
import type { Embedding } from '../types';

const modal = { key: 'm', zIndex: 1, isActive: true, success: () => {}, abort: () => {} };

const Throws = (): never => {
    throw new Error('render failure');
};

describe('ErrorBoundary', () => {
    test('renders fallback instead of crashing', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        await renderWithContextAsync(<ErrorBoundary caption='Broken'><Throws/></ErrorBoundary>);
        expect(screen.getByRole('alert')).toHaveTextContent('Broken');
        expect(screen.getByRole('alert')).toHaveTextContent('render failure');
    });
});

describe('AttachmentModal', () => {
    test('shows invalid json instead of crashing', async () => {
        const embedding: Embedding = { data: '{not json', mime_type: 'application/json', contentEncoding: 'IDENTITY' };
        await renderWithContextAsync(<AttachmentModal {...modal} embedding={embedding}/>);
        expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();
        expect(screen.getByText('{not json')).toBeInTheDocument();
    });

    test('shows type, size and line count for text', async () => {
        const embedding: Embedding = { data: 'a\nb\nc', mime_type: 'text/plain', contentEncoding: 'IDENTITY' };
        await renderWithContextAsync(<AttachmentModal {...modal} embedding={embedding}/>);
        expect(screen.getByText('Text')).toBeInTheDocument();
        expect(screen.getByText('5 B')).toBeInTheDocument();
        expect(screen.getByText('3 lines')).toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    test('offers download for unsupported type', async () => {
        const embedding: Embedding = { data: 'x', mime_type: 'application/zip', contentEncoding: 'IDENTITY' };
        await renderWithContextAsync(<AttachmentModal {...modal} embedding={embedding}/>);
        expect(screen.getByText('Preview is not available')).toBeInTheDocument();
        expect(screen.getByText('Download file')).toBeInTheDocument();
        expect(screen.queryByText('Open in new tab')).not.toBeInTheDocument();
    });
});

describe('ResponseModal', () => {
    test('shows raw content for malformed response', async () => {
        const response: Embedding = { data: 'oops', mime_type: 'text/x.response.json', contentEncoding: 'IDENTITY' };
        await renderWithContextAsync(<ResponseModal {...modal} response={response}/>);
        expect(screen.getByText(/Cannot parse response attachment/)).toBeInTheDocument();
    });

    test.each([[200, 'success'], [302, 'success'], [404, 'sun'], [500, 'fire'], [undefined, 'night300']])(
        'status %s -> %s', (status, color) => {
            expect(statusColor(status)).toBe(color);
        });
});

describe('Step', () => {
    test('renders name, duration and attachment buttons', async () => {
        await renderWithContextAsync(<Step step={{
            id: 's1',
            name: 'I open page',
            result: { status: 'passed', duration: 1_500_000_000 },
            embeddings: [
                { data: 'log', mime_type: 'text/x.cucumber.log+plain', contentEncoding: 'IDENTITY' },
                { data: 'iVBORw0KGgo=', mime_type: 'image/jpeg', contentEncoding: 'BASE64' },
                { data: 'x', mime_type: 'text/plain', contentEncoding: 'IDENTITY', fileName: 'notes.txt' }
            ]
        }}/>);
        expect(screen.getByText('I open page')).toBeInTheDocument();
        expect(screen.getByText('1.50s')).toBeInTheDocument();
        expect(screen.getByText('Logs')).toBeInTheDocument();
        expect(screen.getByText('Screenshot')).toBeInTheDocument();
        expect(screen.getByText('notes.txt')).toBeInTheDocument();
    });
});

describe('FeaturePage', () => {
    test('shows not found state for unknown feature id', async () => {
        await renderWithContextAsync(
            <ReportProvider report={buildReport([])}>
                <MemoryRouter initialEntries={['/feature/unknown']}>
                    <Routes>
                        <Route path='/feature/:id' element={<FeaturePage/>}/>
                    </Routes>
                </MemoryRouter>
            </ReportProvider>
        );
        expect(screen.getByText('Feature not found.')).toBeInTheDocument();
    });
});

describe('TagList', () => {
    test('dedupes tags and collapses overflow into +N', async () => {
        await renderWithContextAsync(<TagList itemsToRender={2} tags={[
            { name: '@a' }, { name: '@a' }, { name: '@b' }, { name: '@c' }, { name: '@d' }
        ]}/>);
        expect(screen.getAllByText('@a')).toHaveLength(1);
        expect(screen.getByText('@b')).toBeInTheDocument();
        expect(screen.getByText('+2')).toHaveAttribute('title', '@c, @d');
    });

    test('renders nothing without tags', async () => {
        const { container } = await renderWithContextAsync(<TagList tags={[]}/>);
        expect(container.querySelector('button')).toBeNull();
    });
});

describe('mimeLabel', () => {
    test.each([
        ['application/json', 'JSON'],
        ['text/plain', 'Text'],
        ['image/png', 'Image'],
        ['application/vnd.ms-excel', 'VND.MS-EXCEL'],
        ['application/ld+json', 'LD'],
        ['weird', 'weird']
    ])('%s -> %s', (mime, label) => {
        expect(mimeLabel(mime)).toBe(label);
    });
});

describe('Step response chip', () => {
    test('shows method and status of a response attachment', async () => {
        const data = JSON.stringify({ request: { method: 'GET', url: 'http://x' }, response: { status: 404 } });
        await renderWithContextAsync(<Step step={{
            id: 's2',
            name: 'I call api',
            result: { status: 'passed', duration: 0 },
            embeddings: [{ data, mime_type: 'text/x.response.json', contentEncoding: 'IDENTITY' }]
        }}/>);
        expect(screen.getByText('GET 404')).toBeInTheDocument();
    });
});
