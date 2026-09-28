import React from 'react';
import Dialog from './Dialog';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
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

ErrorBoundary.displayName = 'ErrorBoundary';
export default ErrorBoundary;
