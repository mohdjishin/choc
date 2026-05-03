import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-silk-base flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-4xl font-headline-lg italic text-ganache-rich mb-6">Something went wrong</h1>
          <p className="text-ganache-rich/60 mb-12 max-w-md">Our digital atelier is currently undergoing maintenance. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-ganache-rich text-silk-base px-12 py-4 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-copper-accent transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
