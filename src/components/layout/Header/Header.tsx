import React from 'react';
import logo from '../../../assets/images/logos/logo-rimac.svg';
import phone from '../../../assets/images/icons/phone.svg';

import './Header.scss'

const Header: React.FC = () => {
  return (

    <header className="header">

      <div >
        <img src={logo} alt="logo" />
      </div>
      <div className="header__contact ">
        <span className="header__contact__text">¡Compra por este medio!</span>

        <span className="header__contact__logo"><img src={phone} alt="" /> (01) 411 6001</span>
      </div>

    </header>

  );
};

export default Header;