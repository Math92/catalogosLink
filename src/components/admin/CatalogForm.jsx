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
    <div>
      <h3 className="mb-4">
        {isEditMode ? 'Editar Catálogo' : 'Crear Nuevo Catálogo'}
      </h3>
      
      {errors.submit && (
        <div className="alert alert-danger mb-4">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
        
        {!isEditMode && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Imágenes iniciales (opcional)</h4>
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm"
                onClick={addImageField}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Agregar imagen
              </button>
            </div>
            
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-3">
                  Puedes agregar imágenes iniciales a tu catálogo. También podrás añadir más imágenes después de crear el catálogo.
                </p>
                
                {imageUrls.map((url, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Imagen {index + 1}</h5>
                        {imageUrls.length > 1 && (
                          <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeImageField(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                      
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
                        <div className="mb-3">
                          <div className="border rounded p-2 text-center">
                            <img 
                              src={url} 
                              alt="Vista previa" 
                              className="img-fluid"
                              style={{ maxHeight: '150px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="row">
                        <div className="col-md-8 mb-3">
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
                        
                        <div className="col-md-4 mb-3">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="d-flex gap-2 mt-4">
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
                {isEditMode ? 'Guardar Cambios' : 'Crear Catálogo'}
              </>
            )}
          </button>
          
          <Link to="/admin/catalogs" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CatalogForm;