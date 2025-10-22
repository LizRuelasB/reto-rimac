import React, { useEffect, useState } from 'react';
import { Header, Steps } from '../../components';
import { REGISTRATION_STEPS, STEP_NUMBERS } from '../../constants/steps';
import './Plans.scss';

import protection from '../../assets/images/icons/icon-protection.svg';
import user from '../../assets/images/icons/icon-add-user.svg';
import { Plan, SelectedPlanData } from '../../types';
import { useRegistration } from '../../context/RegistrationContext';

import home from '../../assets/images/icons/icon-home.svg';
import clinic from '../../assets/images/icons/icon-clinic.svg';
import back from '../../assets/images/icons/icon-back.svg';

interface PlansProps {
  onNext: () => void;
  onBack: () => void;
}

type CoverageType = 'forMe' | 'forSomeoneElse' | null;

const Plans: React.FC<PlansProps> = ({ onBack, onNext }) => {

  const { userData, setPlanData } = useRegistration();

  const [selectedCoverage, setSelectedCoverage] = useState<CoverageType>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);


  const handleCoverageChange = (coverage: CoverageType) => {
    console.log(coverage)
    setSelectedCoverage(coverage);
  };

  useEffect(() => {

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rimac-front-end-challenge.netlify.app/api/plans.json');

        if (!response.ok) {
          throw new Error('Error al cargar los planes');
        }

        const data = await response.json();
        setPlans(data.list || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchPlans();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedCoverage && userData && plans.length > 0) {
      const filtered = plans.filter(plan => userData.age <= plan.age);
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans([]);
    }
  }, [selectedCoverage, userData, plans]);


  const getDiscountedPrice = (price: number): number => {
    if (selectedCoverage === 'forSomeoneElse') {
      return price * 0.95;
    }
    return price;
  };

  const handlePlanSelect = (plan: Plan) => {
    if (!selectedCoverage || !userData) return;

    const isForSomeoneElse = selectedCoverage === 'forSomeoneElse';
    const discount = isForSomeoneElse ? 0.05 : 0;
    const finalPrice = plan.price * (1 - discount);

    const selectedPlan: SelectedPlanData = {
      ...plan,
      finalPrice,
      isForSomeoneElse,
    };

    setPlanData(selectedPlan);
    onNext()
  };
  
  return (
    <>
    <Header />
      <div>
        <Steps onGoBack={onBack} steps={REGISTRATION_STEPS} currentStep={STEP_NUMBERS.PLANS} />
      </div>

    <div className="plans">
      

      <div className="rimac-grid rimac-grid--desktop">
        <div className="plans__link rimac-grid__item--desktop-2">
          <button
            type="button"
            onClick={onBack}
            className="plans__link__button"
          >
            <img src={back} alt="" /> Volver
          </button>
        </div>
      </div>

      <div className="rimac-grid rimac-grid--desktop">
        <div className='rimac-grid__item--desktop-12'>
          <div className='plans__content'>
            <h1 className="plans__content__title">
              {userData?.name} ¿Para quién deseas cotizar?
            </h1>
            <p className="plans__content__subtitle">
              Selecciona la opción que se ajuste más a tus necesidades.
            </p>

            <div className="plans__content__cards">

              <div className="plans__content__cards__item">
                <input
                  type="radio"
                  id="forMe"
                  name="coverage"
                  value="forMe"
                  checked={selectedCoverage === 'forMe'}
                  onChange={() => handleCoverageChange('forMe')}
                  className="plans__content__cards__item__radio"
                />
                <label htmlFor="forMe" className="plans__content__cards__card">
                  <div className='plans__content__cards__card__circle'>

                  </div>
                  <div className="plans__content__cards__card__icon">
                    <img src={protection} alt="protection" />
                  </div>
                  <span className="plans__content__cards__card__title">Para mí</span>
                  <p className="plans__content__cards__card__description">Cotiza tu seguro de salud y agrega familiares si así lo deseas.</p>
                </label>
              </div>

              <div className="plans__content__cards__item">
                <input
                  type="radio"
                  id="forSomeoneElse"
                  name="coverage"
                  value="forSomeoneElse"
                  checked={selectedCoverage === 'forSomeoneElse'}
                  onChange={() => handleCoverageChange('forSomeoneElse')}
                  className="plans__content__cards__item__radio"
                />
                <label htmlFor="forSomeoneElse" className="plans__content__cards__card">
                  <div className='plans__content__cards__card__circle'>

                  </div>

                  <div className="plans__content__cards__card__icon">
                    <img src={user} alt="user" />
                  </div>
                  <span className="plans__content__cards__card__title">Para alguien más</span>
                  <p className="plans__content__cards__card__description">Realiza una cotización para uno de tus familiares o cualquier persona.</p>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>


      <div className="rimac-grid rimac-grid--desktop">

        {loading && (
          <div className="plans__loading">
            Cargando planes disponibles...
          </div>
        )}

        <div className="rimac-grid__item--desktop-2-12">
          <div className='plans__cards'>
            {filteredPlans.map((plan, index) => (
              <div
                key={index}
                className="plans__cards__plan-card"
              >


                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderBottom: '1px solid #D7DBF5',
                  paddingBottom: '24px'
                }}>
                  <div>
                    <div className="plans__cards__plan-card__header">
                      <h3>{plan.name}</h3>
                    </div>

                    <div className="plans__cards__plan-card__price">
                      <span className="plans__cards__plan-card__price__text">
                        Costo del plan
                        </span>
                      {selectedCoverage === 'forSomeoneElse' && (
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
                    <img src={ plan.name.includes('Clínica') ? clinic : home} alt="icon" />
                  </div>
                </div>



                <ul className="plans__cards__plan-card__features">
                  {plan.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
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
        </div>

      </div>
    </div>
    </>
  );
};

export default Plans;