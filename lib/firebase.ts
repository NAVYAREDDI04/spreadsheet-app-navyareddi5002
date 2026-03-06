import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfYE9YDH-v7yWALzQJEHAIQoqtHyDY1eY",
  authDomain: "spreasheet-navya.firebaseapp.com",
  projectId: "spreasheet-navya",
  storageBucket: "spreasheet-navya.firebasestorage.app",
  messagingSenderId: "284158050522",
  appId: "1:284158050522:web:59d1e4fdd2a229ef8ee5e3",
  measurementId: "G-QETKNFRD5H"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);