import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';
import CatalogSkeletonLoader from '../components/CatalogSkeletonLoader';
import AwsImage from '../components/AwsImage';
import { useSwipeable } from 'react-swipeable';
import styles from './Catalog.module.css';

const Catalog = () => {
    const { id } = useParams();
    const { getCatalog } = useLocalDB();
    const [catalog, setCatalog] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [touchStartX, setTouchStartX] = useState(null);
    const [isSwiping, setIsSwiping] = useState(false);

    // Función auxiliar para validar URLs
    const isValidImageUrl = (url) => {
        if (!url) return false;

        try {
            new URL(url);
            return url.trim() !== '';
        } catch (e) {
            console.error(`URL no válida en catálogo: ${url}`, e);
            return false;
        }
    };

    // Mostrar instrucción de swipe solo la primera vez - Movido fuera del render
    const [showInstruction] = useState(() => {
        try {
            const hasSeenInstruction = localStorage.getItem('hasSeenSwipeInstruction');
            if (!hasSeenInstruction) {
                localStorage.setItem('hasSeenSwipeInstruction', 'true');
                return true;
            }
            return false;
        } catch (error) {
            // Fallback si hay problemas con localStorage
            console.error("Error accediendo a localStorage:", error);
            return false;
        }
    });

    // Agregar clase al body para evitar scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const loadCatalog = () => {
            setLoading(true);
            try {
                // Simulamos un tiempo de carga para mostrar el skeleton loader
                setTimeout(() => {
                    const foundCatalog = getCatalog(id);

                    // Verificar que el catálogo existe
                    if (foundCatalog) {
                        // Verificar y filtrar imágenes con URLs inválidas
                        if (foundCatalog.images && foundCatalog.images.length > 0) {
                            // Log de depuración
                            foundCatalog.images.forEach((img, index) => {
                                console.log(`Imagen ${index}: ${img.name} - URL: ${img.imageUrl}`);
                                if (!isValidImageUrl(img.imageUrl)) {
                                    console.warn(`Imagen ${index} (${img.name}) tiene URL inválida: ${img.imageUrl}`);
                                }
                            });
                        }
                    }

                    setCatalog(foundCatalog);
                    setCurrentImageIndex(0); // Reset al cargar un nuevo catálogo
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error cargando catálogo:", error);
                setLoading(false);
            }
        };

        loadCatalog();
    }, [id, getCatalog]);

    // Moverse al callback para evitar recrear en cada render
    const goToPrevious = useCallback(() => {
        if (!catalog || !catalog.images || catalog.images.length === 0) return;

        const totalImages = catalog.images.length;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? totalImages - 1 : prevIndex - 1
        );
    }, [catalog]);

    const goToNext = useCallback(() => {
        if (!catalog || !catalog.images || catalog.images.length === 0) return;

        const totalImages = catalog.images.length;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === totalImages - 1 ? 0 : prevIndex + 1
        );
    }, [catalog]);

    // Manejar eventos táctiles con comprobaciones adicionales
    const handleTouchStart = useCallback((e) => {
        if (e && e.touches && e.touches[0]) {
            setTouchStartX(e.touches[0].clientX);
            setIsSwiping(true);
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!touchStartX || !e || !e.touches || !e.touches[0]) return;
        
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        
        // En lugar de llamar a preventDefault(), usamos esta técnica
        // para evitar el scroll vertical durante swipes horizontales significativos
        if (Math.abs(diff) > 10) {
            // Manejar el swipe horizontal sin preventDefault
            // Actualizamos el estado para indicar que estamos en un swipe horizontal
            setIsSwiping(true);
            
            // Opcional: puedes añadir una clase al elemento para manipular su
            // comportamiento táctil con CSS (por ejemplo, touch-action: none)
            const swipeContainer = e.currentTarget;
            if (swipeContainer) {
                swipeContainer.style.touchAction = 'none';
            }
        }
    }, [touchStartX]);

    const handleTouchEnd = useCallback(() => {
        setTouchStartX(null);
        
        // Pequeño retraso para efecto visual más suave
        setTimeout(() => {
            setIsSwiping(false);
        }, 150);
        
        // Restablece cualquier modificación de estilo que hayas hecho
        const containers = document.querySelectorAll(`.${styles['swipe-container']}`);
        containers.forEach(container => {
            container.style.touchAction = '';
        });
    }, []);

    // Configuración de gestos de swipe con funciones de callback
    const swipeHandlers = useSwipeable({
        onSwipedLeft: goToNext,
        onSwipedRight: goToPrevious,
        preventDefaultTouchmoveEvent: false, // Cambiado a false para evitar el error
        trackMouse: false,
        delta: 10, // Distancia mínima para considerar un swipe
        swipeDuration: 500, // Duración máxima de un swipe
    });

    if (loading) {
        return <CatalogSkeletonLoader />;
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

    // Obtener la imagen actual con verificación adicional
    const currentImage = images[currentImageIndex] || images[0];

    // Verificar que currentImage existe y tiene las propiedades necesarias
    if (!currentImage) {
        return (
            <div className="alert alert-danger">
                <h4>Error cargando imagen</h4>
                <p>No se pudo cargar la imagen seleccionada.</p>
                <Link to="/" className="btn btn-primary mt-2">
                    <i className="bi bi-arrow-left me-1"></i>
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className={`container-fluid px-0 ${styles['catalog-container']} ${styles['no-scroll']}`}>
            {/* Header con nombre de catálogo - Versión sutil */}
            <div className={styles['subtle-header']}>
                <Link to="/" className={styles['back-button']}>
                    <i className={`bi bi-arrow-left ${styles['back-icon']}`}></i>
                </Link>
                <h2 className={styles['catalog-title']}>{catalog.name}</h2>
                <div style={{ width: '32px' }}></div> {/* Elemento vacío para equilibrar el diseño */}
            </div>

            {/* Contenedor principal del producto - Mobile First */}
            <div className={`card border-0 mx-2 ${styles['card-container']}`}>
                {/* Imagen del producto con gestos de swipe */}
                <div
                    className={`position-relative ${styles['swipe-container']} ${styles['image-container-fixed']} ${isSwiping ? styles.swiping : ''}`}
                    {...swipeHandlers}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    // Estos atributos ayudan a controlar cómo el navegador maneja los eventos táctiles
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        backgroundColor: "#f8f9fa",
                        touchAction: "pan-y" // Permitir scroll vertical pero no horizontal
                    }}
                    // El atributo data-passive="false" es una pista para algunos frameworks
                    data-passive="false"
                >
                    <div className={styles['swipe-overlay']}></div>

                    {showInstruction && (
                        <div className={`${styles['swipe-instruction']} ${styles['swipe-animation']}`}>
                            <i className="bi bi-arrow-left-right"></i>
                            <span>Desliza para navegar</span>
                        </div>
                    )}

                    <div className={styles['image-wrapper']} style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative"
                    }}>
                        {currentImage && isValidImageUrl(currentImage.imageUrl) ? (
                            <AwsImage
                                // Clave esencial para forzar la recreación del componente cuando cambia la imagen
                                key={`catalog-image-${currentImageIndex}-${currentImage.id || ''}`}
                                src={currentImage.imageUrl}
                                alt={currentImage.name || 'Producto'}
                                style={{
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                    objectFit: "contain"
                                }}
                            />
                        ) : (
                            <div className={styles['image-placeholder']}>
                                <i className="bi bi-image-fill"></i>
                                <span>Imagen no disponible</span>
                            </div>
                        )}
                    </div>

                    {/* Botones de navegación */}
                    <div className="position-absolute top-50 start-0 end-0 d-flex justify-content-between px-2" style={{ transform: 'translateY(-50%)' }}>
                        <button
                            onClick={goToPrevious}
                            className={`btn btn-light btn-sm rounded-circle shadow-sm ${styles['nav-button']}`}
                            aria-label="Anterior"
                            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button
                            onClick={goToNext}
                            className={`btn btn-light btn-sm rounded-circle shadow-sm ${styles['nav-button']}`}
                            aria-label="Siguiente"
                            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* Información del producto */}
                <div className="card-body pt-2 pb-2">
                    <h3 className="card-title fs-5 fw-bold mt-1 mb-2">
                        {currentImage.name || 'Producto sin nombre'}
                    </h3>
                    <p className="fs-3 fw-bold text-primary mb-0">
                        ${typeof currentImage.price === 'number' ? currentImage.price.toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Paginación - Indicadores */}
            <div className="d-flex justify-content-center mb-1">
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
            <div className="text-center text-muted small mb-1">
                {currentImageIndex + 1} / {totalImages}
            </div>
        </div>
    );
};

export default Catalog;