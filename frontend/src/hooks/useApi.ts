"use client";

import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const data = await apiCall();
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setState({ data: null, isLoading: false, error: message });
      throw err;
    }
  }, []);

  return { ...state, execute };
}
