"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseInitialized, handleFirebaseError } from '@/utils/firebase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    if (!isFirebaseInitialized) {
      const errorMsg = 'Firebase is not properly configured. Please check your environment variables.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      clearError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return result;
    } catch (error: any) {
      const errorMsg = handleFirebaseError(error);
      setError(errorMsg);
      toast.error(errorMsg);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    if (!isFirebaseInitialized) {
      const errorMsg = 'Firebase is not properly configured. Please check your environment variables.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      clearError();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        profile: {
          displayName: '',
          monthlyIncome: 0,
          budgetGoal: 0,
          currency: 'IDR'
        }
      });
      
      toast.success('Account created successfully!');
      return userCredential;
    } catch (error: any) {
      const errorMsg = handleFirebaseError(error);
      setError(errorMsg);
      toast.error(errorMsg);
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized, logout not available');
      return Promise.resolve();
    }
    
    try {
      clearError();
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      const errorMsg = handleFirebaseError(error);
      setError(errorMsg);
      toast.error(errorMsg);
      throw error;
    }
  };

  useEffect(() => {
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Authentication features will not work.');
      setError('Firebase not properly configured');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        clearError();
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(handleFirebaseError(error));
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseInitialized]);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 