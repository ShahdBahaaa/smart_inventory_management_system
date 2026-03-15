import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
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
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="glass-card p-5 text-center border-0 shadow-lg" style={{ maxWidth: '500px' }}>
            <div className="bg-danger bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
              <AlertTriangle size={48} className="text-danger" />
            </div>
            <h2 className="fw-bold text-dark mb-3">Something went wrong</h2>
            <p className="text-muted mb-4">
              The AI engine encountered an unexpected interruption. This event has been logged and our nodes are working to restore stability.
            </p>
            <div className="p-3 bg-light rounded-3 mb-4 text-start border border-danger border-opacity-10">
              <code className="small text-danger">{this.state.error?.message}</code>
            </div>
            <button 
              className="btn btn-info text-white w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 shadow-glow"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={20} />
              Reboot Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
