import { useState, useCallback } from 'react';
import { userService } from '../services/api/user.service';
import { UserAPIData } from '../types';

interface UseUserReturn {
  userData: UserAPIData | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useUser = (): UseUserReturn => {
  const [userData, setUserData] = useState<UserAPIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userService.fetchUserData();
      setUserData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener datos del usuario';
      setError(errorMessage);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    userData,
    isLoading,
    error,
    fetchUser,
    clearError,
  };
};
