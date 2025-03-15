import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';

const CatalogList = () => {
  const { catalogs, deleteCatalog } = useLocalDB();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Efecto para cargar y filtrar catálogos
  useEffect(() => {
    // Aplicar filtro de búsqueda
    const filtered = catalogs.filter(catalog => 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCatalogs(filtered);
    
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [catalogs, searchTerm]);
  
  // Manejador para eliminar catálogo
  const handleDelete = (catalogId) => {
    deleteCatalog(catalogId);
    setDeleteConfirm(null);
  };
  
  return (
    <div className="catalog-list-container">
      {/* Estilos específicos para esta vista */}
      <style>{`
        .catalog-list-container {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .search-container {
          position: relative;
          margin-bottom: 1rem;
        }
        
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        
        .search-input {
          padding-left: 35px;
          border-radius: 50px;
          border: 1px solid #dee2e6;
          width: 100%;
          max-width: 400px;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: #86b7fe;
        }
        
        .catalog-toolbar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }
        
        @media (min-width: 768px) {
          .catalog-toolbar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        
        .btn-add {
          white-space: nowrap;
          width: 100%;
          max-width: 400px;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 768px) {
          .btn-add {
            width: auto;
          }
        }
        
        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(25, 135, 84, 0.2);
        }
        
        .catalog-card {
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          background-color: white;
        }
        
        .catalog-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .catalog-header {
          padding: 0.75rem 1rem;
          background-color: #212529;
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .catalog-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        @media (min-width: 576px) {
          .catalog-body {
            flex-direction: row;
            align-items: center;
          }
        }
        
        .catalog-name {
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        
        .catalog-name i {
          margin-right: 0.5rem;
          color: #0d6efd;
        }
        
        .image-count {
          display: inline-flex;
          align-items: center;
          background-color: #0d6efd;
          color: white;
          border-radius: 50px;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
          margin-left: 0.75rem;
        }
        
        .image-count i {
          margin-right: 0.25rem;
        }
        
        .catalog-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        @media (min-width: 576px) {
          .catalog-actions {
            margin-top: 0;
            flex-wrap: nowrap;
          }
        }
        
        .btn-action {
          flex: 1;
          min-width: 80px;
          text-align: center;
          white-space: nowrap;
          border-radius: 0.25rem;
          padding: 0.375rem 0.5rem;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 576px) {
          .btn-action {
            flex: none;
          }
        }
        
        .btn-action i {
          margin-right: 0.25rem;
        }
        
        .btn-action:hover {
          transform: translateY(-2px);
        }
        
        .btn-images {
          background-color: #0d6efd;
          color: white;
          border: none;
        }
        
        .btn-images:hover {
          background-color: #0b5ed7;
          box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        }
        
        .btn-edit {
          background-color: #ffc107;
          color: #212529;
          border: none;
        }
        
        .btn-edit:hover {
          background-color: #ffca2c;
          box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
        }
        
        .btn-delete {
          background-color: #dc3545;
          color: white;
          border: none;
        }
        
        .btn-delete:hover {
          background-color: #bb2d3b;
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          margin-top: 1rem;
        }
        
        .empty-state i {
          font-size: 3rem;
          color: #dee2e6;
          margin-bottom: 1rem;
        }
        
        .delete-confirmation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          padding: 1rem;
          box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .delete-confirmation-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .delete-confirmation-actions button {
          flex: 1;
        }
        
        @media (min-width: 768px) {
          .delete-confirmation {
            width: 400px;
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
            border-radius: 0.5rem;
            animation: fadeInUp 0.3s ease-out;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        }
      `}</style>
      
      {/* Encabezado y barra de herramientas */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="fs-5 fw-bold mb-0">Gestión de Catálogos</h3>
      </div>
      
      <div className="catalog-toolbar">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar catálogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Link to="/admin/catalogs/create" className="btn btn-success btn-add">
          <i className="bi bi-plus-circle me-1"></i>
          Nuevo Catálogo
        </Link>
      </div>
      
      {/* Lista de catálogos */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando catálogos...</span>
          </div>
        </div>
      ) : (
        <>
          {filteredCatalogs.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-collection"></i>
              <h4>No hay catálogos</h4>
              <p className="text-muted">
                {searchTerm 
                  ? `No se encontraron catálogos que coincidan con "${searchTerm}"`
                  : 'Comienza creando un nuevo catálogo para tus productos.'}
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary mt-2"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
          
          {filteredCatalogs.map((catalog) => (
            <div key={catalog.id} className="catalog-card">
              <div className="catalog-header">
                <span>Catálogo</span>
              </div>
              <div className="catalog-body">
                <div className="catalog-name">
                  <i className="bi bi-collection"></i>
                  {catalog.name}
                  <span className="image-count">
                    <i className="bi bi-images"></i>
                    {catalog.images ? catalog.images.length : 0}
                  </span>
                </div>
                
                <div className="catalog-actions">
                  <Link 
                    to={`/admin/catalogs/${catalog.id}/images`}
                    className="btn btn-action btn-images"
                  >
                    <i className="bi bi-images"></i>
                    Imágenes
                  </Link>
                  
                  <Link 
                    to={`/admin/catalogs/edit/${catalog.id}`}
                    className="btn btn-action btn-edit"
                  >
                    <i className="bi bi-pencil"></i>
                    Editar
                  </Link>
                  
                  <button 
                    className="btn btn-action btn-delete"
                    onClick={() => setDeleteConfirm(catalog.id)}
                  >
                    <i className="bi bi-trash"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      
      {/* Ventana de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="delete-confirmation">
          <h5 className="mb-2">¿Eliminar este catálogo?</h5>
          <p className="text-muted mb-2">
            Esta acción no se puede deshacer y eliminará todas las imágenes asociadas.
          </p>
          <div className="delete-confirmation-actions">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleDelete(deleteConfirm)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogList;