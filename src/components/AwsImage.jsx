import React, { useState, useEffect } from 'react';

const AwsImage = ({ src, alt, style, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Resetear estados cuando cambia la URL de la fuente
  useEffect(() => {
    setImageLoaded(false);
  }, [src]);
  
  // Verificar que la URL es válida
  const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error(`URL no válida: ${url}`, e);
      return false;
    }
  };
  
  // URL de respaldo cuando hay errores
  const fallbackUrl = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
  
  // Si la URL no es válida, mostrar imagen de fallback inmediatamente
  if (!isValidUrl(src)) {
    return (
      <img
        src={fallbackUrl}
        alt={alt || 'Imagen no disponible'}
        style={{
          ...style,
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain'
        }}
        className={className}
      />
    );
  }
  
  // Contenedor con dimensiones fijas
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    width: '100%',
    height: '100%',
    minHeight: '100px',
    ...style
  };
  
  // Estilos para loader
  const loaderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: imageLoaded ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    zIndex: 1
  };
  
  // Estilos para la imagen
  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    zIndex: 2
  };
  
  return (
    <div style={containerStyle} className={`aws-image-container ${className}`}>
      {/* Loader mientras la imagen carga */}
      <div style={loaderStyle}>
        <div 
          className="skeleton-box"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear'
          }}
        />
      </div>
      
      {/* La imagen real */}
      <img
        // Key crucial para forzar recreación del componente cuando cambia la URL
        key={`img-${src}`}
        src={src}
        alt={alt || "Imagen"}
        style={imageStyle}
        onLoad={() => {
          console.log(`Imagen cargada exitosamente: ${src}`);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error(`Error cargando imagen: ${src}`);
          e.target.onerror = null; // Prevenir loops infinitos
          e.target.src = fallbackUrl;
          setImageLoaded(true); // Marcar como cargada pero ahora con la imagen de fallback
        }}
      />
      
      {/* Estilos para la animación */}
      <style jsx="true">{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default AwsImage;