import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';

const Catalog = () => {
  const { id } = useParams();
  const { getCatalog } = useLocalDB();
  const [catalog, setCatalog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Imágenes por página
  const imagesPerPage = 6;
  
  useEffect(() => {
    const loadCatalog = () => {
      setLoading(true);
      const foundCatalog = getCatalog(id);
      setCatalog(foundCatalog);
      setLoading(false);
    };
    
    loadCatalog();
  }, [id, getCatalog]);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!catalog) {
    return (
      <div className="alert alert-warning">
        <h4>Catálogo no encontrado</h4>
        <p>El catálogo que estás buscando no existe o ha sido eliminado.</p>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al inicio
        </Link>
      </div>
    );
  }
  
  // Asegurarse de que catalog.images exista
  const images = catalog.images || [];
  
  // Cálculos para la paginación
  const totalImages = images.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  
  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{catalog.name}</h2>
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </Link>
      </div>
      
      {currentImages.length === 0 ? (
        <div className="alert alert-info">
          Este catálogo no contiene imágenes.
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
            {currentImages.map(image => (
              <div key={image.id} className="col">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={image.imageUrl} 
                    alt={image.name}
                    className="card-img-top"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{image.name}</h5>
                    <p className="card-text fs-4 fw-bold text-primary">
                      ${image.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <nav aria-label="Navegación de catálogo">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                
                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Catalog;