import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import { useRegistrationPersistence, useSessionTimeout } from './hooks';
import Login from './views/Login/Login';
import Plans from './views/Plans';
import Summary from './views/Summary/Summary';
import './App.scss';

const PATHS = {
  LOGIN: '/',
  PLANS: '/planes',
  SUMMARY: '/resumen',
};

const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  const { userData, planData, resetRegistration } = useRegistration();
  const { loadFromStorage, clearStorage } = useRegistrationPersistence();
  const { isExpired, resetTimer } = useSessionTimeout(30);
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isExpired) {
      clearStorage();
      navigate(PATHS.LOGIN);
    }
  }, [isExpired, clearStorage, navigate]);

  useEffect(() => {
    if (userData || planData) {
      resetTimer();
    }
  }, [userData, planData, resetTimer]);

  const navigateToPlans = () => navigate(PATHS.PLANS);
  const navigateToSummary = () => navigate(PATHS.SUMMARY);
  const navigateToLogin = () => {
    resetRegistration();
    navigate(PATHS.LOGIN);
  };

  return (
    <Routes>
      
      <Route path={PATHS.LOGIN} element={<Login onNext={navigateToPlans} />} />

      <Route 
        path={PATHS.PLANS} 
        element={
          userData ? (
            <Plans onNext={navigateToSummary} onBack={navigateToLogin} />
          ) : (
            <Login onNext={navigateToPlans} />
          )
        } 
      />

      <Route 
        path={PATHS.SUMMARY} 
        element={
          userData && planData ? (
            <Summary onBack={navigateToPlans} />
          ) : (
            <Login onNext={navigateToPlans} />
          )
        } 
      />

      <Route path="*" element={<Login onNext={navigateToPlans} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <RegistrationProvider>
      <AppRouter />
    </RegistrationProvider>
  );
};

export default App;