import React from 'react';
import './Home.scss';
import RegistrationForm from './RegistrationForm';
import { Footer, Header } from '../../components';

import heroFamily from '../../assets/images/logos/hero-family.svg';
import heroFamilyResponsive from '../../assets/images/logos/hero-family-responsive.svg';

import bgLeft from '../../assets/images/background/bg-left.svg';
import bgRight from '../../assets/images/background/bg-right.svg';


interface HomeProps {
  onNext: () => void;
}

const Home: React.FC<HomeProps> = ({ onNext }) => {

  return (
    <div className="home">
      
      <div className="home__bg-left">
        <img src={bgLeft} alt="" />
      </div>

      <div className="home__bg-right">
        <img src={bgRight} alt="" />
      </div>

      <Header></Header>


      <main className='home__main rimac-grid rimac-grid--desktop'>
        <div className='home__main__hero rimac-grid__item--desktop-6'>
          <img src={heroFamily} alt="" />
        </div>

        <div className='home__main__form rimac-grid__item--desktop-6'>
          <div className='home__main__form__content'>
           <div>
             <div className='tag'> Seguro Salud Flexible</div>

              <div className='home__main__form__title'>
                Creado para ti y tu familia
              </div>

           </div>
            <div className='hero-responsive'>
              <img src={heroFamilyResponsive} alt="" />
            </div>

          </div>

    
          <div className='separator'></div>
          <div className='home__main__form__description'>
              Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría. 100% online.
          </div>

          <div>
            <RegistrationForm onNext={onNext} />
          </div>
        </div>
      </main>

      <Footer></Footer>

    </div>
  )
}

export default Home;