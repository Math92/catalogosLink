import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Nombre de la colección en Firestore
const CATALOGOS_COLLECTION = 'catalogos';

/**
 * Obtiene todos los catálogos
 * @returns {Promise<Array>} Lista de catálogos
 */
export const getCatalogos = async () => {
  try {
    const catalogosQuery = query(collection(db, CATALOGOS_COLLECTION), orderBy('nombre'));
    const querySnapshot = await getDocs(catalogosQuery);
    
    const catalogos = [];
    querySnapshot.forEach((doc) => {
      catalogos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return catalogos;
  } catch (error) {
    console.error("Error al obtener catálogos:", error);
    throw error;
  }
};

/**
 * Obtiene un catálogo por su ID
 * @param {string} id ID del catálogo
 * @returns {Promise<Object>} Datos del catálogo
 */
export const getCatalogoById = async (id) => {
  try {
    const docRef = doc(db, CATALOGOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("No se encontró el catálogo");
    }
  } catch (error) {
    console.error("Error al obtener el catálogo:", error);
    throw error;
  }
};

/**
 * Crea un nuevo catálogo
 * @param {Object} catalogo Datos del catálogo
 * @returns {Promise<string>} ID del catálogo creado
 */
export const createCatalogo = async (catalogo) => {
  try {
    const docRef = await addDoc(collection(db, CATALOGOS_COLLECTION), {
      nombre: catalogo.nombre,
      imagenes: catalogo.imagenes || [],
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error al crear el catálogo:", error);
    throw error;
  }
};

/**
 * Actualiza un catálogo existente
 * @param {string} id ID del catálogo
 * @param {Object} catalogo Datos actualizados del catálogo
 * @returns {Promise<void>}
 */
export const updateCatalogo = async (id, catalogo) => {
  try {
    const catalogoRef = doc(db, CATALOGOS_COLLECTION, id);
    await updateDoc(catalogoRef, {
      nombre: catalogo.nombre,
      imagenes: catalogo.imagenes,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error al actualizar el catálogo:", error);
    throw error;
  }
};

/**
 * Elimina un catálogo
 * @param {string} id ID del catálogo
 * @returns {Promise<void>}
 */
export const deleteCatalogo = async (id) => {
  try {
    // Primero obtener el catálogo para poder eliminar sus imágenes
    const catalogo = await getCatalogoById(id);
    
    // Eliminar las imágenes del Storage
    if (catalogo.imagenes && catalogo.imagenes.length > 0) {
      await Promise.all(
        catalogo.imagenes.map(async (imageUrl) => {
          try {
            // Extraer la ruta de la URL de la imagen
            const imageRef = ref(storage, getImagePath(imageUrl));
            await deleteObject(imageRef);
          } catch (imgError) {
            console.error("Error al eliminar imagen:", imgError);
            // Continuar con las demás imágenes aunque haya error
          }
        })
      );
    }
    
    // Eliminar el documento de Firestore
    await deleteDoc(doc(db, CATALOGOS_COLLECTION, id));
  } catch (error) {
    console.error("Error al eliminar el catálogo:", error);
    throw error;
  }
};

/**
 * Sube una imagen al Storage y devuelve la URL
 * @param {File} file Archivo de imagen
 * @param {string} catalogoId ID del catálogo
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadImage = async (file, catalogoId) => {
  try {
    // Crear una referencia única para la imagen
    const filename = `${Date.now()}-${file.name}`;
    const imagePath = `catalogos/${catalogoId}/${filename}`;
    const storageRef = ref(storage, imagePath);
    
    // Subir el archivo
    await uploadBytes(storageRef, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};

/**
 * Sube múltiples imágenes al Storage y devuelve las URLs
 * @param {Array<File>} files Archivos de imágenes
 * @param {string} catalogoId ID del catálogo
 * @returns {Promise<Array<string>>} URLs de las imágenes subidas
 */
export const uploadMultipleImages = async (files, catalogoId) => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, catalogoId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error al subir múltiples imágenes:", error);
    throw error;
  }
};

/**
 * Elimina una imagen del Storage
 * @param {string} imageUrl URL de la imagen a eliminar
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, getImagePath(imageUrl));
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    throw error;
  }
};

/**
 * Obtiene la ruta de la imagen a partir de la URL
 * @param {string} url URL completa de la imagen
 * @returns {string} Ruta relativa para usar en storage.ref()
 */
const getImagePath = (url) => {
  try {
    // Extraer la ruta de la URL
    // La URL típica de Firebase Storage es como:
    // https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?token=[token]
    const urlObj = new URL(url);
    // Decodificar el path desde el parámetro 'o' en la URL
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1]);
    return path;
  } catch (error) {
    console.error("Error al extraer la ruta de la imagen:", error);
    // Retornar la URL completa como fallback
    return url;
  }
};