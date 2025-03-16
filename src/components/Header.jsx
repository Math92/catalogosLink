import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={`fixed-top ${styles['compact-header']}`}>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <img 
                src="https://alquitones.s3.us-east-2.amazonaws.com/WhatsApp+Image+2025-03-15+at+8.43.25+PM.jpeg" 
                alt="Ichigo Store Logo" 
                className={`me-2 ${styles['brand-logo']}`}
              />
              <h1 className={`text-brand-pink ${styles['brand-text']}`}>
                Ichigo Store uy
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;