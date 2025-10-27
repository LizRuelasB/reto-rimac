import React from 'react';
import logo from '../../../assets/images/logos/logo-rimac.svg';
import phone from '../../../assets/icons/phone.svg';

import './Header.scss'

const Header: React.FC = () => {
  return (

    <header className="header">

      <div
        className="header__content
          max-w-7xl mx-auto
          px-6
          grid  gap-8 grid-cols-4 lg:grid-cols-12 
          items-center"
      >

        <div className='col-span-2 lg:col-span-6'>
          <img src={logo} alt="logo" />
        </div>

        <div className='col-span-2 lg:col-span-6 text-right'>
          <span className="hidden lg:inline text-xs">¡Compra por este medio!</span>
          <img src={phone} alt="teléfono" className="inline-block ml-2 w-4 h-4" />
          <span className="font-bold ml-2">(01) 411 6001</span>
        </div>

      </div>

    </header>

  );
};

export default Header;