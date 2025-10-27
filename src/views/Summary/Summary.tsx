import React from 'react';
import { Header, Steps } from '../../components';
import { REGISTRATION_STEPS, STEP_NUMBERS } from '../../constants/steps';
import './Summary.scss'
import { useRegistration } from '../../context/RegistrationContext';

import family from '../../assets/icons/icon-family.svg';
import back from '../../assets/icons/icon-back.svg';
import { SummaryProps } from './types';

const Summary: React.FC<SummaryProps> = ({onBack}) => {
  const { userData, planData, initialFormData } = useRegistration();

  if (!userData || !planData || !initialFormData) {
    return null;
  }
  
  return (
    <>
     <Header />
      <div className='summary__steps'>
        <Steps steps={REGISTRATION_STEPS} currentStep={STEP_NUMBERS.SUMMARY} />
      </div>


    <div className="summary">

      <div className='summary__content'>
        <button
            type="button"
            onClick={onBack}
            className="summary__link--button"
          >
            <img src={back} alt="" /> Volver
          </button>

        <h1>Resumen del seguro </h1>

        <div className='summary__content__card'>
          <div className='summary__content__card__header'>
            <span className='summary__content__card__header__title'>Precios calculados para:</span>
            <div className='summary__content__card__header__name'>
              <img src={family} alt="icon" />
              <span>{userData.name} {userData.lastName}</span>
            </div>
          </div>

          <div className='summary__content__card__info'>
              <div>Responsable de pago</div>
              <span>{initialFormData.documentType}: {initialFormData.documentNumber}</span>
              <span>Celular: {initialFormData.phone}</span>
          </div>

          <div className='summary__content__card__info'>
            <div>Plan elegido</div>
            <span>{planData.name}</span>
            <span>Costo del Plan: ${planData.finalPrice} al mes</span>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Summary;