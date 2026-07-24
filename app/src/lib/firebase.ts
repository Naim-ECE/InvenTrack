import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (projectId ? `${projectId}.firebaseapp.com` : '');

if (!apiKey || !projectId || !authDomain) {
  throw new Error('Firebase client configuration is incomplete. Check VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_AUTH_DOMAIN.');
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
