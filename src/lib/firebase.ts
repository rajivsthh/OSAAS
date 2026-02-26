import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  Auth,
} from "firebase/auth";

// Build config from env; values may be placeholder strings when project isn't configured.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Helpers that may remain undefined if initialization is skipped.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let emailProvider: EmailAuthProvider | null = null;

// Determine whether we have a real API key before trying to initialize.
const hasKey = Boolean(firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_") && firebaseConfig.apiKey !== "");

if (hasKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    emailProvider = new EmailAuthProvider();
    // always prompt for account selection on google login
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (e) {
    // initialization failure is non-fatal; log for debugging and continue with nulls
    console.warn("Firebase init failed:", e);
    app = null;
    auth = null;
    googleProvider = null;
    emailProvider = null;
  }
} else {
  console.warn("Firebase configuration not provided; authentication disabled");
}

// exports may be null when auth is disabled
export { auth, googleProvider, emailProvider };
export default app;
