import { useMemo } from 'react';
import { Plan, SelectedPlanData } from '../types';

export const usePlanCalculations = (userAge?: number) => {
  const filterPlansByAge = useMemo(() => (plans: Plan[], age: number) => {
    return plans.filter(plan => age <= plan.age);
  }, []);
  const calculateFinalPrice = useMemo(() => (
    basePrice: number, 
    isForSomeoneElse: boolean,
    userAge?: number
  ) => {
    let finalPrice = basePrice;

    if (isForSomeoneElse) {
      finalPrice = finalPrice * 0.95;
    }

    if (userAge && userAge >= 60) {
      finalPrice = finalPrice * 0.90;
    }

    return Math.round(finalPrice * 100) / 100;
  }, []);
  const createSelectedPlan = useMemo(() => (
    plan: Plan,
    isForSomeoneElse: boolean
  ): SelectedPlanData => {
    const finalPrice = calculateFinalPrice(plan.price, isForSomeoneElse, userAge);

    return {
      ...plan,
      finalPrice,
      isForSomeoneElse,
    };
  }, [calculateFinalPrice, userAge]);

  const calculateSavings = useMemo(() => (originalPrice: number, finalPrice: number) => {
    const savings = originalPrice - finalPrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    
    return {
      amount: savings,
      percentage,
      hasSavings: savings > 0,
    };
  }, []);

  return {
    filterPlansByAge,
    calculateFinalPrice,
    createSelectedPlan,
    calculateSavings,
  };
};
