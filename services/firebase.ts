
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

/**
 * ACTIVE FIREBASE CONFIGURATION
 * Connected to: alfa-lpu
 */
const firebaseConfig = {
  apiKey: "AIzaSyB_ZrbBhBV934mZZRtSGCrK9iOtOt1J92U",
  authDomain: "alfa-lpu.firebaseapp.com",
  projectId: "alfa-lpu",
  storageBucket: "alfa-lpu.firebasestorage.app",
  messagingSenderId: "782878893322",
  appId: "1:782878893322:web:74331553ebab20938a06f3",
  measurementId: "G-7Y29JJ04J9"
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
