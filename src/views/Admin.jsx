import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CatalogList from '../components/admin/CatalogList';
import CatalogForm from '../components/admin/CatalogForm';
import ImageList from '../components/admin/ImageList';
import ImageForm from '../components/admin/ImageForm';

const Admin = () => {
  const location = useLocation();
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administración</h2>
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-house-fill me-2"></i>
          Ir al inicio
        </Link>
      </div>
      
      {/* Navegación de admin */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <Link 
            to="/admin/catalogs" 
            className={`nav-link ${location.pathname.includes('/admin/catalogs') || location.pathname === '/admin' ? 'active' : ''}`}
          >
            <i className="bi bi-collection me-2"></i>
            Catálogos
          </Link>
        </li>
      </ul>
      
      {/* Rutas anidadas */}
      <Routes>
        <Route path="/" element={<Navigate to="/admin/catalogs" />} />
        <Route path="catalogs" element={<CatalogList />} />
        <Route path="catalogs/create" element={<CatalogForm />} />
        <Route path="catalogs/edit/:id" element={<CatalogForm />} />
        <Route path="catalogs/:catalogId/images" element={<ImageList />} />
        <Route path="catalogs/:catalogId/images/create" element={<ImageForm />} />
        <Route path="catalogs/:catalogId/images/edit/:imageId" element={<ImageForm />} />
      </Routes>
    </div>
  );
};

export default Admin;