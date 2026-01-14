/**
 * Error Boundary Component
 * Catches and displays errors gracefully with Sinoverse branding
 */

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to analytics/error reporting service in production
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Sinoverse-branded error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200 animate-slideUp">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              哎呀! Something Went Wrong
            </h1>

            <p className="text-gray-600 text-center mb-6 text-lg">
              We encountered an unexpected error. Don't worry, your learning
              progress is safe!
            </p>

            {/* Error Details (Development Mode Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 select-none">
                  Error Details (Development Mode)
                </summary>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-red-600 mb-1">
                      Error Message:
                    </p>
                    <pre className="text-xs bg-red-50 p-3 rounded overflow-x-auto border border-red-200 text-red-800">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <p className="text-sm font-semibold text-orange-600 mb-1">
                        Component Stack:
                      </p>
                      <pre className="text-xs bg-orange-50 p-3 rounded overflow-x-auto border border-orange-200 text-orange-800 max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Go Home
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      "This will clear all cached data. Your progress will be lost. Continue?"
                    )
                  ) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-yellow-600 hover:text-yellow-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                🧹 Clear Cache
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                If this problem persists, please{" "}
                <a
                  href="https://github.com/sinoverse/sinoverse/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 font-semibold underline"
                >
                  report it on GitHub
                </a>{" "}
                or contact{" "}
                <a
                  href="mailto:support@sinoverse.app"
                  className="text-red-600 hover:text-red-700 font-semibold underline"
                >
                  support@sinoverse.app
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
