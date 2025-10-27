import React from 'react';
import logo from '../../../assets/images/logos/logo-light.svg';


import './Footer.scss'

const Footer: React.FC = () => {
  return (

    <footer className="footer py-8 ">

      <div className="footer__content
        max-w-7xl mx-auto
          px-6
          lg:grid  lg:gap-8  lg:grid-cols-12 
          items-center
        ">
        <div className=' lg:col-span-6' >
          <img src={logo} alt="logo" />
        </div>

        <div className='footer__content__separator'></div>
        <div className=" lg:col-span-6 text-right footer__content__contact ">
          <span className="footer__content__contact__text">
            © 2023 RIMAC Seguros y Reaseguros.
          </span>
        </div>
      </div>


    </footer>

  );
};

export default Footer;