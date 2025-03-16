import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-lg fixed-top">
      <div className="container py-2">
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <img 
                src="https://alquitones.s3.us-east-2.amazonaws.com/WhatsApp+Image+2025-03-15+at+8.43.25+PM.jpeg" 
                alt="Ichigo Store Logo" 
                className="me-3" 
                style={{ height: '45px', width: 'auto', borderRadius: '6px' }} 
              />
              <h1 className="text-brand-pink m-0 fs-3 fw-bold" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}>
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