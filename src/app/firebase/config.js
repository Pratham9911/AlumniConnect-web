// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDPs4mhViWhhrYL5hbaQ2AM4z1gr87xwkQ",
  authDomain: "alumniconnect-4c45a.firebaseapp.com",
  projectId: "alumniconnect-4c45a",
  storageBucket: "alumniconnect-4c45a.appspot.com",
  messagingSenderId: "122032499935",
  appId: "1:122032499935:web:97ec641f5ade8ba68d8d6a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Custom Hook to track logged-in user
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return { currentUser };
}
