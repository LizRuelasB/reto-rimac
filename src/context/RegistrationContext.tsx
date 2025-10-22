import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserData, SelectedPlanData, DocumentType } from '../types';

interface RegistrationContextType {
  userData: UserData | null;
  planData: SelectedPlanData | null;
  initialFormData: {
    documentType: DocumentType;
    documentNumber: string;
    phone: string;
  } | null;
  
  setUserDataAndInitialForm: (
    userData: UserData, 
    initialForm: { 
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
    }
  ) => void;
  setPlanData: (planData: SelectedPlanData) => void;
  resetRegistration: () => void;
}

export const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

interface RegistrationProviderProps {
  children: ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [planData, setPlanDataState] = useState<SelectedPlanData | null>(null);
  const [initialFormData, setInitialFormData] = useState<{
    documentType: DocumentType;
    documentNumber: string;
    phone: string;
  } | null>(null);

  const setUserDataAndInitialForm = (
    userData: UserData, 
    initialForm: { 
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
    }
  ) => {
    setUserData(userData);
    setInitialFormData(initialForm);
  };
  
  const setPlanData = (data: SelectedPlanData) => {
    setPlanDataState(data);
  };

  const resetRegistration = () => {
    setUserData(null);
    setPlanDataState(null);
    setInitialFormData(null);
  };

  const value = {
    userData,
    planData,
    initialFormData,
    setUserDataAndInitialForm,
    setPlanData,
    resetRegistration,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};