import React from 'react';
import './Login.scss';
import { Footer, Header } from '../../components';
import heroFamilyResponsive from '../../assets/images/logos/hero-family-responsive.svg';
import heroFamily from '../../assets/images/logos/hero-family.svg';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import { LoginProps } from './types';
import bgLeft from '../../assets/images/background/bg-left.svg';
import bgRight from '../../assets/images/background/bg-right.svg';

const Login: React.FC<LoginProps> = ({ onNext }) => {

  return (
    <div className='relative min-h-screen flex flex-col'>
      <img className='absolute bottom-0 left-0 -z-10 w-auto h-auto' src={bgLeft} alt="" />
      <Header></Header>
      <div className='max-w-7xl mx-auto px-6 gap-3 lg:grid-cols-12 lg:grid pb-[64px] flex-grow'>


        <div className='hidden lg:block lg:col-span-6 lg:py-8'>

          <img src={heroFamily} alt="" />

        </div>

        <div className='my-auto lg:col-span-6 lg:m-0 lg:p-8'>

          <div className='login__content'>
            <div>
              <div className='tag'> Seguro Salud Flexible</div>

              <div className='login__content__title'>
                Creado para ti y tu familia
              </div>
            </div>

            <div className='lg:hidden'>
              <img src={heroFamilyResponsive} alt="" />
            </div>

          </div>

          <div className='login__separator pt-6 mb-6 lg:hidden'></div>


          <div className='login__form'>
            <div className='login__content__description'>
              Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría. 100% online.
            </div>

            <div>
              <RegistrationForm onNext={onNext} />
            </div>
          </div>

        </div>
      </div>
      <img className='absolute -top-[50%] lg:top-0 right-0 -z-10' src={bgRight} alt="" />
      <Footer></Footer>

    </div>
  )
}

export default Login;