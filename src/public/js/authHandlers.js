// public/js/authHandlers.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Email signup
document.getElementById('signupBtn').addEventListener('click', async () => {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    alert('Sign up successful!');
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

// Email login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    window.location.href = '/html/home.html';
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

// Google sign in
const provider = new GoogleAuthProvider();
document.getElementById('googleSignInBtn').addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign in:', result.user);
    window.location.href = '/html/home.html';
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
