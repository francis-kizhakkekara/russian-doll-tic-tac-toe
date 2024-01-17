// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9cY5_MgJ-DPZrJ2KTc4dP5azJMkpEsW0",
  authDomain: "russian-doll-tic-tac-toe.firebaseapp.com",
  projectId: "russian-doll-tic-tac-toe",
  storageBucket: "russian-doll-tic-tac-toe.appspot.com",
  messagingSenderId: "186584841802",
  appId: "1:186584841802:web:e3f9df9eeda9ab3417b0b3",
  measurementId: "G-Y5L06BDWBN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
