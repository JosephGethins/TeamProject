import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9yCYEXgORW3kqKKECWeRmSWZVj1B2ues",
  authDomain: "student-quizhelper.firebaseapp.com",
  projectId: "student-quizhelper",
  storageBucket: "student-quizhelper.firebasestorage.app",
  messagingSenderId: "281466393037",
  appId: "1:281466393037:web:307af307410c027f30b484",
  measurementId: "G-GNCBBVR2WK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
