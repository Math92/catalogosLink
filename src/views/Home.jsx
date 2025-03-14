import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCatalogos } from '../services/catalogService';

const Home = () => {
  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar catálogos desde Firestore
    const fetchCatalogos = async () => {
      try {
        setLoading(true);
        const catalogosData = await getCatalogos();
        setCatalogos(catalogosData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los catálogos:', error);
        setError('No se pudieron cargar los catálogos. Por favor, intenta más tarde.');
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-center mb-4">Catálogos Disponibles</h1>
      
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando catálogos...</p>
        </div>
      ) : (
        <div className="row g-4">
          {catalogos.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">No hay catálogos disponibles.</div>
            </div>
          ) : (
            catalogos.map((catalogo) => (
              <div key={catalogo.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="card-title mb-0">{catalogo.nombre}</h5>
                  </div>
                  
                  {catalogo.imagenes && catalogo.imagenes.length > 0 ? (
                    <div className="ratio ratio-16x9">
                      <img 
                        src={catalogo.imagenes[0]} 
                        className="card-img-top object-fit-cover"
                        alt={`Vista previa de ${catalogo.nombre}`}
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
                    <p className="card-text">
                      {catalogo.imagenes ? catalogo.imagenes.length : 0} 
                      {catalogo.imagenes && catalogo.imagenes.length === 1 ? ' imagen' : ' imágenes'}
                    </p>
                    <Link to={`/catalogo/${catalogo.id}`} className="btn btn-primary mt-auto">
                      Ver catálogo
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;