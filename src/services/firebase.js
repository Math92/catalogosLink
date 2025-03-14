// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY9zWUaRYF6ZhJeuIzlu29u3wfj-bg2qg",
  authDomain: "catalogosapp-9aaf3.firebaseapp.com",
  databaseURL: "https://catalogosapp-9aaf3-default-rtdb.firebaseio.com",
  projectId: "catalogosapp-9aaf3",
  storageBucket: "catalogosapp-9aaf3.appspot.com",
  messagingSenderId: "230047034935",
  appId: "1:230047034935:web:15dc1cea4acb936e9719b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;