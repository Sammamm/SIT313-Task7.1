// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQ0m3dLOnAGjcgKPey0HM-T2uSKZyh5wM",
  authDomain: "first-project-f162e.firebaseapp.com",
  projectId: "first-project-f162e",
  storageBucket: "first-project-f162e.appspot.com",
  messagingSenderId: "335253258448",
  appId: "1:335253258448:web:15d5ba82ca0f2941415ed5",
  measurementId: "G-GXW14LVTJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {auth, app}