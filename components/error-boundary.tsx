import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import * as Sentry from '@sentry/nextjs';
import { Button } from './ui/button';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h2>
      <div className="p-6 mb-6 border rounded-lg bg-red-50 border-red-200">
        <p className="mb-2 text-sm text-gray-600">Error details:</p>
        <pre className="p-2 overflow-auto text-left text-red-800 bg-red-100 rounded">
          {error.message}
        </pre>
      </div>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        Sentry.captureException(error, {
          extra: {
            componentStack: info.componentStack,
          },
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}; 