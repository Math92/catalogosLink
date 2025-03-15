import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';

const Catalog = () => {
  const { id } = useParams();
  const { getCatalog } = useLocalDB();
  const [catalog, setCatalog] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCatalog = () => {
      setLoading(true);
      const foundCatalog = getCatalog(id);
      setCatalog(foundCatalog);
      setCurrentImageIndex(0); // Reset al cargar un nuevo catálogo
      setLoading(false);
    };
    
    loadCatalog();
  }, [id, getCatalog]);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-3">
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
        <Link to="/" className="btn btn-primary mt-2">
          <i className="bi bi-arrow-left me-1"></i>
          Volver al inicio
        </Link>
      </div>
    );
  }
  
  // Asegurarse de que catalog.images exista
  const images = catalog.images || [];
  const totalImages = images.length;
  
  if (totalImages === 0) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4">{catalog.name}</h2>
          <Link to="/" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </Link>
        </div>
        <div className="alert alert-info">
          Este catálogo no contiene imágenes.
        </div>
      </div>
    );
  }
  
  // Navegación entre imágenes
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Obtener la imagen actual
  const currentImage = images[currentImageIndex];
  
  return (
    <div className="container-fluid px-0">
      {/* Header con nombre de catálogo */}
      <div className="bg-primary text-white py-2 px-3 mb-3 sticky-top">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fs-4 mb-0">{catalog.name}</h2>
          <Link to="/" className="btn btn-outline-light btn-sm">
            <i className="bi bi-arrow-left"></i>
          </Link>
        </div>
      </div>
      
      {/* Contenedor principal del producto - Mobile First */}
      <div className="card border-0 mb-3 mx-2">
        {/* Imagen del producto */}
        <div className="position-relative">
          <img 
            src={currentImage.imageUrl} 
            alt={currentImage.name}
            className="img-fluid w-100"
            style={{ objectFit: 'contain', maxHeight: '70vh' }}
          />
          
          {/* Botones de navegación */}
          <div className="position-absolute top-50 start-0 end-0 d-flex justify-content-between px-2" style={{ transform: 'translateY(-50%)' }}>
            <button 
              onClick={goToPrevious} 
              className="btn btn-light btn-sm rounded-circle shadow-sm"
              aria-label="Anterior"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            
            <button 
              onClick={goToNext} 
              className="btn btn-light btn-sm rounded-circle shadow-sm"
              aria-label="Siguiente"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        
        {/* Información del producto */}
        <div className="card-body pt-2 pb-4">
          <h3 className="card-title fs-5 fw-bold mt-1 mb-2">{currentImage.name}</h3>
          <p className="fs-3 fw-bold text-primary mb-0">${currentImage.price.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Paginación - Indicadores */}
      <div className="d-flex justify-content-center mb-3">
        {images.map((_, index) => (
          <button 
            key={index} 
            className={`btn ${index === currentImageIndex ? 'btn-primary' : 'btn-outline-secondary'} btn-sm mx-1 p-0 rounded-circle`}
            onClick={() => setCurrentImageIndex(index)}
            style={{ width: '10px', height: '10px' }}
            aria-label={`Imagen ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Contador */}
      <div className="text-center text-muted small mb-4">
        {currentImageIndex + 1} / {totalImages}
      </div>
    </div>
  );
};

export default Catalog;