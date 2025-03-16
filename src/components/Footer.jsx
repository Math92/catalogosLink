import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-5 py-3">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <a 
            href="https://www.instagram.com/ichigostore.uy?igsh=NjhocXY3MXBsNzFj" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-instagram text-brand-pink" style={{ fontSize: '2rem' }}></i>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;