import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Screen, Spacing} from '../utils/dimension';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you would log this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({hasError: false, error: undefined});
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorText}>
              Error: {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: Spacing.large,
    lineHeight: 24,
  },
  errorText: {
    fontSize: FontSize.small,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: Spacing.large,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
