import { useState, useCallback, useEffect, useMemo } from 'react';

// Custom hook para manejo de estados de loading con debounce
export const useLoadingState = (initialState = false, debounceMs = 300) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [debouncedLoading, setDebouncedLoading] = useState(initialState);

  // Debounce del loading para evitar parpadeos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLoading(isLoading);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [isLoading, debounceMs]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    debouncedLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// Custom hook para manejo de errores
export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<string[]>([]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setErrorHistory(prev => [...prev.slice(-4), errorMessage]); // Mantener últimos 5 errores
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAllErrors = useCallback(() => {
    setError(null);
    setErrorHistory([]);
  }, []);

  const hasError = useMemo(() => Boolean(error), [error]);

  return {
    error,
    errorHistory,
    handleError,
    clearError,
    clearAllErrors,
    hasError,
  };
};

// Custom hook para timeout de sesión
export const useSessionTimeout = (timeoutMinutes = 30) => {
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutMinutes * 60);
    setIsExpired(false);
  }, [timeoutMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  return {
    timeLeft,
    isExpired,
    formatTimeLeft,
    resetTimer,
  };
};
