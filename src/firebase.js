// FILE DI CONFIGURAZIONE DEL DB DI FIREBASE (e dell'auth per il login)
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  databaseURL: "https://poked3x-db-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyDsl7O3lK9rXPDVX6skcTZWYlqFAJb0KG4",
  authDomain: "poked3x-db.firebaseapp.com",
  projectId: "poked3x-db",
  storageBucket: "poked3x-db.appspot.com",
  messagingSenderId: "647038542410",
  appId: "1:647038542410:web:97a0b01d1e07a4542abcb3",
  measurementId: "G-ZPJSQCBERK"
};

// Inizializzazione
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth();