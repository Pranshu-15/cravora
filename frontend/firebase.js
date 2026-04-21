// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "cravora-f9aa8.firebaseapp.com",
  projectId: "cravora-f9aa8",
  storageBucket: "cravora-f9aa8.firebasestorage.app",
  messagingSenderId: "746818662008",
  appId: "1:746818662008:web:f821c913c2822aa893478d",
  measurementId: "G-ZFFJNL676B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}