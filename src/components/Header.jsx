import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary p-3 shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <i className="bi bi-collection fs-3 text-white me-2"></i>
              <h1 className="text-white m-0 fs-4">Catálogos App</h1>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;