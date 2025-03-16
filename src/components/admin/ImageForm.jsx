import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';
import AdminSkeletonLoader from '../AdminSkeletonLoader';

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Determinar si es edición o creación
  const isEditMode = !!imageId;
  
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulamos tiempo de carga para mostrar el skeleton loader
      setTimeout(() => {
        const foundCatalog = getCatalog(catalogId);
        
        if (!foundCatalog) {
          navigate('/admin/catalogs');
          return;
        }
        
        setCatalog(foundCatalog);
        
        if (isEditMode) {
          const image = foundCatalog.images?.find(img => img.id === imageId);
          
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
        
        setIsLoading(false);
      }, 600);
    };
    
    loadData();
  }, [catalogId, imageId, isEditMode, getCatalog, navigate]);
  
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
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <AdminSkeletonLoader />;
  }
  
  return (
    <div className="image-form-container">
      <style>{`
        .image-form-container {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #6c757d;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        
        .back-link:hover {
          color: #0d6efd;
          transform: translateX(-2px);
        }
        
        .form-card {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
        }
        
        .form-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem;
        }
        
        .form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: #86b7fe;
        }
        
        .image-preview-container {
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          border: 1px dashed #dee2e6;
          padding: 1rem;
          margin-top: 0.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .image-preview-container img {
          max-height: 200px;
          object-fit: contain;
          transition: all 0.3s ease;
        }
        
        .image-preview-container:hover img {
          transform: scale(1.05);
        }
        
        .catalog-badge {
          display: inline-flex;
          align-items: center;
          background-color: #0d6efd;
          color: white;
          border-radius: 50px;
          padding: 0.25rem 0.75rem;
          font-size: 0.85rem;
          margin-left: 0.5rem;
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        @media (min-width: 576px) {
          .action-buttons {
            flex-direction: row;
          }
        }
        
        .btn-submit, .btn-cancel {
          padding: 0.5rem 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }
        
        @media (min-width: 576px) {
          .btn-submit, .btn-cancel {
            width: auto;
          }
        }
        
        .btn-submit {
          background-color: #0d6efd;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-submit:hover:not(:disabled) {
          background-color: #0b5ed7;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        }
        
        .btn-submit:disabled {
          background-color: #0d6efd;
          opacity: 0.65;
        }
        
        .btn-cancel {
          background-color: #f8f9fa;
          color: #212529;
          border: 1px solid #dee2e6;
          transition: all 0.3s ease;
        }
        
        .btn-cancel:hover {
          background-color: #e9ecef;
          transform: translateY(-2px);
        }
      `}</style>
      
      <Link to={`/admin/catalogs/${catalogId}/images`} className="back-link">
        <i className="bi bi-arrow-left me-1"></i>
        Volver a imágenes
      </Link>
      
      <h3 className="mb-3 fs-5 fw-bold d-flex align-items-center flex-wrap">
        {isEditMode ? 'Editar imagen' : 'Nueva imagen'}
        {catalog && (
          <span className="catalog-badge">
            {catalog.name}
          </span>
        )}
      </h3>
      
      {errors.submit && (
        <div className="alert alert-danger mb-4">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="card-body">
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
              
              {formData.imageUrl && (
                <div className="image-preview-container mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Vista previa" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="mb-3">
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
            
            <div className="mb-3">
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
        </div>
        
        <div className="action-buttons">
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <i className="bi bi-save"></i>
                <span>Guardar Imagen</span>
              </>
            )}
          </button>
          
          <Link to={`/admin/catalogs/${catalogId}/images`} className="btn btn-cancel">
            <i className="bi bi-x-circle"></i>
            <span>Cancelar</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;