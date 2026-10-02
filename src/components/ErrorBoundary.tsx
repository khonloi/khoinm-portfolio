import React, { Component, ErrorInfo, ReactNode } from 'react';
import Dialog from './Dialog';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
  title?: string;
  onClose?: () => void;
  fallback?: (props: { error: Error | null; reset: () => void }) => ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use the fallback prop if provided, otherwise show a Dialog
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.handleReset });
      }

      return (
        <Dialog
          isVisible={true}
          title={this.props.title || "PANE"}
          message={`An error occurred in ${this.props.name || 'this program'}.\nPlease close and reopen to try again.`}
          buttons={[
            { label: "Close", onClick: () => { if (this.props.onClose) { this.props.onClose(); } else { this.handleReset(); } } },
          ]}
          onClose={() => { if (this.props.onClose) { this.props.onClose(); } else { this.handleReset(); } }}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

