import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalDB } from '../services/LocalDB';

const Home = () => {
  const { catalogs } = useLocalDB();

  return (
    <div>
      <h2 className="mb-4">Nuestros Catálogos</h2>
      
      {catalogs.length === 0 && (
        <div className="alert alert-info">
          No hay catálogos disponibles. Por favor, crea uno desde el panel de administración.
        </div>
      )}
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {catalogs.map(catalog => (
          <div key={catalog.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{catalog.name}</h5>
                <p className="card-text text-muted">
                  {catalog.images && catalog.images.length || 0} {(catalog.images && catalog.images.length === 1) ? 'imagen' : 'imágenes'}
                </p>
              </div>
              <div className="card-footer bg-white border-top-0">
                <Link 
                  to={`/catalog/${catalog.id}`} 
                  className="btn btn-primary w-100"
                >
                  <i className="bi bi-eye me-2"></i>
                  Ver Catálogo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;