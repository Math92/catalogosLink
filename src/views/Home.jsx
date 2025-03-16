import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';
import HomeSkeletonLoader from '../components/HomeSkeletonLoader';
import styles from './Home.module.css';

const Home = () => {
  const { catalogs } = useLocalDB();
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Restaurar el scroll normal al entrar en Home
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {};
  }, []);

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
    const card = e.currentTarget.closest(`.${styles['catalog-card']}`);
    if (card) {
      card.classList.add(styles['card-clicked']);
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
    <div className={`${styles['fade-container']} ${animate ? styles['fade-in'] : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-4 fw-bold">Nuestros Catálogos</h2>
        <span className={`badge bg-primary rounded-pill ${styles['catalog-badge']}`}>
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

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
        {catalogs.map((catalog, index) => {
          // Verificar si el catálogo tiene imágenes válidas
          const hasValidImage = catalog.images &&
            catalog.images.length > 0 &&
            isValidImageUrl(catalog.images[0].imageUrl) &&
            !imageErrors[catalog.id];

          return (
            <div
              key={catalog.id}
              className="col mb-2"
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: animate ? 1 : 0,
                transition: `opacity 0.5s ease ${index * 0.1}s`
              }}
            >
              <div className={`card ${styles['catalog-card']} h-100 border-0`} style={{ borderRadius: '12px' }}>
                {/* Imagen del primer producto del catálogo si existe */}
                <div className="position-relative overflow-hidden">
                  {hasValidImage ? (
                    <div className={styles['catalog-image']}>
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
                    <div className={styles['image-placeholder']}>
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

                <div className={`card-body ${styles['catalog-card-body']} p-2`}>
                  <h5 className="card-title fs-5 mb-1">{catalog.name}</h5>
                  <p className="card-text small text-muted">
                    <i className="bi bi-calendar3 me-1"></i> Última actualización: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="card-footer border-0 bg-transparent p-2">
                  <Link
                    to={`/catalog/${catalog.id}`}
                    className={`btn btn-primary w-100 ${styles['btn-view']}`}
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