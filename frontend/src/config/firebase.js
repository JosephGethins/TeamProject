// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHxa-MOlCI7nvh_Mc7v5ppB8Nn7tSP5rg",
  authDomain: "student-helper-26cfb.firebaseapp.com",
  projectId: "student-helper-26cfb",
  storageBucket: "student-helper-26cfb.firebasestorage.app",
  messagingSenderId: "916843611151",
  appId: "1:916843611151:web:aeec7504dd09d9d5254f7a",
  measurementId: "G-PQD9ENLBP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
