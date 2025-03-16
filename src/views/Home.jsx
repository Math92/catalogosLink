import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';
import HomeSkeletonLoader from '../components/HomeSkeletonLoader';

const Home = () => {
  const { catalogs } = useLocalDB();
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Función auxiliar para validar URLs
  const isValidImageUrl = useCallback((url) => {
    if (!url) return false;

    try {
      new URL(url);
      return url.trim() !== '';
    } catch (e) {
      console.error(`URL no válida en catálogo: ${url}`, e);
      return false;
    }
  }, []);

  // Efecto para simular la carga de datos y añadir animación de entrada
  useEffect(() => {
    // Simulamos un tiempo de carga para mostrar el skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Activamos la animación después de finalizar la carga
      setTimeout(() => setAnimate(true), 100);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Verifica y registra problemas con las imágenes en la consola
  useEffect(() => {
    if (catalogs && catalogs.length > 0) {
      catalogs.forEach(catalog => {
        if (catalog.images && catalog.images.length > 0) {
          catalog.images.forEach((img, idx) => {
            if (!isValidImageUrl(img.imageUrl)) {
              console.warn(`Catálogo ${catalog.name}: Imagen ${idx} (${img.name}) tiene URL inválida: ${img.imageUrl}`);
            }
          });
        }
      });
    }
  }, [catalogs, isValidImageUrl]);

  // Maneja la animación al hacer clic en un catálogo
  const handleCatalogClick = (e) => {
    const card = e.currentTarget.closest('.catalog-card');
    if (card) {
      card.classList.add('card-clicked');
    }
  };

  // Maneja errores de carga de imagen
  const handleImageError = useCallback((catalogId) => {
    setImageErrors(prev => ({
      ...prev,
      [catalogId]: true
    }));
  }, []);

  // Mostrar el skeleton loader mientras se cargan los datos
  if (isLoading) {
    return <HomeSkeletonLoader cardCount={6} />;
  }

  return (
    <div className={`fade-container ${animate ? 'fade-in' : ''}`}>
      <style>
        {`
                .fade-container {
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                }
                
                .fade-in {
                    opacity: 1;
                }
                
                .catalog-card {
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                
                .catalog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                
                .catalog-card-body {
                    transition: background-color 0.3s ease;
                }
                
                .catalog-card:hover .catalog-card-body {
                    background-color: #f8f9fa;
                }
                
                .catalog-image {
                    height: 180px;
                    object-fit: contain;
                    background-color: #f8f9fa;
                    transition: transform 0.5s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .catalog-card:hover .catalog-image {
                    transform: scale(1.02);
                }
                
                .catalog-image img {
                    max-height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                }
                
                .image-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 180px;
                    width: 100%;
                    color: #6c757d;
                    background-color: #f8f9fa;
                }
                
                .image-placeholder i {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }
                
                @media (max-width: 767.98px) {
                    .catalog-image {
                        height: 140px;
                    }
                    
                    .image-placeholder {
                        height: 140px;
                    }
                }
                
                .btn-view {
                    transition: all 0.3s ease;
                    transform: translateY(0);
                }
                
                .catalog-card:hover .btn-view {
                    background-color: #0b5ed7;
                    transform: translateY(-3px);
                    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
                }
                
                .card-clicked {
                    transform: scale(0.98) !important;
                    opacity: 0.8;
                    transition: all 0.2s ease;
                }
                
                .catalog-badge {
                    transition: all 0.3s ease;
                    transform: scale(1);
                }
                
                .catalog-card:hover .catalog-badge {
                    transform: scale(1.1);
                    background-color: #0d6efd !important;
                }
                
                @media (max-width: 767.98px) {
                    .catalog-card {
                        margin-bottom: 1rem;
                    }
                }
                
                /* Evitar el parpadeo de las imágenes */
                .catalog-image.loaded {
                    opacity: 1;
                }
                
                .catalog-image.loading {
                    opacity: 0.7;
                    background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite linear;
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                `}
      </style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold">Nuestros Catálogos</h2>
        <span className="badge bg-primary rounded-pill catalog-badge">
          {catalogs.length} {catalogs.length === 1 ? 'catálogo' : 'catálogos'}
        </span>
      </div>

      {catalogs.length === 0 && (
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle fs-4 me-3"></i>
            <div>
              <p className="mb-0">No hay catálogos disponibles. Por favor, crea uno desde el panel de administración.</p>
            </div>
          </div>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {catalogs.map((catalog, index) => {
          // Verificar si el catálogo tiene imágenes válidas
          const hasValidImage = catalog.images &&
            catalog.images.length > 0 &&
            isValidImageUrl(catalog.images[0].imageUrl) &&
            !imageErrors[catalog.id];

          return (
            <div
              key={catalog.id}
              className="col"
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: animate ? 1 : 0,
                transition: `opacity 0.5s ease ${index * 0.1}s`
              }}
            >
              <div className="card catalog-card h-100 border-0" style={{ borderRadius: '12px' }}>
                {/* Imagen del primer producto del catálogo si existe */}
                <div className="position-relative overflow-hidden">
                  {hasValidImage ? (
                    <div className="catalog-image">
                      <img
                        // Clave única para forzar recreación del componente cuando cambia el catálogo
                        key={`home-cat-img-${catalog.id}`}
                        src={catalog.images[0].imageUrl}
                        alt={catalog.name}
                        loading="lazy"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                        onError={() => {
                          console.error(`Error cargando imagen de catálogo: ${catalog.name}`);
                          handleImageError(catalog.id);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="image-placeholder">
                      <i className="bi bi-images text-muted"></i>
                      <span className="small text-muted">Vista previa no disponible</span>
                    </div>
                  )}
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <span className="badge bg-dark bg-opacity-75 rounded-pill">
                      {catalog.images && catalog.images.length || 0} {(catalog.images && catalog.images.length === 1) ? 'imagen' : 'imágenes'}
                    </span>
                  </div>
                </div>

                <div className="card-body catalog-card-body p-3">
                  <h5 className="card-title fs-5 mb-1">{catalog.name}</h5>
                  <p className="card-text small text-muted">
                    <i className="bi bi-calendar3 me-1"></i> Última actualización: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="card-footer border-0 bg-transparent p-3 pt-0">
                  <Link
                    to={`/catalog/${catalog.id}`}
                    className="btn btn-primary w-100 btn-view"
                    onClick={handleCatalogClick}
                  >
                    <i className="bi bi-eye me-2"></i>
                    Ver Catálogo
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;