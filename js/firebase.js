// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmA4uDBC22znLItHlklu1k1MlLC04VGyY",
  authDomain: "nagaland-skilled-services.firebaseapp.com",
  projectId: "nagaland-skilled-services",
  storageBucket: "nagaland-skilled-services.firebasestorage.app",
  messagingSenderId: "976413470500",
  appId: "1:976413470500:web:d068b7effb418415d5cdb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

console.log("✅ Firebase Connected Successfully!");
console.log("✅ Firestore Ready!");

export { db, auth };

