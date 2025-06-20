"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirebaseError } from '@/utils/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  userId?: string; // For custom categories
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryData {
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

// Default categories as fallback
export const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    name: 'Food & Dining',
    icon: 'FoodIcon',
    color: 'from-orange-500 to-red-500',
    isActive: true,
  },
  {
    name: 'Transportation',
    icon: 'TransportIcon',
    color: 'from-blue-500 to-cyan-500',
    isActive: true,
  },
  {
    name: 'Shopping',
    icon: 'ShoppingIcon',
    color: 'from-purple-500 to-pink-500',
    isActive: true,
  },
  {
    name: 'Entertainment',
    icon: 'EntertainmentIcon',
    color: 'from-green-500 to-emerald-500',
    isActive: true,
  },
  {
    name: 'Bills & Utilities',
    icon: 'BillsIcon',
    color: 'from-yellow-500 to-orange-500',
    isActive: true,
  },
  {
    name: 'Healthcare',
    icon: 'HealthIcon',
    color: 'from-red-500 to-pink-500',
    isActive: true,
  },
  {
    name: 'Travel',
    icon: 'TravelIcon',
    color: 'from-indigo-500 to-purple-500',
    isActive: true,
  },
  {
    name: 'Education',
    icon: 'EducationIcon',
    color: 'from-teal-500 to-cyan-500',
    isActive: true,
  },
  {
    name: 'Groceries',
    icon: 'FoodIcon',
    color: 'from-emerald-500 to-green-500',
    isActive: true,
  },
  {
    name: 'Other',
    icon: 'MoneyIcon',
    color: 'from-gray-500 to-slate-500',
    isActive: true,
  }
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Use refs to track unsubscribe functions for proper cleanup
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Cleanup function
  const cleanup = useCallback(() => {
    unsubscribeRefs.current.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    });
    unsubscribeRefs.current = [];
  }, []);

  // Load categories with simplified approach
  useEffect(() => {
    // Cleanup previous listeners
    cleanup();

    if (!currentUser) {
      // Use default categories for non-authenticated users
      const defaultCats = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `default-${index}`,
      }));
      setCategories(defaultCats);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Simple query for user categories only (no complex joins)
      const userCategoriesQuery = query(
        collection(db, 'users', currentUser.uid, 'categories'),
        where('isActive', '==', true)
      );

      const unsubscribe = onSnapshot(
        userCategoriesQuery,
        (snapshot) => {
          try {
            const userCats: Category[] = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate()
            })) as Category[];

            // If user has no custom categories, use defaults
            if (userCats.length === 0) {
              const defaultCats = DEFAULT_CATEGORIES.map((cat, index) => ({
                ...cat,
                id: `default-${index}`,
              }));
              setCategories(defaultCats);
            } else {
              setCategories(userCats);
            }
            setLoading(false);
          } catch (error) {
            console.error('Error processing categories:', error);
            // Fallback to defaults
            const defaultCats = DEFAULT_CATEGORIES.map((cat, index) => ({
              ...cat,
              id: `default-${index}`,
            }));
            setCategories(defaultCats);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error loading user categories:', error);
          // Fallback to defaults on error
          const defaultCats = DEFAULT_CATEGORIES.map((cat, index) => ({
            ...cat,
            id: `default-${index}`,
          }));
          setCategories(defaultCats);
          setLoading(false);
        }
      );

      // Store unsubscribe function
      unsubscribeRefs.current.push(unsubscribe);

    } catch (error) {
      console.error('Error setting up categories listener:', error);
      // Fallback to defaults
      const defaultCats = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `default-${index}`,
      }));
      setCategories(defaultCats);
      setLoading(false);
    }

    // Cleanup function
    return cleanup;
  }, [currentUser, cleanup]);

  // Get active categories only
  const getActiveCategories = useCallback((): Category[] => {
    return categories.filter(cat => cat.isActive);
  }, [categories]);

  // Add custom category
  const addCategory = useCallback(async (categoryData: CategoryData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to add categories');
    }
    
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'categories'), {
        ...categoryData,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      toast.success('Category added successfully!');
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error);
      console.error('Error adding category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  // Update category
  const updateCategory = useCallback(async (categoryId: string, categoryData: CategoryData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update categories');
    }
    
    try {
      const categoryRef = doc(db, 'users', currentUser.uid, 'categories', categoryId);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: Timestamp.now()
      });
      toast.success('Category updated successfully!');
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error);
      console.error('Error updating category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  // Delete category (soft delete by setting isActive to false)
  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to delete categories');
    }
    
    try {
      const categoryRef = doc(db, 'users', currentUser.uid, 'categories', categoryId);
      await updateDoc(categoryRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error);
      console.error('Error deleting category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  // Seed default categories for new users
  const seedDefaultCategories = useCallback(async (): Promise<void> => {
    if (!currentUser) return;

    try {
      // Check if user already has categories
      const userCategoriesSnapshot = await getDocs(
        collection(db, 'users', currentUser.uid, 'categories')
      );
      
      if (userCategoriesSnapshot.empty) {
        console.log('Seeding default categories for new user...');
        
        // Add default categories to user's custom categories
        const promises = DEFAULT_CATEGORIES.map(category =>
          addDoc(collection(db, 'users', currentUser.uid, 'categories'), {
            ...category,
            userId: currentUser.uid,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          })
        );
        
        await Promise.all(promises);
        console.log('Default categories seeded for user');
      }
    } catch (error) {
      console.error('Error seeding default categories:', error);
      // Don't throw error, just log it
    }
  }, [currentUser]);

  // Helper functions
  const getCategoryByName = useCallback((name: string): Category | undefined => {
    return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
  }, [categories]);

  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const categoryExists = useCallback((name: string, excludeId?: string): boolean => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      cat.id !== excludeId
    );
  }, [categories]);

  return {
    categories,
    loading,
    getActiveCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    seedDefaultCategories,
    getCategoryByName,
    getCategoryById,
    categoryExists
  };
};

export default useCategories; 