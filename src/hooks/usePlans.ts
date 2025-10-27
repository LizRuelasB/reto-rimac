import { useState, useCallback, useEffect } from 'react';
import { plansService } from '../services/api/plans.service';
import { usePlanCalculations } from './usePlanCalculations';
import { Plan } from '../types';

interface UsePlansReturn {
  plans: Plan[];
  filteredPlans: Plan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  filterPlansByAge: (userAge: number) => void;
  calculateDiscountedPrice: (originalPrice: number, isForSomeoneElse: boolean) => number;
  clearError: () => void;
}

export const usePlans = (userAge?: number): UsePlansReturn => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { filterPlansByAge: filterByAge, calculateFinalPrice } = usePlanCalculations(userAge);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await plansService.fetchPlans();
      setPlans(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener los planes';
      setError(errorMessage);
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterPlansByAge = useCallback((userAge: number) => {
    const filtered = filterByAge(plans, userAge);
    setFilteredPlans(filtered);
  }, [plans, filterByAge]);

  const calculateDiscountedPrice = useCallback((originalPrice: number, isForSomeoneElse: boolean) => {
    return calculateFinalPrice(originalPrice, isForSomeoneElse, userAge);
  }, [calculateFinalPrice, userAge]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (plans.length === 0) {
      setFilteredPlans([]);
    }
  }, [plans]);

  return {
    plans,
    filteredPlans,
    isLoading,
    error,
    fetchPlans,
    filterPlansByAge,
    calculateDiscountedPrice,
    clearError,
  };
};
