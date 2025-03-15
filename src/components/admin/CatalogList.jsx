import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';

const CatalogList = () => {
  const { catalogs, deleteCatalog } = useLocalDB();

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este catálogo? Esta acción eliminará también todas las imágenes asociadas.')) {
      deleteCatalog(id);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Catálogos</h3>
        <Link to="/admin/catalogs/create" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Catálogo
        </Link>
      </div>
      
      {catalogs.length === 0 ? (
        <div className="alert alert-info">
          No hay catálogos disponibles. Crea uno nuevo usando el botón de arriba.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col" className="text-center">Imágenes</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map(catalog => (
                <tr key={catalog.id}>
                  <td className="align-middle">{catalog.name}</td>
                  <td className="text-center align-middle">
                    <span className="badge bg-primary rounded-pill">
                      {catalog.images && catalog.images.length || 0}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Link 
                        to={`/admin/catalogs/${catalog.id}/images`}
                        className="btn btn-primary btn-sm"
                      >
                        <i className="bi bi-images me-1"></i>
                        Imágenes
                      </Link>
                      <Link 
                        to={`/admin/catalogs/edit/${catalog.id}`}
                        className="btn btn-warning btn-sm"
                      >
                        <i className="bi bi-pencil-fill me-1"></i>
                        Editar
                      </Link>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(catalog.id)}
                      >
                        <i className="bi bi-trash-fill me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CatalogList;