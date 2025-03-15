import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';

const ImageForm = () => {
  const { catalogId, imageId } = useParams();
  const navigate = useNavigate();
  const { getCatalog, createImage, updateImage } = useLocalDB();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [catalog, setCatalog] = useState(null);
  
  // Determinar si es edición o creación
  const isEditMode = !!imageId;
  
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    const loadData = () => {
      const foundCatalog = getCatalog(catalogId);
      
      if (!foundCatalog) {
        navigate('/admin/catalogs');
        return;
      }
      
      setCatalog(foundCatalog);
      
      if (isEditMode) {
        const image = foundCatalog.images.find(img => img.id === imageId);
        
        if (!image) {
          navigate(`/admin/catalogs/${catalogId}/images`);
          return;
        }
        
        setFormData({
          name: image.name,
          price: image.price.toString(),
          imageUrl: image.imageUrl
        });
      }
    };
    
    loadData();
  }, [catalogId, imageId, isEditMode, getCatalog, navigate]);
  
  if (!catalog) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número positivo';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es obligatoria';
    } else {
        try {
            new URL(formData.imageUrl);
          } catch {
            newErrors.imageUrl = 'La URL de la imagen no es válida';
          }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const imageData = {
        name: formData.name,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl
      };
      
      if (isEditMode) {
        updateImage(catalogId, imageId, imageData);
      } else {
        createImage(catalogId, imageData);
      }
      
      // Redirigir a la lista de imágenes
      navigate(`/admin/catalogs/${catalogId}/images`);
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Ocurrió un error al guardar la imagen'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h3 className="mb-4">
        {isEditMode 
          ? `Editar Imagen en ${catalog.name}` 
          : `Nueva Imagen en ${catalog.name}`}
      </h3>
      
      {errors.submit && (
        <div className="alert alert-danger mb-4">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">Nombre del Producto</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del producto"
              required
            />
            {errors.name && (
              <div className="invalid-feedback">
                {errors.name}
              </div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">Precio</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="text"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              {errors.price && (
                <div className="invalid-feedback">
                  {errors.price}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">URL de la Imagen</label>
          <input
            type="text"
            className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            required
          />
          {errors.imageUrl && (
            <div className="invalid-feedback">
              {errors.imageUrl}
            </div>
          )}
        </div>
        
        {formData.imageUrl && (
          <div className="mb-4">
            <label className="form-label">Vista previa</label>
            <div className="border rounded p-2 text-center">
              <img 
                src={formData.imageUrl} 
                alt="Vista previa" 
                className="img-fluid"
                style={{ maxHeight: '200px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                }}
              />
            </div>
          </div>
        )}
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Guardar Imagen
              </>
            )}
          </button>
          
          <Link to={`/admin/catalogs/${catalogId}/images`} className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;