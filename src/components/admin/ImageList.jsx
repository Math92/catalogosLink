import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';

const ImageList = () => {
  const { catalogId } = useParams();
  const navigate = useNavigate();
  const { getCatalog, deleteImage } = useLocalDB();
  
  const [catalog, setCatalog] = useState(null);
  
  useEffect(() => {
    const loadCatalog = () => {
      const foundCatalog = getCatalog(catalogId);
      
      if (!foundCatalog) {
        navigate('/admin/catalogs');
        return;
      }
      
      setCatalog(foundCatalog);
    };
    
    loadCatalog();
  }, [catalogId, getCatalog, navigate]);
  
  if (!catalog) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  const handleDelete = (imageId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      deleteImage(catalogId, imageId);
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Imágenes de: {catalog.name}</h3>
        <div className="d-flex gap-2">
          <Link to={`/admin/catalogs/${catalogId}/images/create`} className="btn btn-success">
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Imagen
          </Link>
          <Link to="/admin/catalogs" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Link>
        </div>
      </div>
      
      {catalog.images.length === 0 ? (
        <div className="alert alert-info">
          Este catálogo no tiene imágenes. Agrega una nueva usando el botón de arriba.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: '100px' }}>Vista previa</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {catalog.images.map(image => (
                <tr key={image.id}>
                  <td>
                    <img 
                      src={image.imageUrl} 
                      alt={image.name}
                      className="img-thumbnail"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </td>
                  <td className="align-middle">{image.name}</td>
                  <td className="align-middle">${image.price.toFixed(2)}</td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-end gap-2">
                      <Link 
                        to={`/admin/catalogs/${catalogId}/images/edit/${image.id}`}
                        className="btn btn-warning btn-sm"
                      >
                        <i className="bi bi-pencil-fill me-1"></i>
                        Editar
                      </Link>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        <i className="bi bi-trash-fill me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageList;