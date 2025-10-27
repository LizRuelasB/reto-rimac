import { useEffect, useCallback } from 'react';
import { useRegistration } from '../context/RegistrationContext';

// Custom hook para persistir datos en localStorage
export const useRegistrationPersistence = () => {
  const { state, actions } = useRegistration();

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    const registrationData = {
      userData: state.userData,
      planData: state.planData,
      initialFormData: state.initialFormData,
    };
    
    localStorage.setItem('registration-data', JSON.stringify(registrationData));
  }, [state.userData, state.planData, state.initialFormData]);

  // Cargar datos desde localStorage al inicializar
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('registration-data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.userData && data.initialFormData) {
          actions.setUserDataAndInitialForm(data.userData, data.initialFormData);
        }
        if (data.planData) {
          actions.setPlanData(data.planData);
        }
      }
    } catch (error) {
      console.error('Error loading registration data from storage:', error);
    }
  }, [actions]);

  // Limpiar localStorage
  const clearStorage = useCallback(() => {
    localStorage.removeItem('registration-data');
    actions.resetRegistration();
  }, [actions]);

  return {
    loadFromStorage,
    clearStorage,
  };
};
