// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Import Realtime Database functions
import { getDatabase, ref, set, onValue, off, remove, push } from "firebase/database"; // <--- ADD THIS LINE

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // <--- IMPORTANT: Ensure this is present and correct!
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Initialize Realtime Database
export const db = getDatabase(app);