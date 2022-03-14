// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseAuth;
let firebaseApp;
export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB_F9S8B06dFMwRISKuWAQaL_WUUKwpi7s",
    authDomain: "kanban-board-394be.firebaseapp.com",
    projectId: "kanban-board-394be",
    storageBucket: "kanban-board-394be.appspot.com",
    messagingSenderId: "133320540503",
    appId: "1:133320540503:web:670d3b87f0b3e839693e12",
    measurementId: "G-MZ5WLQH401",
  };
  firebaseApp = initializeApp(firebaseConfig);
};

export const getFirestoreInstance = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }

  return getFirestore();
};

export const getFirebaseAuthInstance = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return getAuth();
};
