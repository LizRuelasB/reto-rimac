import React, { 
  createContext, 
  useContext, 
  ReactNode, 
  useMemo, 
  useCallback,
  useReducer
} from 'react';
import { UserData, SelectedPlanData, DocumentType } from '../types';

// Types
export interface InitialFormData {
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
}

interface RegistrationState {
  userData: UserData | null;
  planData: SelectedPlanData | null;
  initialFormData: InitialFormData | null;
  isLoading: boolean;
  error: string | null;
}

type RegistrationAction =
  | { type: 'SET_USER_DATA_AND_FORM'; payload: { userData: UserData; initialForm: InitialFormData } }
  | { type: 'SET_PLAN_DATA'; payload: SelectedPlanData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_REGISTRATION' };

interface RegistrationContextType {
  // Estructura nueva
  state: RegistrationState;
  actions: {
    setUserDataAndInitialForm: (userData: UserData, initialForm: InitialFormData) => void;
    setPlanData: (planData: SelectedPlanData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetRegistration: () => void;
  };
  computed: {
    isRegistrationComplete: boolean;
    canProceedToPlans: boolean;
    registrationProgress: number;
  };
  
  // Compatibilidad con código existente - acceso directo a propiedades
  userData: UserData | null;
  planData: SelectedPlanData | null;
  initialFormData: InitialFormData | null;
  setUserDataAndInitialForm: (userData: UserData, initialForm: InitialFormData) => void;
  setPlanData: (planData: SelectedPlanData) => void;
  resetRegistration: () => void;
}

// Reducer function
const registrationReducer = (
  state: RegistrationState,
  action: RegistrationAction
): RegistrationState => {
  switch (action.type) {
    case 'SET_USER_DATA_AND_FORM':
      return {
        ...state,
        userData: action.payload.userData,
        initialFormData: action.payload.initialForm,
        error: null,
      };
    case 'SET_PLAN_DATA':
      return {
        ...state,
        planData: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET_REGISTRATION':
      return {
        userData: null,
        planData: null,
        initialFormData: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: RegistrationState = {
  userData: null,
  planData: null,
  initialFormData: null,
  isLoading: false,
  error: null,
};

// Context
export const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Provider Props
interface RegistrationProviderProps {
  children: ReactNode;
}

// Provider Component
export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  // Actions using useCallback (outside of useMemo)
  const setUserDataAndInitialForm = useCallback((userData: UserData, initialForm: InitialFormData) => {
    dispatch({
      type: 'SET_USER_DATA_AND_FORM',
      payload: { userData, initialForm }
    });
  }, []);
  
  const setPlanData = useCallback((planData: SelectedPlanData) => {
    dispatch({ type: 'SET_PLAN_DATA', payload: planData });
  }, []);
  
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);
  
  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);
  
  const resetRegistration = useCallback(() => {
    dispatch({ type: 'RESET_REGISTRATION' });
  }, []);

  // Memoized actions object
  const actions = useMemo(() => ({
    setUserDataAndInitialForm,
    setPlanData,
    setLoading,
    setError,
    resetRegistration,
  }), [setUserDataAndInitialForm, setPlanData, setLoading, setError, resetRegistration]);

  // Memoized computed values
  const computed = useMemo(() => ({
    isRegistrationComplete: Boolean(state.userData && state.planData),
    canProceedToPlans: Boolean(state.userData && state.initialFormData),
    registrationProgress: (() => {
      let progress = 0;
      if (state.initialFormData) progress += 33;
      if (state.userData) progress += 33;
      if (state.planData) progress += 34;
      return progress;
    })(),
  }), [state.userData, state.planData, state.initialFormData]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // Estructura nueva
    state,
    actions,
    computed,
    
    // Compatibilidad con código existente
    userData: state.userData,
    planData: state.planData,
    initialFormData: state.initialFormData,
    setUserDataAndInitialForm,
    setPlanData,
    resetRegistration,
  }), [state, actions, computed, setUserDataAndInitialForm, setPlanData, resetRegistration]);

  return (
    <RegistrationContext.Provider value={contextValue}>
      {children}
    </RegistrationContext.Provider>
  );
};

// Base hook
export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};

// Custom hooks for specific functionality
export const useRegistrationState = () => {
  const { state } = useRegistration();
  return state;
};

export const useRegistrationActions = () => {
  const { actions } = useRegistration();
  return actions;
};

export const useRegistrationComputed = () => {
  const { computed } = useRegistration();
  return computed;
};

// Custom hook for user data with validation
export const useUserData = () => {
  const { state, actions } = useRegistration();
  
  const setUserDataWithValidation = useCallback(
    (userData: UserData, initialForm: InitialFormData) => {
      // Validation logic
      if (!userData.name || !userData.lastName) {
        actions.setError('Nombre y apellido son requeridos');
        return false;
      }
      
      if (!initialForm.documentNumber || !initialForm.phone) {
        actions.setError('Documento y teléfono son requeridos');
        return false;
      }
      
      actions.setUserDataAndInitialForm(userData, initialForm);
      return true;
    },
    [actions]
  );

  return {
    userData: state.userData,
    initialFormData: state.initialFormData,
    setUserDataWithValidation,
    isUserDataComplete: Boolean(state.userData && state.initialFormData),
  };
};

// Custom hook for plan data with calculations
export const usePlanData = () => {
  const { state, actions } = useRegistration();
  
  const setPlanWithCalculations = useCallback(
    (plan: SelectedPlanData) => {
      // Apply discounts or calculations here
      const processedPlan = {
        ...plan,
        finalPrice: plan.isForSomeoneElse ? plan.price * 0.95 : plan.price, // 5% discount for others
      };
      
      actions.setPlanData(processedPlan);
    },
    [actions]
  );

  return {
    planData: state.planData,
    setPlanWithCalculations,
    isPlanSelected: Boolean(state.planData),
  };
};

// Custom hook for registration flow control
export const useRegistrationFlow = () => {
  const { state, actions, computed } = useRegistration();
  
  const goToNextStep = useCallback(() => {
    if (!computed.canProceedToPlans) {
      actions.setError('Complete los datos del usuario primero');
      return false;
    }
    return true;
  }, [computed.canProceedToPlans, actions]);

  const canFinishRegistration = useCallback(() => {
    return computed.isRegistrationComplete;
  }, [computed.isRegistrationComplete]);

  return {
    currentStep: (() => {
      if (!state.initialFormData) return 'login';
      if (!state.userData) return 'user-data';
      if (!state.planData) return 'plans';
      return 'summary';
    })(),
    progress: computed.registrationProgress,
    goToNextStep,
    canFinishRegistration,
    isLoading: state.isLoading,
    error: state.error,
  };
};