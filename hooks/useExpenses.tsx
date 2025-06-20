"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirebaseError } from '@/utils/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: Date;
  note?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseData {
  amount: number;
  category: string;
  date: string;
  description?: string;
  note?: string;
}

export interface MonthlyTrendItem {
  month: string;
  total: number;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const expensesQuery = query(
        collection(db, 'users', currentUser.uid, 'expenses'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        expensesQuery, 
        (snapshot) => {
          try {
            const expensesData: Expense[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                date: data.date?.toDate() || new Date(), // Safe fallback for date
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
              };
            }) as Expense[];
            setExpenses(expensesData);
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing expenses data:', err);
            setError('Failed to process expenses data');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error loading expenses:', error);
          setError(handleFirebaseError(error));
          setLoading(false);
          toast.error('Failed to load expenses');
        }
      );

      unsubscribeRef.current = unsubscribe;
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error setting up expenses listener:', error);
      setError('Failed to setup expenses listener');
      setLoading(false);
    }
  }, [currentUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const addExpense = useCallback(async (expenseData: ExpenseData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to add expenses');
    }
    
    try {
      // Validate expense data
      if (!expenseData.amount || expenseData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!expenseData.category || expenseData.category.trim() === '') {
        throw new Error('Category is required');
      }
      if (!expenseData.date) {
        throw new Error('Date is required');
      }

      const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'expenses'), {
        ...expenseData,
        amount: Number(expenseData.amount), // Ensure it's a number
        date: Timestamp.fromDate(new Date(expenseData.date)),
        createdAt: Timestamp.now()
      });
      
      toast.success('Expense added successfully!');
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding expense:', error);
      const errorMessage = handleFirebaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  const updateExpense = useCallback(async (expenseId: string, expenseData: ExpenseData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update expenses');
    }
    
    try {
      // Validate expense data
      if (!expenseData.amount || expenseData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!expenseData.category || expenseData.category.trim() === '') {
        throw new Error('Category is required');
      }
      if (!expenseData.date) {
        throw new Error('Date is required');
      }

      const expenseRef = doc(db, 'users', currentUser.uid, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        ...expenseData,
        amount: Number(expenseData.amount), // Ensure it's a number
        date: Timestamp.fromDate(new Date(expenseData.date)),
        updatedAt: Timestamp.now()
      });
      
      toast.success('Expense updated successfully!');
    } catch (error: any) {
      console.error('Error updating expense:', error);
      const errorMessage = handleFirebaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to delete expenses');
    }
    
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'expenses', expenseId));
      toast.success('Expense deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      const errorMessage = handleFirebaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [currentUser]);

  // Analytics helpers
  const getMonthlyTotal = (month: number, year: number): number => {
    return expenses
      .filter(expense => {
        const expenseDate = expense.date;
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryBreakdown = (): Record<string, number> => {
    const categories: Record<string, number> = {};
    expenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return categories;
  };

  const getMonthlyTrend = (months: number = 6): MonthlyTrendItem[] => {
    const trend: MonthlyTrendItem[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = getMonthlyTotal(month.getMonth(), month.getFullYear());
      trend.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total
      });
    }
    
    return trend;
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlyTotal,
    getCategoryBreakdown,
    getMonthlyTrend
  };
};

// Default export for better compatibility
export default useExpenses; 