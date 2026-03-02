import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-100">
                    <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-zinc-400 mb-8">
                            An unexpected error occurred. We've been notified and are working on it.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl transition-all active:scale-95"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Application
                            </button>

                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="w-full h-12 text-zinc-400 hover:text-zinc-100 font-medium transition-colors"
                            >
                                Try again
                            </button>
                        </div>

                        {process.env.NODE_ENV !== 'production' && this.state.error && (
                            <div className="mt-8 pt-8 border-t border-zinc-800 text-left">
                                <p className="text-xs font-mono text-zinc-500 overflow-auto max-h-32 p-3 bg-zinc-950 rounded-lg">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
