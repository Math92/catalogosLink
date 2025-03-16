import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles['compact-footer']}>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <a 
            href="https://www.instagram.com/ichigostore.uy?igsh=NjhocXY3MXBsNzFj" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles['social-link']}
          >
            <i className={`bi bi-instagram text-brand-pink ${styles['social-icon']}`}></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;