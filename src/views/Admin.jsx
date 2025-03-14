import React, { useState, useEffect } from 'react';
import { 
  getCatalogos, 
  createCatalogo, 
  updateCatalogo, 
  deleteCatalogo, 
  uploadImage 
} from '../services/catalogService';

const Admin = () => {
  const [catalogos, setCatalogos] = useState([]);
  const [currentCatalogo, setCurrentCatalogo] = useState({ id: null, nombre: '', imagenes: [] });
  const [modo, setModo] = useState('lista'); // 'lista', 'crear', 'editar'
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Cargar catálogos desde Firestore
    const fetchCatalogos = async () => {
      setLoading(true);
      setError(null);
      try {
        const catalogosData = await getCatalogos();
        setCatalogos(catalogosData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los catálogos:', err);
        setError('No se pudieron cargar los catálogos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, []);

  const handleInputChange = (e) => {
    setCurrentCatalogo({
      ...currentCatalogo,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      // Crear URLs para las vistas previas
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (modo === 'crear') {
        // 1. Crear primero el catálogo para obtener su ID
        const catalogoId = await createCatalogo({
          nombre: currentCatalogo.nombre,
          imagenes: []
        });
        
        // 2. Si hay imágenes seleccionadas, subirlas
        let imageUrls = [];
        if (selectedFiles.length > 0) {
          // Subir cada imagen y guardar las URLs
          for (const file of selectedFiles) {
            const imageUrl = await uploadImage(file, catalogoId);
            imageUrls.push(imageUrl);
          }
          
          // 3. Actualizar el catálogo con las URLs de las imágenes
          await updateCatalogo(catalogoId, {
            nombre: currentCatalogo.nombre,
            imagenes: imageUrls
          });
        }
        
        // 4. Actualizar la interfaz de usuario
        setCatalogos([...catalogos, {
          id: catalogoId,
          nombre: currentCatalogo.nombre,
          imagenes: imageUrls
        }]);
        
      } else if (modo === 'editar') {
        // 1. Si hay nuevas imágenes, subirlas
        let newImageUrls = [];
        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            const imageUrl = await uploadImage(file, currentCatalogo.id);
            newImageUrls.push(imageUrl);
          }
        }
        
        // 2. Actualizar el catálogo con las nuevas imágenes
        const updatedImagenes = [...currentCatalogo.imagenes, ...newImageUrls];
        await updateCatalogo(currentCatalogo.id, {
          nombre: currentCatalogo.nombre,
          imagenes: updatedImagenes
        });
        
        // 3. Actualizar la interfaz de usuario
        setCatalogos(
          catalogos.map(cat => 
            cat.id === currentCatalogo.id 
              ? {...currentCatalogo, imagenes: updatedImagenes} 
              : cat
          )
        );
      }
      
      // Limpiar formulario
      setCurrentCatalogo({ id: null, nombre: '', imagenes: [] });
      setPreviewUrls([]);
      setSelectedFiles([]);
      setModo('lista');
      
    } catch (error) {
      console.error('Error al guardar el catálogo:', error);
      setError('Ocurrió un error al guardar los cambios. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de querer eliminar este catálogo?')) {
      try {
        setLoading(true);
        // Eliminar el catálogo (también elimina sus imágenes)
        await deleteCatalogo(id);
        // Actualizar la interfaz
        setCatalogos(catalogos.filter(cat => cat.id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error al eliminar el catálogo:', error);
        setError('No se pudo eliminar el catálogo. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    }
  };

  const handleEdit = (catalogo) => {
    setCurrentCatalogo(catalogo);
    setModo('editar');
  };

  const handleDeleteImagen = async (catalogoId, index) => {
    try {
      const catalogo = catalogos.find(cat => cat.id === catalogoId);
      if (!catalogo) return;
      
      // Crear un nuevo array de imágenes sin la que se eliminará
      const nuevasImagenes = [...catalogo.imagenes];
      nuevasImagenes.splice(index, 1);
      
      // Actualizar en Firestore
      await updateCatalogo(catalogoId, {
        ...catalogo,
        imagenes: nuevasImagenes
      });
      
      // Actualizar la interfaz
      setCatalogos(
        catalogos.map(cat => {
          if (cat.id === catalogoId) {
            return { ...cat, imagenes: nuevasImagenes };
          }
          return cat;
        })
      );
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      setError('No se pudo eliminar la imagen. Por favor, intenta de nuevo.');
    }
  };

  // Limpiar los objetos URL cuando los componentes se desmonten
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (loading && modo === 'lista') {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando catálogos...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Administración de Catálogos</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {modo === 'lista' && (
        <>
          <button 
            className="btn btn-success mb-4" 
            onClick={() => {
              setCurrentCatalogo({ id: null, nombre: '', imagenes: [] });
              setModo('crear');
            }}
          >
            Crear Nuevo Catálogo
          </button>
          
          <div>
            <h2 className="h4 mb-3">Catálogos Existentes</h2>
            {catalogos.length === 0 ? (
              <div className="alert alert-info">No hay catálogos disponibles.</div>
            ) : (
              <div className="row g-4">
                {catalogos.map(catalogo => (
                  <div key={catalogo.id} className="col-12">
                    <div className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h3 className="h5 mb-0">{catalogo.nombre}</h3>
                        <span className="badge bg-primary">
                          {catalogo.imagenes ? catalogo.imagenes.length : 0} 
                          {catalogo.imagenes && catalogo.imagenes.length === 1 ? ' imagen' : ' imágenes'}
                        </span>
                      </div>
                      
                      <div className="card-body">
                        <div className="row g-2 mb-3">
                          {catalogo.imagenes && catalogo.imagenes.map((img, index) => (
                            <div key={index} className="col-4 col-md-3 col-lg-2 position-relative">
                              <img 
                                src={img} 
                                className="img-thumbnail" 
                                alt={`Imagen ${index + 1} de ${catalogo.nombre}`} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/100?text=Error';
                                }}
                              />
                              <button 
                                className="btn btn-sm btn-danger position-absolute top-0 end-0" 
                                onClick={() => handleDeleteImagen(catalogo.id, index)}
                                aria-label="Eliminar imagen"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleEdit(catalogo)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDelete(catalogo.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {(modo === 'crear' || modo === 'editar') && (
        <div className="card">
          <div className="card-header">
            <h2 className="h4 mb-0">{modo === 'crear' ? 'Crear Nuevo Catálogo' : 'Editar Catálogo'}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre del Catálogo:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={currentCatalogo.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="imagenes" className="form-label">Agregar Imágenes:</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagenes"
                  name="imagenes"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                />
              </div>
              
              {previewUrls.length > 0 && (
                <div className="mb-3">
                  <h3 className="h5 mb-2">Vista Previa:</h3>
                  <div className="row g-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="col-4 col-md-3 col-lg-2">
                        <img src={url} className="img-thumbnail" alt={`Vista previa ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {modo === 'editar' && currentCatalogo.imagenes && currentCatalogo.imagenes.length > 0 && (
                <div className="mb-3">
                  <h3 className="h5 mb-2">Imágenes Actuales:</h3>
                  <div className="row g-2">
                    {currentCatalogo.imagenes.map((img, index) => (
                      <div key={index} className="col-4 col-md-3 col-lg-2">
                        <img 
                          src={img} 
                          className="img-thumbnail" 
                          alt={`Imagen ${index + 1}`} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=Error';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {modo === 'crear' ? 'Creando...' : 'Guardando...'}
                    </>
                  ) : (
                    modo === 'crear' ? 'Crear Catálogo' : 'Guardar Cambios'
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setModo('lista');
                    setCurrentCatalogo({ id: null, nombre: '', imagenes: [] });
                    setPreviewUrls([]);
                    setSelectedFiles([]);
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;