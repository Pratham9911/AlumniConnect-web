// src/firebase/config.js

//Firebase configuration for the AlumniConnect app
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPs4mhViWhhrYL5hbaQ2AM4z1gr87xwkQ",
  authDomain: "alumniconnect-4c45a.firebaseapp.com",
  projectId: "alumniconnect-4c45a",
  storageBucket: "alumniconnect-4c45a.appspot.com",  // ⚠️ Fix: use .app**spot**.com not .app
  messagingSenderId: "122032499935",
  appId: "1:122032499935:web:97ec641f5ade8ba68d8d6a"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase Auth
export const auth = getAuth(app);
