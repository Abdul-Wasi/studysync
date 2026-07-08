// src/firebase.js/

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Only import Realtime Database functions if your existing tools use it,
// which seems to be the case based on ProfilePage.jsx
import { getDatabase, ref, set, onValue, off, remove, push } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // This points to Realtime Database.
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Initialize Realtime Database. This 'db' instance will be used by ProfilePage
// and the new Discussion Forum components.
export const db = getDatabase(app);
