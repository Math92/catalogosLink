import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CatalogList from '../components/admin/CatalogList';
import CatalogForm from '../components/admin/CatalogForm';
import ImageList from '../components/admin/ImageList';
import ImageForm from '../components/admin/ImageForm';
import AdminSkeletonLoader from '../components/AdminSkeletonLoader';

const Admin = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  
  // Efecto para simular carga y aplicar animaciones
  useEffect(() => {
    // Simulamos tiempo de carga para mostrar el skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Activamos animación después de cargar
      setTimeout(() => setPageReady(true), 100);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // CSS para animaciones y transiciones - Mejoras para mobile-first
  const styles = `
    .admin-container {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s ease-out;
      padding: 0 0.75rem;
    }
    
    .admin-container.ready {
      opacity: 1;
      transform: translateY(0);
    }
    
    .nav-item-animated {
      transition: all 0.3s ease;
      margin-right: 0.25rem;
    }
    
    .nav-item-animated:hover {
      transform: translateY(-2px);
    }
    
    .nav-link {
      transition: all 0.3s ease;
      border-radius: 0;
      position: relative;
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
    }
    
    @media (min-width: 768px) {
      .nav-link {
        font-size: 1rem;
        padding: 0.5rem 1rem;
      }
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
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }
    
    @media (min-width: 768px) {
      .admin-title {
        font-size: 1.5rem;
      }
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
      font-size: 0.85rem;
      padding: 0.375rem 0.75rem;
    }
    
    @media (min-width: 768px) {
      .btn-home {
        font-size: 0.9rem;
      }
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
    
    .route-indicator {
      background-color: #f8f9fa;
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .route-indicator i {
      margin-right: 0.5rem;
      color: #6c757d;
    }
    
    .admin-content {
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Ajustes adicionales para componentes anidados */
    .table-responsive {
      border-radius: 0.375rem;
      overflow: hidden;
    }
    
    .card {
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  `;
  
  if (isLoading) {
    return <AdminSkeletonLoader />;
  }
  
  // Función para obtener el texto del indicador de ruta
  const getRouteIndicatorText = () => {
    if (location.pathname.includes('/catalogs/create')) return 'Crear catálogo';
    if (location.pathname.includes('/catalogs/edit')) return 'Editar catálogo';
    if (location.pathname.includes('/images/create')) return 'Añadir imagen';
    if (location.pathname.includes('/images/edit')) return 'Editar imagen';
    if (location.pathname.includes('/images') && !location.pathname.includes('/create') && !location.pathname.includes('/edit')) return 'Gestión de imágenes';
    if (location.pathname === '/admin/catalogs' || location.pathname === '/admin') return 'Listado de catálogos';
    return 'Panel de Administración';
  };
  
  return (
    <div className={`admin-container ${pageReady ? 'ready' : ''}`}>
      <style>{styles}</style>
      
      <div className="d-flex justify-content-between align-items-center mb-4 admin-header">
        <h2 className="admin-title mb-0">Panel de Administración</h2>
        <Link to="/" className="btn btn-outline-primary btn-home">
          <i className="bi bi-house-fill me-1"></i>
          <span className="d-none d-sm-inline">Ir al inicio</span>
          <span className="d-inline d-sm-none">Inicio</span>
        </Link>
      </div>
      
      {/* Navegación de admin - Mobile optimizada */}
      <div className="admin-tabs mb-3">
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
      
      {/* Indicador de ruta actual - mejorado para todos los dispositivos */}
      <div className="route-indicator mb-3">
        <i className="bi bi-geo-alt-fill"></i>
        <span>{getRouteIndicatorText()}</span>
      </div>
      
      {/* Contenido principal con animación de entrada */}
      <div className="admin-content pb-4">
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