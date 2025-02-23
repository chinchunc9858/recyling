// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Sup
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV3NSgC5HTWc9psAZFFy6rdYXBgZYMorY",
  authDomain: "recycle-scanner-2c109.firebaseapp.com",
  projectId: "recycle-scanner-2c109",
  storageBucket: "recycle-scanner-2c109.firebasestorage.app",
  messagingSenderId: "957278511944",
  appId: "1:957278511944:web:570008111671f92069497d",
  measurementId: "G-BGEZW1CJN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };