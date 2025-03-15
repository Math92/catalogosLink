import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CatalogList from '../components/admin/CatalogList';
import CatalogForm from '../components/admin/CatalogForm';
import ImageList from '../components/admin/ImageList';
import ImageForm from '../components/admin/ImageForm';

const Admin = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  
  // Efecto para simular carga y aplicar animaciones
  useEffect(() => {
    // Simulamos tiempo de carga para mostrar el spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Activamos animación después de cargar
      setTimeout(() => setPageReady(true), 100);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // CSS para animaciones y transiciones
  const styles = `
    .admin-container {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s ease-out;
    }
    
    .admin-container.ready {
      opacity: 1;
      transform: translateY(0);
    }
    
    .nav-item-animated {
      transition: all 0.3s ease;
    }
    
    .nav-item-animated:hover {
      transform: translateY(-2px);
    }
    
    .nav-link {
      transition: all 0.3s ease;
      border-radius: 0;
      position: relative;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 3px;
      background-color: #0d6efd;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    .nav-link.active::after {
      width: 100%;
    }
    
    .nav-link:hover::after {
      width: 80%;
    }
    
    .admin-title {
      position: relative;
      display: inline-block;
    }
    
    .admin-title::after {
      content: '';
      position: absolute;
      width: 40%;
      height: 3px;
      background-color: #0d6efd;
      bottom: -8px;
      left: 0;
      transition: width 0.3s ease;
    }
    
    .admin-container.ready .admin-title::after {
      width: 100%;
    }
    
    .btn-home {
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    
    .btn-home::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      transition: all 0.4s ease;
    }
    
    .btn-home:hover::before {
      left: 100%;
    }
    
    @media (max-width: 767.98px) {
      .admin-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 1rem;
      }
      
      .admin-tabs {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      
      .admin-tabs::-webkit-scrollbar {
        display: none;
      }
    }
  `;
  
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center my-5 py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando panel de administración...</span>
        </div>
        <p className="text-muted">Cargando panel de administración...</p>
      </div>
    );
  }
  
  return (
    <div className={`admin-container ${pageReady ? 'ready' : ''}`}>
      <style>{styles}</style>
      
      <div className="d-flex justify-content-between align-items-center mb-4 admin-header">
        <h2 className="admin-title mb-0">Panel de Administración</h2>
        <Link to="/" className="btn btn-outline-primary btn-home">
          <i className="bi bi-house-fill me-2"></i>
          Ir al inicio
        </Link>
      </div>
      
      {/* Navegación de admin - Mobile optimizada */}
      <div className="admin-tabs mb-4">
        <ul className="nav nav-tabs border-bottom">
          <li className="nav-item nav-item-animated">
            <Link 
              to="/admin/catalogs" 
              className={`nav-link ${location.pathname.includes('/admin/catalogs') || location.pathname === '/admin' ? 'active' : ''}`}
            >
              <i className="bi bi-collection me-1"></i>
              <span>Catálogos</span>
            </Link>
          </li>
          {/* Se pueden agregar más pestañas aquí en el futuro */}
        </ul>
      </div>
      
      {/* Indicador de ruta actual - visible solo en móvil */}
      <div className="d-md-none mb-3">
        <div className="bg-light rounded p-2 text-muted small">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {location.pathname.includes('/catalogs/create') && 'Crear catálogo'}
          {location.pathname.includes('/catalogs/edit') && 'Editar catálogo'}
          {location.pathname.includes('/images/create') && 'Añadir imagen'}
          {location.pathname.includes('/images/edit') && 'Editar imagen'}
          {location.pathname.includes('/images') && !location.pathname.includes('/create') && !location.pathname.includes('/edit') && 'Gestión de imágenes'}
          {location.pathname === '/admin/catalogs' && 'Listado de catálogos'}
          {location.pathname === '/admin' && 'Listado de catálogos'}
        </div>
      </div>
      
      {/* Contenido principal con animación de entrada */}
      <div className="admin-content">
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
    </div>
  );
};

export default Admin;