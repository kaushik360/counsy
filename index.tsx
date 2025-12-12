import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          textAlign: 'center',
          fontFamily: 'sans-serif',
          backgroundColor: '#FEF2F2',
          color: '#991B1B'
        }}>
          <h1 style={{fontSize: '24px', marginBottom: '10px', fontWeight: 'bold'}}>Something went wrong</h1>
          <p style={{marginBottom: '20px'}}>Please refresh the page or try again later.</p>
          <pre style={{
            backgroundColor: '#fff', 
            padding: '10px', 
            borderRadius: '4px', 
            overflow: 'auto', 
            maxWidth: '100%', 
            fontSize: '12px',
            textAlign: 'left'
          }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);