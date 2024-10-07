// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-short-video-creator.firebaseapp.com",
  projectId: "ai-short-video-creator",
  storageBucket: "ai-short-video-creator.appspot.com",
  messagingSenderId: "301641638341",
  appId: "1:301641638341:web:c3e833ec671ec4bf046bac",
  measurementId: "G-26FJ7Q37VE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const storage=getStorage(app);