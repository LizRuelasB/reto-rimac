import { useMemo } from 'react';
import { Plan, SelectedPlanData } from '../types';

// Custom hook para cálculos de precios y planes
export const usePlanCalculations = (userAge?: number) => {
  // Filtrar planes por edad
  const filterPlansByAge = useMemo(() => (plans: Plan[], age: number) => {
    return plans.filter(plan => age <= plan.age);
  }, []);

  // Calcular precio con descuentos
  const calculateFinalPrice = useMemo(() => (
    basePrice: number, 
    isForSomeoneElse: boolean,
    userAge?: number
  ) => {
    let finalPrice = basePrice;

    // Descuento del 5% si es para otra persona
    if (isForSomeoneElse) {
      finalPrice = finalPrice * 0.95;
    }

    // Descuento adicional por edad (ejemplo: mayores de 60 años)
    if (userAge && userAge >= 60) {
      finalPrice = finalPrice * 0.90; // 10% descuento adicional
    }

    return Math.round(finalPrice * 100) / 100; // Redondear a 2 decimales
  }, []);

  // Crear plan seleccionado con cálculos
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

  // Calcular ahorros
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
