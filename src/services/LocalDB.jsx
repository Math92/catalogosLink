import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto para la base de datos local
const LocalDBContext = createContext();

// Datos iniciales de ejemplo
const initialData = {
  catalogs: [
    {
      id: 'cat1',
      name: 'Catálogo de Verano',
      images: [
        { id: 'img1', name: 'Camiseta Floral', price: 25.99, imageUrl: 'https://via.placeholder.com/300x400?text=Camiseta+Floral' },
        { id: 'img2', name: 'Shorts de Playa', price: 19.99, imageUrl: 'https://via.placeholder.com/300x400?text=Shorts+de+Playa' }
      ]
    },
    {
      id: 'cat2',
      name: 'Catálogo de Invierno',
      images: [
        { id: 'img3', name: 'Abrigo Elegante', price: 89.99, imageUrl: 'https://via.placeholder.com/300x400?text=Abrigo+Elegante' },
        { id: 'img4', name: 'Bufanda de Lana', price: 15.99, imageUrl: 'https://via.placeholder.com/300x400?text=Bufanda+de+Lana' }
      ]
    }
  ]
};

export const LocalDBProvider = ({ children }) => {
  // Estado para almacenar los datos
  const [data, setData] = useState(() => {
    // Intentar cargar datos desde localStorage
    const savedData = localStorage.getItem('catalogsAppData');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('catalogsAppData', JSON.stringify(data));
  }, [data]);

  // CRUD para catálogos
  const createCatalog = (catalog) => {
    const newCatalog = {
      ...catalog,
      id: `cat-${Date.now()}`,
      images: []
    };
    
    setData(prevData => ({
      ...prevData,
      catalogs: [...prevData.catalogs, newCatalog]
    }));
    
    return newCatalog;
  };

  const updateCatalog = (id, updates) => {
    setData(prevData => ({
      ...prevData,
      catalogs: prevData.catalogs.map(catalog => 
        catalog.id === id ? { ...catalog, ...updates } : catalog
      )
    }));
  };

  const deleteCatalog = (id) => {
    setData(prevData => ({
      ...prevData,
      catalogs: prevData.catalogs.filter(catalog => catalog.id !== id)
    }));
  };

  // CRUD para imágenes
  const createImage = (catalogId, image) => {
    const newImage = {
      ...image,
      id: `img-${Date.now()}`
    };
    
    setData(prevData => ({
      ...prevData,
      catalogs: prevData.catalogs.map(catalog => 
        catalog.id === catalogId
          ? { ...catalog, images: [...catalog.images, newImage] }
          : catalog
      )
    }));
    
    return newImage;
  };

  const updateImage = (catalogId, imageId, updates) => {
    setData(prevData => ({
      ...prevData,
      catalogs: prevData.catalogs.map(catalog => 
        catalog.id === catalogId
          ? {
              ...catalog,
              images: catalog.images.map(image => 
                image.id === imageId ? { ...image, ...updates } : image
              )
            }
          : catalog
      )
    }));
  };

  const deleteImage = (catalogId, imageId) => {
    setData(prevData => ({
      ...prevData,
      catalogs: prevData.catalogs.map(catalog => 
        catalog.id === catalogId
          ? {
              ...catalog,
              images: catalog.images.filter(image => image.id !== imageId)
            }
          : catalog
      )
    }));
  };
  
  // Consultas
  const getCatalog = (id) => {
    return data.catalogs.find(catalog => catalog.id === id) || null;
  };
  
  const getAllCatalogs = () => {
    return data.catalogs;
  };

  // Valores del contexto
  const value = {
    // Datos
    catalogs: data.catalogs,
    // Operaciones CRUD
    createCatalog,
    updateCatalog,
    deleteCatalog,
    createImage,
    updateImage,
    deleteImage,
    // Consultas
    getCatalog,
    getAllCatalogs
  };

  return (
    <LocalDBContext.Provider value={value}>
      {children}
    </LocalDBContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLocalDB = () => {
  const context = useContext(LocalDBContext);
  if (!context) {
    throw new Error('useLocalDB debe usarse dentro de un LocalDBProvider');
  }
  return context;
};