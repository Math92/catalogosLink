import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './views/Home';
import Admin from './views/Admin';
import ViewCatalogo from './views/ViewCatalogo';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <header className="bg-dark text-white">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
              <Link className="navbar-brand" to="/">Catálogos App</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/catalogo">Ver Catálogos</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/catalogo" element={<ViewCatalogo />} />
            <Route path="/catalogo/:id" element={<ViewCatalogo />} />
          </Routes>
        </main>
        
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">© {new Date().getFullYear()} - Aplicación de Catálogos</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;