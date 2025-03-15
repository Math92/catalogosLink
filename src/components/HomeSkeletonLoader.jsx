import React from 'react';

const HomeSkeletonLoader = ({ cardCount = 6 }) => {
  return (
    <div className="home-skeleton-container">
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
        
        .skeleton-box {
          background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
          border-radius: 4px;
        }
        
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .skeleton-title {
          height: 1.5rem;
          width: 40%;
        }
        
        .skeleton-badge {
          height: 1.5rem;
          width: 80px;
          border-radius: 50px;
        }
        
        .skeleton-card {
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .skeleton-image {
          height: 180px;
          background-color: #f0f0f0;
        }
        
        .skeleton-card-body {
          padding: 1rem;
        }
        
        .skeleton-card-title {
          height: 1.25rem;
          width: 90%;
          margin-bottom: 0.75rem;
        }
        
        .skeleton-card-text {
          height: 1rem;
          width: 70%;
          margin-bottom: 1.5rem;
        }
        
        .skeleton-button {
          height: 2.5rem;
          width: 100%;
          border-radius: 4px;
        }
        
        @media (max-width: 767.98px) {
          .skeleton-image {
            height: 140px;
          }
        }
      `}</style>
      
      {/* Header skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-box skeleton-title"></div>
        <div className="skeleton-box skeleton-badge"></div>
      </div>
      
      {/* Grid de cards skeleton */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {[...Array(cardCount)].map((_, index) => (
          <div key={index} className="col" style={{ 
            opacity: 1,
            transition: `opacity 0.5s ease ${index * 0.1}s`
          }}>
            <div className="skeleton-card">
              <div className="skeleton-box skeleton-image"></div>
              <div className="skeleton-card-body">
                <div className="skeleton-box skeleton-card-title"></div>
                <div className="skeleton-box skeleton-card-text"></div>
                <div className="skeleton-box skeleton-button"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSkeletonLoader;