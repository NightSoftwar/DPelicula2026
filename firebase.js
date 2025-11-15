// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

// --- CONFIGURACIÓN (tuya) ---
const firebaseConfig = {
  apiKey: "AIzaSyD9iF0focEyqIYuPAni7gM62NXHd8gDpnM",
  authDomain: "dpelicula2026.firebaseapp.com",
  projectId: "dpelicula2026",
  storageBucket: "dpelicula2026.appspot.com",
  messagingSenderId: "902345976049",
  appId: "1:902345976049:web:2a715317ceaf3c6c832150",
  measurementId: "G-QNGSTSL3SN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

