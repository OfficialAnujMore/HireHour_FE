import React from 'react';
import {useLoader} from '../hooks/useLoader';

interface WithLoaderProps {
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const withLoader = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithLoaderProps>,
) => {
  return (props: P) => {
    const {startLoading, stopLoading} = useLoader();

    return React.createElement(WrappedComponent, {
      ...props,
      startLoading,
      stopLoading,
    });
  };
};

// Utility function to wrap async operations with loader
export const withLoading = async <T>(
  asyncOperation: () => Promise<T>,
  startLoading: (message?: string) => void,
  stopLoading: () => void,
  message?: string,
): Promise<T> => {
  try {
    startLoading(message);
    const result = await asyncOperation();
    return result;
  } finally {
    stopLoading();
  }
}; 