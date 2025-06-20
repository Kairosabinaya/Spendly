// Firebase configuration and setup
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}. ` +
    'Please copy env-template.txt to .env.local and fill in your Firebase credentials.';
  
  console.error(errorMessage);
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMessage);
  }
}

// Validate Firebase configuration
const validateFirebaseConfig = (config: any) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field] || config[field].includes('dummy'));
  
  if (missingFields.length > 0) {
    throw new Error(`Invalid Firebase configuration. Missing or dummy values for: ${missingFields.join(', ')}`);
  }
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let isFirebaseInitialized = false;

try {
  // Validate configuration before initializing
  if (process.env.NODE_ENV === 'production') {
    validateFirebaseConfig(firebaseConfig);
  }
  
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  isFirebaseInitialized = true;
  
  console.log('🔥 Firebase initialized successfully');
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Create safe fallbacks for development
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    signOut: () => Promise.reject(new Error('Firebase not initialized'))
  };
  
  db = {
    collection: () => Promise.reject(new Error('Firebase not initialized'))
  };
  
  isFirebaseInitialized = false;
}

// Error handling utilities
export const handleFirebaseError = (error: any) => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'permission-denied': 'You do not have permission to perform this action.',
    'unavailable': 'Service is temporarily unavailable. Please try again.',
  };

  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
};

export { auth, db, isFirebaseInitialized };
export default app; 