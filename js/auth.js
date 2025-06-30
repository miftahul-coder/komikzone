import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Login dengan Google
window.loginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(() => location.reload())
    .catch(err => alert(err.message));
};

// Logout
window.logout = () => {
  signOut(auth).then(() => location.reload());
};

// Cek Status Login
onAuthStateChanged(auth, (user) => {
  const userSection = document.getElementById('userSection');
  const loginSection = document.getElementById('loginSection');
  if (user) {
    if (userSection) userSection.style.display = 'block';
    if (loginSection) loginSection.style.display = 'none';
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.displayName || user.email;
    // Load data user (favorit, lanjut membaca)
  } else {
    if (userSection) userSection.style.display = 'none';
    if (loginSection) loginSection.style.display = 'block';
  }
});
