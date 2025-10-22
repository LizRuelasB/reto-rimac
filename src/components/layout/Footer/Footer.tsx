import React from 'react';
import logo from '../../../assets/images/logos/logo-light.svg';


import './Footer.scss'

const Footer: React.FC = () => {
  return (

    <footer className="footer">

      <div className="footer__content">
        <div >
          <img src={logo} alt="logo" />
        </div>

        <div className='footer__content__separator'></div>
        <div className="footer__content__contact ">
          <span className="footer__content__contact__text">
            © 2023 RIMAC Seguros y Reaseguros.
          </span>
        </div>
      </div>


    </footer>

  );
};

export default Footer;