import React from 'react';

const CatalogSkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      {/* CSS para animaciones del skeleton */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .skeleton-container {
          width: 100%;
          padding: 0 0.5rem;
        }
        
        .skeleton-box {
          background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
        
        .skeleton-header {
          height: 3rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        
        .skeleton-image {
          width: 100%;
          height: 60vh;
          max-height: 500px;
          margin-bottom: 1.5rem;
          border-radius: 8px;
        }
        
        .skeleton-title {
          height: 1.5rem;
          width: 75%;
          margin-bottom: 0.75rem;
          border-radius: 4px;
        }
        
        .skeleton-price {
          height: 2rem;
          width: 40%;
          margin-bottom: 1.5rem;
          border-radius: 4px;
        }
        
        .skeleton-dots {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .skeleton-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 0 0.25rem;
        }
        
        .skeleton-counter {
          height: 1rem;
          width: 60px;
          margin: 0 auto;
          border-radius: 4px;
        }
      `}</style>
      
      {/* Header skeleton */}
      <div className="skeleton-box skeleton-header"></div>
      
      {/* Imagen principal skeleton */}
      <div className="skeleton-box skeleton-image"></div>
      
      {/* Info del producto skeleton */}
      <div className="skeleton-box skeleton-title"></div>
      <div className="skeleton-box skeleton-price"></div>
      
      {/* Indicadores de paginación skeleton */}
      <div className="skeleton-dots">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="skeleton-box skeleton-dot"></div>
        ))}
      </div>
      
      {/* Contador skeleton */}
      <div className="skeleton-box skeleton-counter"></div>
    </div>
  );
};

export default CatalogSkeletonLoader;