// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaibBrtBmp9nV0s8IkOu6n69qiaLfOjso",
  authDomain: "grievance-d4aee.firebaseapp.com",
  projectId: "grievance-d4aee",
  storageBucket: "grievance-d4aee.appspot.com",
  messagingSenderId: "843003436720",
  appId: "1:843003436720:web:a95b82a1c9a65c78c1e575",
  measurementId: "G-BWVJFZGCBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);