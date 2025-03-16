import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';
import AdminSkeletonLoader from '../AdminSkeletonLoader';

const ImageList = () => {
  const { catalogId } = useParams();
  const navigate = useNavigate();
  const { getCatalog, deleteImage } = useLocalDB();
  
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    const loadCatalog = () => {
      setLoading(true);
      // Simulamos tiempo de carga para mostrar el skeleton loader
      setTimeout(() => {
        const foundCatalog = getCatalog(catalogId);
        
        if (!foundCatalog) {
          navigate('/admin/catalogs');
          return;
        }
        
        setCatalog(foundCatalog);
        setLoading(false);
      }, 600);
    };
    
    loadCatalog();
  }, [catalogId, getCatalog, navigate]);
  
  // Filtramos las imágenes basadas en el término de búsqueda
  const filteredImages = catalog?.images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.price.toString().includes(searchTerm)
  ) || [];
  
  // Función para manejar la eliminación de imágenes
  const handleDelete = (imageId) => {
    deleteImage(catalogId, imageId);
    setDeleteConfirm(null);
    
    // Actualizamos el catálogo después de eliminar
    const updatedCatalog = getCatalog(catalogId);
    setCatalog(updatedCatalog);
  };
  
  if (loading) {
    return <AdminSkeletonLoader />;
  }
  
  if (!catalog) {
    return (
      <div className="alert alert-warning">
        <h4>Catálogo no encontrado</h4>
        <p>El catálogo que intentas acceder no existe o ha sido eliminado.</p>
        <Link to="/admin/catalogs" className="btn btn-primary mt-2">
          <i className="bi bi-arrow-left me-1"></i>
          Volver a catálogos
        </Link>
      </div>
    );
  }
  
  return (
    <div className="image-list-container">
      {/* Estilos específicos para esta vista */}
      <style>{`
        .image-list-container {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .catalog-badge {
          display: inline-flex;
          align-items: center;
          background-color: #0d6efd;
          color: white;
          border-radius: 50px;
          padding: 0.25rem 0.75rem;
          font-size: 0.85rem;
          margin-left: 0.75rem;
        }
        
        .image-toolbar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }
        
        @media (min-width: 768px) {
          .image-toolbar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        
        .search-container {
          position: relative;
          margin-bottom: 0.5rem;
          width: 100%;
          max-width: 400px;
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
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: #86b7fe;
        }
        
        .btn-actions {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          max-width: 400px;
        }
        
        @media (min-width: 768px) {
          .btn-actions {
            width: auto;
          }
        }
        
        .btn-back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .btn-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .btn-add:hover, .btn-back:hover {
          transform: translateY(-2px);
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
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        @media (max-width: 340px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .image-card {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          background-color: white;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .image-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .image-card-header {
          background-color: #212529;
          color: white;
          padding: 0.5rem 1rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .image-preview {
          aspect-ratio: 3/2;
          overflow: hidden;
          position: relative;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        
        .image-card:hover .image-preview img {
          transform: scale(1.05);
        }
        
        .image-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .image-name {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .image-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0d6efd;
          margin-bottom: 1rem;
        }
        
        .image-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        
        .btn-image-action {
          flex: 1;
          text-align: center;
          white-space: nowrap;
          font-size: 0.85rem;
          border-radius: 0.25rem;
          transition: all 0.3s ease;
        }
        
        .btn-image-action i {
          margin-right: 0.25rem;
        }
        
        .btn-image-action:hover {
          transform: translateY(-2px);
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-2">
        <div>
          <h3 className="fs-5 fw-bold mb-0 d-flex align-items-center">
            Imágenes del catálogo
            <span className="catalog-badge">
              {catalog.name}
            </span>
          </h3>
        </div>
      </div>
      
      <div className="image-toolbar">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar imágenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="btn-actions">
          <Link 
            to="/admin/catalogs" 
            className="btn btn-outline-secondary btn-back"
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </Link>
          
          <Link 
            to={`/admin/catalogs/${catalogId}/images/create`} 
            className="btn btn-success btn-add"
          >
            <i className="bi bi-plus-circle me-1"></i>
            Añadir
          </Link>
        </div>
      </div>
      
      {/* Lista de imágenes */}
      {filteredImages.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-images"></i>
          <h4>No hay imágenes</h4>
          <p className="text-muted">
            {searchTerm 
              ? `No se encontraron imágenes que coincidan con "${searchTerm}"`
              : 'Comienza añadiendo imágenes a este catálogo.'}
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
      
      {filteredImages.length > 0 && (
        <div className="card-grid">
          {filteredImages.map((image) => (
            <div key={image.id} className="image-card">
              <div className="image-card-header">
                Imagen
              </div>
              <div className="image-preview">
                <img 
                  src={image.imageUrl} 
                  alt={image.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                  }}
                />
              </div>
              <div className="image-card-body">
                <div className="image-name">{image.name}</div>
                <div className="image-price">${image.price.toFixed(2)}</div>
                <div className="image-card-actions">
                  <Link 
                    to={`/admin/catalogs/${catalogId}/images/edit/${image.id}`}
                    className="btn btn-warning btn-image-action"
                  >
                    <i className="bi bi-pencil"></i>
                    Editar
                  </Link>
                  <button 
                    className="btn btn-danger btn-image-action"
                    onClick={() => setDeleteConfirm(image.id)}
                  >
                    <i className="bi bi-trash"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Ventana de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="delete-confirmation">
          <h5 className="mb-2">¿Eliminar esta imagen?</h5>
          <p className="text-muted mb-2">
            Esta acción no se puede deshacer.
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

export default ImageList;