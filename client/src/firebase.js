// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestateproject-b4a83.firebaseapp.com",
  projectId: "realestateproject-b4a83",
  storageBucket: "realestateproject-b4a83.firebasestorage.app",
  messagingSenderId: "1037509891961",
  appId: "1:1037509891961:web:f078f0fe411f7bfdf741a8",
  measurementId: "G-F77GRXLRH8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
