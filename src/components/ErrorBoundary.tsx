import { Component, ErrorInfo, ReactNode } from 'react';
import { FlexRow, Text } from '@epam/loveship';

interface Props {
    children: ReactNode;
    /** caption displayed above error message */
    caption?: string;
}

interface State {
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = {};

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    render() {
        if (!this.state.error) return this.props.children;
        return <FlexRow padding='24' vPadding='24' rawProps={{ role: 'alert' }}>
            <div>
                <Text fontSize='16'>{this.props.caption ?? 'Something went wrong while rendering this part of the report'}</Text>
                <pre className='errorModalPre'>{this.state.error.message}</pre>
            </div>
        </FlexRow>;
    }
}
