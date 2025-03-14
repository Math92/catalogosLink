import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCatalogoById, getCatalogos } from '../services/catalogService';

const ViewCatalogo = () => {
  const { id } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Cargar desde Firestore
    const fetchCatalogo = async () => {
      try {
        setLoading(true);
        // Si no hay ID, mostrar todos los catálogos
        if (!id) {
          const allCatalogos = await getCatalogos();
          setCatalogo({ id: 'all', nombre: 'Todos los Catálogos', catalogos: allCatalogos });
        } else {
          // Buscar un catálogo específico
          const catalogoData = await getCatalogoById(id);
          setCatalogo(catalogoData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        setError('No se pudo cargar el catálogo. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchCatalogo();
  }, [id]);

  const nextImage = () => {
    if (catalogo && catalogo.imagenes && catalogo.imagenes.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === catalogo.imagenes.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (catalogo && catalogo.imagenes && catalogo.imagenes.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? catalogo.imagenes.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h2 className="h4">Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary mt-3">Volver a Inicio</Link>
      </div>
    );
  }

  if (!catalogo) {
    return (
      <div className="alert alert-danger">
        <h2 className="h4">Error</h2>
        <p>No se pudo encontrar el catálogo solicitado.</p>
        <Link to="/" className="btn btn-primary mt-3">Volver a Inicio</Link>
      </div>
    );
  }

  // Vista para todos los catálogos
  if (catalogo.id === 'all') {
    return (
      <div>
        <h1 className="text-center mb-4">Todos los Catálogos</h1>
        <div className="row g-4">
          {catalogo.catalogos && catalogo.catalogos.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">No hay catálogos disponibles.</div>
            </div>
          ) : (
            catalogo.catalogos.map((cat) => (
              <div key={cat.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="card-title mb-0">{cat.nombre}</h5>
                  </div>
                  
                  {cat.imagenes && cat.imagenes.length > 0 ? (
                    <div className="ratio ratio-16x9">
                      <img 
                        src={cat.imagenes[0]} 
                        className="card-img-top object-fit-cover"
                        alt={`Vista previa de ${cat.nombre}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center">
                      <div className="text-center text-muted">Sin imágenes</div>
                    </div>
                  )}
                  
                  <div className="card-body d-flex flex-column">
                    <p className="card-text">{cat.imagenes ? cat.imagenes.length : 0} {cat.imagenes && cat.imagenes.length === 1 ? 'imagen' : 'imágenes'}</p>
                    <Link to={`/catalogo/${cat.id}`} className="btn btn-primary mt-auto">
                      Ver catálogo
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Vista para un catálogo específico
  return (
    <div>
      <h1 className="text-center mb-4">{catalogo.nombre}</h1>
      
      {!catalogo.imagenes || catalogo.imagenes.length === 0 ? (
        <div className="alert alert-info">
          <p>Este catálogo no contiene imágenes.</p>
        </div>
      ) : (
        <div className="mb-4">
          <div className="card">
            <div className="position-relative">
              <div className="ratio ratio-16x9">
                <img 
                  src={catalogo.imagenes[currentImageIndex]} 
                  className="card-img-top object-fit-contain bg-light"
                  alt={`Imagen ${currentImageIndex + 1} de ${catalogo.nombre}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=Sin+Imagen';
                  }}
                />
              </div>
              
              {catalogo.imagenes.length > 1 && (
                <div className="position-absolute top-50 start-0 end-0 d-flex justify-content-between px-3" style={{transform: 'translateY(-50%)'}}>
                  <button onClick={prevImage} className="btn btn-dark rounded-circle" aria-label="Anterior">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button onClick={nextImage} className="btn btn-dark rounded-circle" aria-label="Siguiente">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
            
            <div className="card-footer text-center">
              Imagen {currentImageIndex + 1} de {catalogo.imagenes.length}
            </div>
          </div>
          
          {catalogo.imagenes.length > 1 && (
            <div className="row g-2 mt-3">
              {catalogo.imagenes.map((img, index) => (
                <div 
                  key={index} 
                  className="col-3 col-md-2"
                  onClick={() => setCurrentImageIndex(index)}
                  style={{cursor: 'pointer'}}
                >
                  <img 
                    src={img} 
                    className={`img-thumbnail ${index === currentImageIndex ? 'border-primary border-3' : ''}`}
                    alt={`Miniatura ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100?text=Error';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-primary">Volver a Inicio</Link>
      </div>
    </div>
  );
};

export default ViewCatalogo;