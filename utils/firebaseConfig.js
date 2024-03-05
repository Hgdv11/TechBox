import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXZdVllDQFU8N-tn2-5aPz1pc7npjZGPY",
  authDomain: "techbox-be7c3.firebaseapp.com",
  databaseURL: "https://techbox-be7c3-default-rtdb.firebaseio.com",
  projectId: "techbox-be7c3",
  storageBucket: "techbox-be7c3.appspot.com",
  messagingSenderId: "908487358423",
  appId: "1:908487358423:web:e6c29075ab4bbc705ebd92",
  measurementId: "G-S1V9ZZCFH0",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la instancia de Firestore
const db = getFirestore(app);

// Inicializa Firebase Auth con AsyncStorage como método de persistencia
const auth = initializeAuth(app);

export { db, auth };
