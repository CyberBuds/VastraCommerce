import { useState, useCallback } from 'react';
import axios from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, Args extends any[] = any[]>(apiFn: (...args: Args) => Promise<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: Args): Promise<T> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiFn(...args);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (err: any) {
      let message = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, [apiFn]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
