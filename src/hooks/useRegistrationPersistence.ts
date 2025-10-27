import { useEffect, useCallback } from 'react';
import { useRegistration } from '../context/RegistrationContext';

export const useRegistrationPersistence = () => {
  const { state, actions } = useRegistration();
  useEffect(() => {
    const registrationData = {
      userData: state.userData,
      planData: state.planData,
      initialFormData: state.initialFormData,
    };
    
    localStorage.setItem('registration-data', JSON.stringify(registrationData));
  }, [state.userData, state.planData, state.initialFormData]);

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
      console.log(error)
    }
  }, [actions]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem('registration-data');
    actions.resetRegistration();
  }, [actions]);

  return {
    loadFromStorage,
    clearStorage,
  };
};
