"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RocketIcon } from '@/components/SpaceElements';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and external service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Log to external service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#000319] flex items-center justify-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated background stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.1, 0.8, 0.1],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-2xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Error Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <RocketIcon className="w-12 h-12 text-white transform rotate-45" />
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-300 text-lg mb-6">
                  We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
                </p>
              </motion.div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 p-4 bg-red-500/10 backdrop-blur-lg rounded-xl border border-red-500/30 text-left"
                >
                  <h3 className="text-red-400 font-semibold mb-2">Error Details (Development)</h3>
                  <p className="text-red-300 text-sm font-mono mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-red-300 text-xs font-mono">
                      <summary className="cursor-pointer hover:text-red-200">Component Stack</summary>
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReset}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                >
                  Try Again
                </motion.button>
                
                <Link href="/" className="block w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Go Home
                  </motion.button>
                </Link>
              </motion.div>

              {/* Additional Help */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-gray-400 text-sm">
                  If this problem persists, please{' '}
                  <button
                    onClick={() => window.location.reload()}
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    refresh the page
                  </button>
                  {' '}or contact our support team.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error boundary
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Manual error report:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry
      // Sentry.captureException(error, { extra: errorInfo });
    }
  };
};

export default ErrorBoundary; 