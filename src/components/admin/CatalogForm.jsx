import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocalDB } from '../../services/LocalDB';

const CatalogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCatalog, updateCatalog, getCatalog, createImage } = useLocalDB();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: ''
  });
  
  // Estado para las URLs de imágenes
  const [imageUrls, setImageUrls] = useState(['']);
  const [imageNames, setImageNames] = useState(['']);
  const [imagePrices, setImagePrices] = useState(['']);
  
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState([{}]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determinar si es edición o creación
  const isEditMode = !!id;
  
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const catalog = getCatalog(id);
      if (catalog) {
        setFormData({
          name: catalog.name
        });
      } else {
        // Si no se encuentra el catálogo, redirigir a la lista
        navigate('/admin/catalogs');
      }
    }
  }, [id, isEditMode, getCatalog, navigate]);
  
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
  
  // Manejar cambios en las URLs de imágenes
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    
    // Limpiar error
    const newImageErrors = [...imageErrors];
    if (newImageErrors[index] && newImageErrors[index].url) {
      newImageErrors[index] = { ...newImageErrors[index], url: '' };
      setImageErrors(newImageErrors);
    }
  };
  
  // Manejar cambios en los nombres de imágenes
  const handleImageNameChange = (index, value) => {
    const newImageNames = [...imageNames];
    newImageNames[index] = value;
    setImageNames(newImageNames);
    
    // Limpiar error
    const newImageErrors = [...imageErrors];
    if (newImageErrors[index] && newImageErrors[index].name) {
      newImageErrors[index] = { ...newImageErrors[index], name: '' };
      setImageErrors(newImageErrors);
    }
  };
  
  // Manejar cambios en los precios de imágenes
  const handleImagePriceChange = (index, value) => {
    const newImagePrices = [...imagePrices];
    newImagePrices[index] = value;
    setImagePrices(newImagePrices);
    
    // Limpiar error
    const newImageErrors = [...imageErrors];
    if (newImageErrors[index] && newImageErrors[index].price) {
      newImageErrors[index] = { ...newImageErrors[index], price: '' };
      setImageErrors(newImageErrors);
    }
  };
  
  // Agregar un nuevo campo de imagen
  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
    setImageNames([...imageNames, '']);
    setImagePrices([...imagePrices, '']);
    setImageErrors([...imageErrors, {}]);
  };
  
  // Eliminar un campo de imagen
  const removeImageField = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
      setImageNames(imageNames.filter((_, i) => i !== index));
      setImagePrices(imagePrices.filter((_, i) => i !== index));
      setImageErrors(imageErrors.filter((_, i) => i !== index));
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    const newImageErrors = [...imageErrors];
    let isValid = true;
    
    // Validar nombre del catálogo
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del catálogo es obligatorio';
      isValid = false;
    }
    
    // Validar campos de imágenes (solo si hay contenido)
    imageUrls.forEach((url, index) => {
      newImageErrors[index] = newImageErrors[index] || {};
      
      // Solo validamos si hay contenido en al menos un campo de la imagen
      if (url.trim() || imageNames[index].trim() || imagePrices[index].trim()) {
        if (!url.trim()) {
          newImageErrors[index].url = 'La URL de la imagen es obligatoria';
          isValid = false;
        } else {
          try {
            new URL(url);
          } catch {
            newImageErrors[index].url = 'La URL de la imagen no es válida';
            isValid = false;
          }
        }
        
        if (!imageNames[index].trim()) {
          newImageErrors[index].name = 'El nombre del producto es obligatorio';
          isValid = false;
        }
        
        if (!imagePrices[index].trim()) {
          newImageErrors[index].price = 'El precio es obligatorio';
          isValid = false;
        } else if (isNaN(parseFloat(imagePrices[index])) || parseFloat(imagePrices[index]) <= 0) {
          newImageErrors[index].price = 'El precio debe ser un número positivo';
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    setImageErrors(newImageErrors);
    return isValid;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
      
    if (!validateForm()) return;
      
    setIsSubmitting(true);
      
    try {
      let catalogId;
        
      // Crear o actualizar catálogo
      if (isEditMode) {
        await updateCatalog(id, { name: formData.name });
        catalogId = id;
      } else {
        const newCatalog = await createCatalog({ name: formData.name });
        catalogId = newCatalog.id;
        
        // Esperar brevemente para que Firebase actualice los datos
        await new Promise(resolve => setTimeout(resolve, 500));
      }
        
      // Crear imágenes que tengan los tres campos completos
      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i].trim() && imageNames[i].trim() && imagePrices[i].trim()) {
          await createImage(catalogId, {
            name: imageNames[i],
            price: parseFloat(imagePrices[i]),
            imageUrl: imageUrls[i]
          });
        }
      }
        
      // Redirigir a la lista de catálogos
      navigate('/admin/catalogs');
    } catch (error) {
      console.error('Error al guardar el catálogo:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Ocurrió un error al guardar el catálogo'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="catalog-form-container">
      <style>{`
        .catalog-form-container {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
        
        .card {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          margin-bottom: 1rem;
        }
        
        .image-card {
          border: 1px solid #dee2e6;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .image-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .image-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f8f9fa;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .image-preview {
          text-align: center;
          background-color: #f8f9fa;
          border-radius: 0.25rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border: 1px dashed #dee2e6;
        }
        
        .image-preview img {
          max-height: 150px;
          object-fit: contain;
        }
        
        .add-image-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .add-image-btn:hover {
          transform: translateY(-2px);
        }
        
        .remove-image-btn {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: all 0.2s ease;
        }
        
        .remove-image-btn:hover {
          background-color: #dc3545;
          color: white;
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
        
        .image-section-info {
          background-color: #e9f2ff;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #0d6efd;
          font-size: 0.9rem;
        }
      `}</style>
      
      <h3 className="mb-3 fw-bold fs-5">
        {isEditMode ? 'Editar Catálogo' : 'Crear Nuevo Catálogo'}
      </h3>
      
      {errors.submit && (
        <div className="alert alert-danger mb-4">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-body">
            <label htmlFor="name" className="form-label">Nombre del Catálogo</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del catálogo"
              required
            />
            {errors.name && (
              <div className="invalid-feedback">
                {errors.name}
              </div>
            )}
          </div>
        </div>
        
        {!isEditMode && (
          <div className="mb-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
              <h4 className="fs-5 fw-bold mb-0">Imágenes iniciales</h4>
              <button 
                type="button" 
                className="btn btn-primary add-image-btn"
                onClick={addImageField}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Agregar imagen</span>
              </button>
            </div>
            
            <div className="image-section-info">
              <i className="bi bi-info-circle me-2"></i>
              Puedes agregar imágenes iniciales a tu catálogo o añadirlas después.
            </div>
            
            {imageUrls.map((url, index) => (
              <div key={index} className="image-card mb-4">
                <div className="image-card-header">
                  <h5 className="fs-6 fw-bold mb-0">Imagen {index + 1}</h5>
                  {imageUrls.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-outline-danger remove-image-btn"
                      onClick={() => removeImageField(index)}
                      aria-label="Eliminar imagen"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">URL de la Imagen</label>
                    <input
                      type="text"
                      className={`form-control ${imageErrors[index]?.url ? 'is-invalid' : ''}`}
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {imageErrors[index]?.url && (
                      <div className="invalid-feedback">
                        {imageErrors[index].url}
                      </div>
                    )}
                  </div>
                  
                  {url && (
                    <div className="image-preview">
                      <img 
                        src={url} 
                        alt="Vista previa" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      className={`form-control ${imageErrors[index]?.name ? 'is-invalid' : ''}`}
                      value={imageNames[index]}
                      onChange={(e) => handleImageNameChange(index, e.target.value)}
                      placeholder="Nombre del producto"
                    />
                    {imageErrors[index]?.name && (
                      <div className="invalid-feedback">
                        {imageErrors[index].name}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-0">
                    <label className="form-label">Precio</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className={`form-control ${imageErrors[index]?.price ? 'is-invalid' : ''}`}
                        value={imagePrices[index]}
                        onChange={(e) => handleImagePriceChange(index, e.target.value)}
                        placeholder="0.00"
                      />
                      {imageErrors[index]?.price && (
                        <div className="invalid-feedback">
                          {imageErrors[index].price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
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
                <span>{isEditMode ? 'Guardar Cambios' : 'Crear Catálogo'}</span>
              </>
            )}
          </button>
          
          <Link to="/admin/catalogs" className="btn btn-cancel">
            <i className="bi bi-x-circle"></i>
            <span>Cancelar</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CatalogForm;