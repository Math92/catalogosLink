import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, remove, onValue } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCY9zWUaRYF6ZhJeuIzlu29u3wfj-bg2qg",
  authDomain: "catalogosapp-9aaf3.firebaseapp.com",
  databaseURL: "https://catalogosapp-9aaf3-default-rtdb.firebaseio.com",
  projectId: "catalogosapp-9aaf3",
  storageBucket: "catalogosapp-9aaf3.firebasestorage.app",
  messagingSenderId: "230047034935",
  appId: "1:230047034935:web:15dc1cea4acb936e9719b2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Contexto para la base de datos
const LocalDBContext = createContext();

export const LocalDBProvider = ({ children }) => {
  // Estado para almacenar los datos
  const [data, setData] = useState({
    catalogs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar la estructura de datos en Firebase
  const checkFirebaseData = async () => {
    try {
      // Solo verificamos que exista la referencia de 'catalogs'
      const catalogsRef = ref(database, 'catalogs');
      const snapshot = await get(catalogsRef);
      
      // Si no existe la estructura, creamos un nodo vacío
      if (!snapshot.exists()) {
        await set(ref(database, 'catalogs'), {});
        console.log('Se creó la estructura inicial en Firebase');
      }
      
      return [];
    } catch (error) {
      console.error('Error al verificar datos en Firebase:', error);
      return [];
    }
  };

  // Cargar datos desde Firebase al iniciar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Solo verificamos la estructura, sin borrar datos
        await checkFirebaseData();
        
        // Escuchar cambios en tiempo real
        const catalogsRef = ref(database, 'catalogs');
        const unsubscribe = onValue(catalogsRef, (snapshot) => {
          if (snapshot.exists()) {
            const catalogsArray = [];
            snapshot.forEach((childSnapshot) => {
              catalogsArray.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            setData({ catalogs: catalogsArray });
          } else {
            setData({ catalogs: [] });
          }
          setIsLoading(false);
        });
        
        // Limpieza al desmontar
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al cargar datos de Firebase:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // CRUD para catálogos
  const createCatalog = async (catalog) => {
    try {
      const catalogsRef = ref(database, 'catalogs');
      const newCatalogRef = push(catalogsRef);
      const newCatalog = {
        ...catalog,
        id: newCatalogRef.key,
        images: []
      };
      
      await set(newCatalogRef, newCatalog);
      return newCatalog;
    } catch (error) {
      console.error('Error al crear catálogo:', error);
      throw error;
    }
  };

  const updateCatalog = async (id, updates) => {
    try {
      const catalogRef = ref(database, `catalogs/${id}`);
      await update(catalogRef, updates);
    } catch (error) {
      console.error('Error al actualizar catálogo:', error);
      throw error;
    }
  };

  const deleteCatalog = async (id) => {
    try {
      const catalogRef = ref(database, `catalogs/${id}`);
      await remove(catalogRef);
    } catch (error) {
      console.error('Error al eliminar catálogo:', error);
      throw error;
    }
  };

  // CRUD para imágenes
  const createImage = async (catalogId, image) => {
    try {
      // Generar ID único para la imagen
      const imageId = `img-${Date.now()}`;
      const newImage = {
        ...image,
        id: imageId
      };
      
      // Obtener el catálogo directamente de Firebase
      const catalogRef = ref(database, `catalogs/${catalogId}`);
      const snapshot = await get(catalogRef);
      
      if (!snapshot.exists()) {
        throw new Error('Catálogo no encontrado');
      }
      
      const catalogData = snapshot.val();
      
      // Obtener imágenes actuales o inicializar array vacío
      const currentImages = catalogData.images || [];
      const updatedImages = [...currentImages, newImage];
      
      // Actualizar en Firebase
      await update(catalogRef, {
        images: updatedImages
      });
      
      return newImage;
    } catch (error) {
      console.error('Error al crear imagen:', error);
      throw error;
    }
  };

  const updateImage = async (catalogId, imageId, updates) => {
    try {
      // Obtener el catálogo directamente de Firebase para datos actualizados
      const catalogRef = ref(database, `catalogs/${catalogId}`);
      const snapshot = await get(catalogRef);
      
      if (!snapshot.exists()) {
        throw new Error('Catálogo no encontrado');
      }
      
      const catalogData = snapshot.val();
      const images = catalogData.images || [];
      const updatedImages = images.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      );
      
      await update(catalogRef, {
        images: updatedImages
      });
    } catch (error) {
      console.error('Error al actualizar imagen:', error);
      throw error;
    }
  };

  const deleteImage = async (catalogId, imageId) => {
    try {
      // Obtener el catálogo directamente de Firebase para datos actualizados
      const catalogRef = ref(database, `catalogs/${catalogId}`);
      const snapshot = await get(catalogRef);
      
      if (!snapshot.exists()) {
        throw new Error('Catálogo no encontrado');
      }
      
      const catalogData = snapshot.val();
      const images = catalogData.images || [];
      const updatedImages = images.filter(img => img.id !== imageId);
      
      await update(catalogRef, {
        images: updatedImages
      });
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
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
    isLoading,
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