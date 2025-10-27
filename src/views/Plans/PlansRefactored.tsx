import React, { useEffect, useState } from 'react';
import { Header, Steps } from '../../components';
import { REGISTRATION_STEPS, STEP_NUMBERS } from '../../constants/steps';
import { PLAN_CONFIG, PLAN_BOLD_CONFIG } from '../../constants/plans';
import { usePlans } from '../../hooks';
import { useRegistration } from '../../context/RegistrationContext';
import { formatTextWithBoldString } from '../../utils/helpers';
import { Plan, SelectedPlanData } from '../../types';
import './Plans.scss';

import protection from '../../assets/icons/icon-protection.svg';
import user from '../../assets/icons/icon-add-user.svg';
import home from '../../assets/icons/icon-home.svg';
import clinic from '../../assets/icons/icon-clinic.svg';
import back from '../../assets/icons/icon-back.svg';

import { PlansProps, CoverageType } from './types';

const PlansRefactored: React.FC<PlansProps> = ({ onBack, onNext }) => {
  const { userData, setPlanData } = useRegistration();
  const { 
    filteredPlans, 
    isLoading, 
    error, 
    fetchPlans, 
    filterPlansByAge, 
    calculateDiscountedPrice 
  } = usePlans();

  const [selectedCoverage, setSelectedCoverage] = useState<CoverageType>(null);

  useEffect(() => {
    if (userData) {
      fetchPlans();
    }
  }, [userData, fetchPlans]);

  useEffect(() => {
    if (selectedCoverage && userData) {
      filterPlansByAge(userData.age);
    }
  }, [selectedCoverage, userData, filterPlansByAge]);

  const handleCoverageChange = (coverage: CoverageType) => {
    setSelectedCoverage(coverage);
  };

  const getDiscountedPrice = (price: number): number => {
    const isForSomeoneElse = selectedCoverage === PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE;
    return calculateDiscountedPrice(price, isForSomeoneElse);
  };

  const renderFormattedText = (text: string, boldString: string) => {
    const formatted = formatTextWithBoldString(text, boldString);
    
    if (!formatted.hasBold) {
      return text;
    }

    return (
      <>
        {formatted.beforeBold}
        <b>{formatted.boldPart}</b>
        {formatted.afterBold}
      </>
    );
  };

  const handlePlanSelect = (plan: Plan) => {
    if (!selectedCoverage || !userData) return;

    const isForSomeoneElse = selectedCoverage === PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE;
    const finalPrice = getDiscountedPrice(plan.price);

    const selectedPlan: SelectedPlanData = {
      ...plan,
      finalPrice,
      isForSomeoneElse,
    };

    setPlanData(selectedPlan);
    onNext();
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="plans max-w-7xl mx-auto px-6 pt-8">
          <div className="plans__error">
            <p>Error al cargar los planes: {error}</p>
            <button onClick={fetchPlans} className="plans__retry-button">
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div>
        <Steps onGoBack={onBack} steps={REGISTRATION_STEPS} currentStep={STEP_NUMBERS.PLANS} />
      </div>

      <div className="plans max-w-7xl mx-auto px-6 pt-8 items-center lg:pt-10">
        
        <div className="plans__link hidden lg:block pb-14">
          <button
            type="button"
            onClick={onBack}
            className="plans__link__button"
          >
            <img src={back} alt="" /> Volver
          </button>
        </div>

        <div className="plans__content">
          <h1 className="plans__content__title lg:text-center">
            {userData?.name} ¿Para quién deseas cotizar?
          </h1>
          <p className="plans__content__subtitle lg:text-center">
            Selecciona la opción que se ajuste más a tus necesidades.
          </p>

          <div className="plans__content__cards grid gap-8 lg:grid-cols-2">
            <div className="plans__content__cards__item">
              <input
                type="radio"
                id="forMe"
                name="coverage"
                value={PLAN_CONFIG.COVERAGE_TYPES.FOR_ME}
                checked={selectedCoverage === PLAN_CONFIG.COVERAGE_TYPES.FOR_ME}
                onChange={() => handleCoverageChange(PLAN_CONFIG.COVERAGE_TYPES.FOR_ME)}
                className="plans__content__cards__item__radio"
              />
              <label htmlFor="forMe" className="plans__content__cards__card">
                <div className='plans__content__cards__card__circle'></div>
                <div className="plans__content__cards__card__icon">
                  <img src={protection} alt="protection" />
                </div>
                <span className="plans__content__cards__card__title">Para mí</span>
                <p className="plans__content__cards__card__description">
                  Cotiza tu seguro de salud y agrega familiares si así lo deseas.
                </p>
              </label>
            </div>

            <div className="plans__content__cards__item">
              <input
                type="radio"
                id="forSomeoneElse"
                name="coverage"
                value={PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE}
                checked={selectedCoverage === PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE}
                onChange={() => handleCoverageChange(PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE)}
                className="plans__content__cards__item__radio"
              />
              <label htmlFor="forSomeoneElse" className="plans__content__cards__card">
                <div className='plans__content__cards__card__circle'></div>
                <div className="plans__content__cards__card__icon">
                  <img src={user} alt="user" />
                </div>
                <span className="plans__content__cards__card__title">Para alguien más</span>
                <p className="plans__content__cards__card__description">
                  Realiza una cotización para uno de tus familiares o cualquier persona.
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className='max-w-7xl px-6'>
          <div className='plans__cards'>
            {filteredPlans.map((plan, index) => (
              <div key={index} className="plans__cards__plan-card">
                <div className='plans__cards__plan-card__head'>
                  <div>
                    <div className="plans__cards__plan-card__header">
                      <h3>{plan.name}</h3>
                    </div>

                    <div className="plans__cards__plan-card__price">
                      <span className="plans__cards__plan-card__price__text">
                        Costo del plan
                      </span>
                      {selectedCoverage === PLAN_CONFIG.COVERAGE_TYPES.FOR_SOMEONE_ELSE && (
                        <span className="plans__cards__plan-card__price--original">
                          ${plan.price} antes
                        </span>
                      )}
                      <div>
                        <span className="plans__cards__plan-card__price--final">
                          ${getDiscountedPrice(plan.price)} al mes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <img src={plan.name.includes('Clínica') ? clinic : home} alt="icon" />
                  </div>
                </div>

                <ul className="plans__cards__plan-card__features">
                  {plan.description.map((desc, idx) => {
                    const planBoldConfig = PLAN_BOLD_CONFIG[plan.name] || [];
                    const boldString = planBoldConfig[idx] || '';
                    
                    return (
                      <li key={idx}>
                        {renderFormattedText(desc, boldString)}
                      </li>
                    );
                  })}
                </ul>

                <button
                  className="plans__cards__plan-card__button"
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                >
                  Seleccionar Plan
                </button>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="plans__loading">
              Cargando planes disponibles...
            </div>
          )}
        </div> 
      </div>
    </>
  );
};

export default PlansRefactored;
