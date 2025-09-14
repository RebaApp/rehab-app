// firebaseConfig.js — safe init for Expo + Hermes
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 Firebase config (kept from original)
const firebaseConfig = {
  apiKey: "AIzaSyD9x-8FX1lf8CNRU2FxzD6IShVZ1-Vl6Gg",
  authDomain: "rehab-3e9f6.firebaseapp.com",
  projectId: "rehab-3e9f6",
  storageBucket: "rehab-3e9f6.appspot.com",
  messagingSenderId: "947708856033",
  appId: "1:947708856033:web:18d6c6dc54a5c6932f33aa",
  measurementId: "G-WM9F7XWBV7",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth - simplified for Expo compatibility
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

export { auth, db };
