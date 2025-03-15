import React from 'react';

const AdminSkeletonLoader = () => {
  return (
    <div className="admin-skeleton-container px-2">
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
        
        .admin-skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          width: 100%;
        }
        
        @media (max-width: 767.98px) {
          .admin-skeleton-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
        
        .skeleton-title {
          height: 1.75rem;
          width: 60%;
          max-width: 300px;
        }
        
        .skeleton-button {
          height: 2.25rem;
          width: 120px;
          border-radius: 4px;
        }
        
        .skeleton-tabs {
          width: 100%;
          height: 2.5rem;
          margin-bottom: 1.5rem;
          border-radius: 0;
          border-bottom: 1px solid #dee2e6;
        }
        
        .skeleton-breadcrumb {
          height: 2rem;
          width: 100%;
          margin-bottom: 1.5rem;
          display: none;
        }
        
        @media (max-width: 767.98px) {
          .skeleton-breadcrumb {
            display: block;
          }
        }
        
        .skeleton-table {
          width: 100%;
        }
        
        .skeleton-row {
          height: 3.5rem;
          width: 100%;
          margin-bottom: 0.75rem;
          border-radius: 8px;
        }
        
        .skeleton-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          width: 100%;
        }
        
        @media (max-width: 767.98px) {
          .skeleton-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .skeleton-search {
            width: 100% !important;
          }
        }
        
        .skeleton-search {
          height: 2.25rem;
          width: 40%;
          max-width: 300px;
          border-radius: 4px;
        }
        
        .skeleton-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .skeleton-action-button {
          height: 2.25rem;
          width: 100px;
          border-radius: 4px;
        }
      `}</style>
      
      {/* Header skeleton */}
      <div className="admin-skeleton-header">
        <div className="skeleton-box skeleton-title"></div>
        <div className="skeleton-box skeleton-button"></div>
      </div>
      
      {/* Tabs navigation skeleton */}
      <div className="skeleton-box skeleton-tabs"></div>
      
      {/* Mobile breadcrumb skeleton */}
      <div className="skeleton-box skeleton-breadcrumb"></div>
      
      {/* Toolbar skeleton */}
      <div className="skeleton-toolbar">
        <div className="skeleton-box skeleton-search"></div>
        <div className="skeleton-actions">
          <div className="skeleton-box skeleton-action-button"></div>
        </div>
      </div>
      
      {/* Table skeleton */}
      <div className="skeleton-table">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="skeleton-box skeleton-row"></div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkeletonLoader;