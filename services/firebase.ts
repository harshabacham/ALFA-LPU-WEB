
// @ts-ignore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
// @ts-ignore
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
// @ts-ignore
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

/**
 * ACTIVE FIREBASE CONFIGURATION
 * Connected to: alfa-lpu
 */
const firebaseConfig = {
  apiKey: "AIzaSyBFEvc6gpWXf6QnBAlmrYXS6EIkdMopqPA",
  authDomain: "alfa-lpu.firebaseapp.com",
  projectId: "alfa-lpu",
  storageBucket: "alfa-lpu.firebasestorage.app",
  messagingSenderId: "782878893322",
  appId: "1:782878893322:web:022ef756098f28d98a06f3",
  measurementId: "G-ZQYYCFW8S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Customizing provider to always prompt for account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
export type { User };
