import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email Email del usuario
 * @param {string} password Contraseña del usuario
 * @returns {Promise<UserCredential>} Credencial del usuario
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

/**
 * Registrar un nuevo usuario (solo para uso administrativo)
 * @param {string} email Email del usuario
 * @param {string} password Contraseña del usuario
 * @returns {Promise<UserCredential>} Credencial del usuario
 */
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

/**
 * Cerrar sesión del usuario actual
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

/**
 * Enviar correo para restablecer contraseña
 * @param {string} email Email del usuario
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error al enviar correo de restablecimiento:", error);
    throw error;
  }
};

/**
 * Obtener el usuario actual
 * @returns {User|null} Usuario actual o null si no hay sesión
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Observar cambios en el estado de autenticación
 * @param {function} callback Función a ejecutar cuando cambia el estado
 * @returns {function} Función para dejar de observar
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};