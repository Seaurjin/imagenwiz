import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      
      if (FallbackComponent) {
        return <FallbackComponent 
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />;
      }
      
      // Default fallback UI
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-800 font-bold">Something went wrong:</h2>
          <pre className="text-sm text-red-700 mt-2 p-2 bg-red-100 rounded overflow-auto">
            {this.state.error && this.state.error.toString()}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default fallback component that can be used
export const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h2 className="text-red-800 font-bold">Something went wrong:</h2>
    <pre className="text-sm text-red-700 mt-2 p-2 bg-red-100 rounded overflow-auto">
      {error?.message || 'Unknown error'}
    </pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

export default ErrorBoundary; 