// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// WARNING: These values should be loaded from environment variables at build time.
// If using a bundler, replace with import.meta.env.VITE_FIREBASE_* or process.env.*
const firebaseConfig = {
  apiKey: window.__FIREBASE_CONFIG__?.apiKey || "MISSING_API_KEY",
  authDomain: window.__FIREBASE_CONFIG__?.authDomain || "MISSING_AUTH_DOMAIN",
  projectId: window.__FIREBASE_CONFIG__?.projectId || "MISSING_PROJECT_ID",
  storageBucket:
    window.__FIREBASE_CONFIG__?.storageBucket || "MISSING_STORAGE_BUCKET",
  messagingSenderId:
    window.__FIREBASE_CONFIG__?.messagingSenderId || "MISSING_SENDER_ID",
  appId: window.__FIREBASE_CONFIG__?.appId || "MISSING_APP_ID",
  measurementId: window.__FIREBASE_CONFIG__?.measurementId || undefined,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };
