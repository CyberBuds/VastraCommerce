import { useState, useCallback } from 'react';

export function useLoading(initialStates: Record<string, boolean> = {}) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(initialStates);

  const startLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return !!loadingStates[key];
  }, [loadingStates]);

  const toggleLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    isLoading,
    toggleLoading,
  };
}
