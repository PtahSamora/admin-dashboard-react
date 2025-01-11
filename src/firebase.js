// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdaWwiSMaStAbLEx42xaOpkTg6pj1moiY",
  authDomain: "carnate-management-system.firebaseapp.com",
  projectId: "carnate-management-system",
  storageBucket: "carnate-management-system.firebasestorage.app",
  messagingSenderId: "772898750897",
  appId: "1:772898750897:web:8fb7181eac971a71f2fd90",
  measurementId: "G-QHNPVX6E24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore instance
export { db, analytics };
