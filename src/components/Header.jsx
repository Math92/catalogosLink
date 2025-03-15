import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary p-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h1 className="text-white m-0">
              <i className="bi bi-collection me-2"></i>
              Catálogos App
            </h1>
          </Link>
          <Link to="/admin" className="btn btn-outline-light">
            <i className="bi bi-gear-fill me-2"></i>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;