import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import Home from './views/Home/Home';
import Plans from './views/Plans/Plans';
import Summary from './views/Summary/Summary';

const PATHS = {
  HOME: '/',
  PLANS: '/planes',
  SUMMARY: '/resumen',
};

const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  const { userData, planData, resetRegistration } = useRegistration();

  const navigateToPlans = () => navigate(PATHS.PLANS);
  const navigateToSummary = () => navigate(PATHS.SUMMARY);
  const navigateToHome = () => {
    resetRegistration();
    navigate(PATHS.HOME);
  };

  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Home onNext={navigateToPlans} />} />

      <Route 
        path={PATHS.PLANS} 
        element={
          userData ? (
            <Plans onNext={navigateToSummary} onBack={navigateToHome} />
          ) : (
            <Home onNext={navigateToPlans} />
          )
        } 
      />

      <Route 
        path={PATHS.SUMMARY} 
        element={
          userData && planData ? (
            <Summary onBack={navigateToPlans} />
          ) : (
            <Home onNext={navigateToPlans} />
          )
        } 
      />

      <Route path="*" element={<Home onNext={navigateToPlans} />} />
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