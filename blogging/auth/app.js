import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDnFLDWPjlPIX7dlR7Qr3DBA5gUIsKcFw",
  authDomain: "fir-7d5b0.firebaseapp.com",
  projectId: "fir-7d5b0",
  storageBucket: "fir-7d5b0.firebasestorage.app",
  messagingSenderId: "751416229900",
  appId: "1:751416229900:web:e0db13742e82447af66e29",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function onSignup(e) {
  try {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup Successfully");
    location.href = "/editor";
  } catch (e) {
    alert(e.message);
    console.error("Signup error:", e);
  }
}

async function onSignin(e) {
  try {
    e.preventDefault();
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log(res);
    alert("Signin Successfully");
    location.href = "/editor";
  } catch (e) {
    alert("Internal Server Error");
    console.log(e);
  }
}

const signupButton = document.getElementById("signup-btn");
signupButton?.addEventListener("click", onSignup);

const signinButton = document.getElementById("signin-btn");
signinButton?.addEventListener("click", onSignin);

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "/editor";
  }
});
