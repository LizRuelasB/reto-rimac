import React, { useEffect } from 'react';
import {
  useRegistration,
  useRegistrationFlow,
  useFormValidation,
  useRegistrationPersistence,
  useLoadingState,
  useErrorHandler,
} from '../../hooks';

// Ejemplo de componente que usa múltiples custom hooks
export const RegistrationFormExample: React.FC = () => {
  // Usando el nuevo hook de flow
  const {
    currentStep,
    progress,
    goToNextStep,
    canFinishRegistration,
    isLoading: contextLoading,
    error: contextError,
  } = useRegistrationFlow();

  // También se puede usar la estructura nueva
  const { state, actions, computed } = useRegistration();

  const {
    errors,
    validateLoginForm,
    clearErrors,
    hasErrors,
  } = useFormValidation();

  const { loadFromStorage, clearStorage } = useRegistrationPersistence();

  const {
    isLoading: localLoading,
    withLoading,
  } = useLoadingState();

  const {
    error: localError,
    handleError,
    clearError,
  } = useErrorHandler();

  // Cargar datos al montar el componente
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Ejemplo de uso combinado de hooks
  const handleSubmit = async (formData: any) => {
    clearErrors();
    clearError();

    const isValid = validateLoginForm(formData);
    if (!isValid) {
      handleError('Por favor corrige los errores del formulario');
      return;
    }

    try {
      await withLoading(async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!goToNextStep()) {
          throw new Error('No se puede proceder al siguiente paso');
        }
      });
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const isFormLoading = localLoading || contextLoading;
  const displayError = localError || contextError;

  return (
    <div className="registration-form">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <h2>Paso actual: {currentStep}</h2>
      
      {displayError && (
        <div className="error-message">
          {displayError}
        </div>
      )}
      
      {hasErrors && (
        <div className="validation-errors">
          {Object.entries(errors).map(([field, error]) => (
            <p key={field} className="error">
              {error}
            </p>
          ))}
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        // Extraer datos del formulario y llamar handleSubmit
      }}>
        {/* Campos del formulario aquí */}
        
        <button 
          type="submit" 
          disabled={isFormLoading}
          className="submit-button"
        >
          {isFormLoading ? 'Procesando...' : 'Continuar'}
        </button>
      </form>
      
      {canFinishRegistration() && (
        <button 
          onClick={() => {
            // Finalizar registro
          }}
          className="finish-button"
        >
          Finalizar Registro
        </button>
      )}
      
      <button 
        onClick={clearStorage}
        className="clear-button"
      >
        Limpiar Datos
      </button>
    </div>
  );
};
