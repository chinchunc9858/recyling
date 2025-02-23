import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV3NSgC5HTWc9psAZFFy6rdYXBgZYMorY",
  authDomain: "recycle-scanner-2c109.firebaseapp.com",
  projectId: "recycle-scanner-2c109",
  storageBucket: "recycle-scanner-2c109.firebasestorage.app",
  messagingSenderId: "957278511944",
  appId: "1:957278511944:web:570008111671f92069497d",
  measurementId: "G-BGEZW1CJN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Authentication

// Function to update user points in Firestore
export const updateUserPoints = async (userId) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { points: increment(10) }, { merge: true });
  console.log("Added 10 points to user:", userId);
};

export { db, auth };