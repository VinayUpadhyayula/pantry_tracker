// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6-AcTGGWxH15shL4y1uHO6EdNfV1QIFk",
  authDomain: "pantry-tracker-e99ca.firebaseapp.com",
  projectId: "pantry-tracker-e99ca",
  storageBucket: "pantry-tracker-e99ca.appspot.com",
  messagingSenderId: "232387156646",
  appId: "1:232387156646:web:84a45cf0a8d1377abbf267",
  measurementId: "G-178N71JTMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);