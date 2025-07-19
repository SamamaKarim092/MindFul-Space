// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7YA3arZ8UFq8N9I0qhyntEaL7lz_M4_g",
  authDomain: "mental-health-e9645.firebaseapp.com",
  projectId: "mental-health-e9645",
  storageBucket: "mental-health-e9645.firebasestorage.app",
  messagingSenderId: "24723905332",
  appId: "1:24723905332:web:9bd409d5529e9861a16361",
  measurementId: "G-2XYSQ013Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };
