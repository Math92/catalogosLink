import React, { useState, useEffect } from 'react';

const AwsImage = ({ src, alt, style }) => {
  const [loading, setLoading] = useState(true);
  // Eliminamos la variable error ya que no la estamos utilizando

  // Log para depuración
  useEffect(() => {
    console.log(`Intentando cargar imagen desde: ${src}`);
  }, [src]);

  return (
    <>
      {loading && <div className="skeleton-box skeleton-image"></div>}
      <img
        src={src}
        alt={alt || 'Product image'}
        style={{
          ...style,
          maxHeight: '70vh',
          width: '100%',
          height: 'auto',
          minHeight: '200px',
          objectFit: 'contain',
          display: loading ? 'none' : 'block'
        }}
        onLoad={() => {
          console.log(`Imagen cargada exitosamente: ${src}`);
          setLoading(false);
        }}
        onError={(e) => {
          console.error(`Error al cargar imagen: ${src}`);
          e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
          setLoading(false);
        }}
      />
    </>
  );
};

export default AwsImage;