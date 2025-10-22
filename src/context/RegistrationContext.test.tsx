import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegistrationProvider, useRegistration } from './RegistrationContext';
import { UserData, SelectedPlanData, DocumentType } from '../types';

const TestComponent: React.FC = () => {
  const {
    userData,
    planData,
    initialFormData,
    setUserDataAndInitialForm,
    setPlanData,
    resetRegistration,
  } = useRegistration();

  return (
    <div>
      <div data-testid="user-data">{userData ? JSON.stringify(userData) : 'null'}</div>
      <div data-testid="plan-data">{planData ? JSON.stringify(planData) : 'null'}</div>
      <div data-testid="initial-form-data">{initialFormData ? JSON.stringify(initialFormData) : 'null'}</div>
      
      <button
        data-testid="set-user-data"
        onClick={() => {
          const mockUserData: UserData = {
            name: 'Juan',
            lastName: 'Pérez',
            birthDay: '1990-01-01',
            documentType: 'DNI' as DocumentType,
            documentNumber: '12345678',
            phone: '987654321',
            age: 33
          };
          const mockInitialForm = {
            documentType: 'DNI' as DocumentType,
            documentNumber: '12345678',
            phone: '987654321'
          };
          setUserDataAndInitialForm(mockUserData, mockInitialForm);
        }}
      >
        Set User Data
      </button>
      
      <button
        data-testid="set-plan-data"
        onClick={() => {
          const mockPlanData: SelectedPlanData = {
            name: 'Plan Básico',
            price: 99,
            description: ['Cobertura básica'],
            age: 33,
            finalPrice: 89,
            isForSomeoneElse: false
          };
          setPlanData(mockPlanData);
        }}
      >
        Set Plan Data
      </button>
      
      <button data-testid="reset" onClick={resetRegistration}>
        Reset
      </button>
    </div>
  );
};

const TestComponentOutsideProvider: React.FC = () => {
  try {
    useRegistration();
    return <div data-testid="no-error">No error</div>;
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>;
  }
};

describe('RegistrationContext', () => {
  describe('RegistrationProvider', () => {
    it('should initialize with null values', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(screen.getByTestId('plan-data')).toHaveTextContent('null');
      expect(screen.getByTestId('initial-form-data')).toHaveTextContent('null');
    });

    it('should update userData and initialFormData when setUserDataAndInitialForm is called', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      act(() => {
        screen.getByTestId('set-user-data').click();
      });

      const expectedUserData = {
        name: 'Juan',
        lastName: 'Pérez',
        birthDay: '1990-01-01',
        documentType: 'DNI',
        documentNumber: '12345678',
        phone: '987654321',
        age: 33
      };

      const expectedInitialForm = {
        documentType: 'DNI',
        documentNumber: '12345678',
        phone: '987654321'
      };

      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(expectedUserData));
      expect(screen.getByTestId('initial-form-data')).toHaveTextContent(JSON.stringify(expectedInitialForm));
    });

    it('should update planData when setPlanData is called', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      act(() => {
        screen.getByTestId('set-plan-data').click();
      });

      const expectedPlanData = {
        name: 'Plan Básico',
        price: 99,
        description: ['Cobertura básica'],
        age: 33,
        finalPrice: 89,
        isForSomeoneElse: false
      };

      expect(screen.getByTestId('plan-data')).toHaveTextContent(JSON.stringify(expectedPlanData));
    });

    it('should reset all data when resetRegistration is called', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      act(() => {
        screen.getByTestId('set-user-data').click();
      });

      act(() => {
        screen.getByTestId('set-plan-data').click();
      });


      expect(screen.getByTestId('user-data')).not.toHaveTextContent('null');
      expect(screen.getByTestId('plan-data')).not.toHaveTextContent('null');
      expect(screen.getByTestId('initial-form-data')).not.toHaveTextContent('null');


      act(() => {
        screen.getByTestId('reset').click();
      });

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(screen.getByTestId('initial-form-data')).toHaveTextContent('null');
    });
  });

  describe('useRegistration hook', () => {
    it('should throw error when used outside RegistrationProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<TestComponentOutsideProvider />);

      expect(screen.getByTestId('error')).toHaveTextContent(
        'useRegistration must be used within a RegistrationProvider'
      );

      consoleSpy.mockRestore();
    });

    it('should return context value when used within RegistrationProvider', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      expect(screen.getByTestId('user-data')).toBeInTheDocument();
      expect(screen.getByTestId('plan-data')).toBeInTheDocument();
      expect(screen.getByTestId('initial-form-data')).toBeInTheDocument();
    });
  });

  describe('Integration tests', () => {
    it('should handle complete registration flow', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(screen.getByTestId('plan-data')).toHaveTextContent('null');

      act(() => {
        screen.getByTestId('set-user-data').click();
      });

      expect(screen.getByTestId('user-data')).not.toHaveTextContent('null');
      expect(screen.getByTestId('initial-form-data')).not.toHaveTextContent('null');

      act(() => {
        screen.getByTestId('set-plan-data').click();
      });

      expect(screen.getByTestId('plan-data')).not.toHaveTextContent('null');

      act(() => {
        screen.getByTestId('reset').click();
      });

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(screen.getByTestId('plan-data')).toHaveTextContent('null');
      expect(screen.getByTestId('initial-form-data')).toHaveTextContent('null');
    });

    it('should handle multiple plan updates', () => {
      render(
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      );

      act(() => {
        screen.getByTestId('set-plan-data').click();
      });

      const firstPlanData = screen.getByTestId('plan-data').textContent;

      act(() => {
        screen.getByTestId('set-plan-data').click();
      });

      const secondPlanData = screen.getByTestId('plan-data').textContent;

      expect(firstPlanData).toBe(secondPlanData);
      expect(secondPlanData).not.toBe('null');
    });
  });
});