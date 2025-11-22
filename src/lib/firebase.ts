import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArUjDIHYKXRfK6wvGm2MHzNg6iXZluF28",
  authDomain: "bithackthon.firebaseapp.com",
  projectId: "bithackthon",
  storageBucket: "bithackthon.firebasestorage.app",
  messagingSenderId: "975829454198",
  appId: "1:975829454198:web:82207b57e5f49d76b5fe57",
  measurementId: "G-9VT3DVQF2L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
