import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import Login from './views/Login/Login';
import Plans from './views/Plans/Plans';
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