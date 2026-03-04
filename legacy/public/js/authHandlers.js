// public/js/authHandlers.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Email signup
const signupBtn = document.getElementById("signupBtn");
const signupEmailEl = document.getElementById("signupEmail");
const signupPasswordEl = document.getElementById("signupPassword");

if (signupBtn && signupEmailEl && signupPasswordEl) {
  signupBtn.addEventListener("click", async () => {
    const email = signupEmailEl.value.trim();
    const password = signupPasswordEl.value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User signed up:", userCredential.user);
      alert("Sign up successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Sign up failed. Please try again.");
    }
  });
}

// Email login
const loginBtn = document.getElementById("loginBtn");
const loginEmailEl = document.getElementById("loginEmail");
const loginPasswordEl = document.getElementById("loginPassword");

if (loginBtn && loginEmailEl && loginPasswordEl) {
  loginBtn.addEventListener("click", async () => {
    const email = loginEmailEl.value.trim();
    const password = loginPasswordEl.value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User logged in:", userCredential.user);
      window.location.href = "/html/home.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  });
}

// Google sign in
const provider = new GoogleAuthProvider();
const googleSignInBtn = document.getElementById("googleSignInBtn");
if (googleSignInBtn) {
  googleSignInBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in:", result.user);
      window.location.href = "/html/home.html";
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed. Please try again.");
    }
  });
}

// Google sign up button (signup modal) — same handler
const googleSignUpBtn = document.getElementById("googleSignUpBtn");
if (googleSignUpBtn) {
  googleSignUpBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign up:", result.user);
      window.location.href = "/html/home.html";
    } catch (error) {
      console.error("Google sign-up error:", error);
      alert("Google sign-up failed. Please try again.");
    }
  });
}
