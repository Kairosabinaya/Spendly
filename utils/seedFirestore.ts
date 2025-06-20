"use client";

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

interface SampleExpense {
  amount: number;
  category: string;
  date: Date;
  note: string;
}

// Sample expense data for testing
const sampleExpenses: SampleExpense[] = [
  {
    amount: 52.00,
    category: "Food & Dining",
    date: new Date('2024-01-15'),
    note: "Groceries for the week"
  },
  {
    amount: 25.50,
    category: "Transportation",
    date: new Date('2024-01-14'),
    note: "Gas station fill-up"
  },
  {
    amount: 89.99,
    category: "Shopping",
    date: new Date('2024-01-13'),
    note: "New shoes"
  },
  {
    amount: 15.75,
    category: "Entertainment",
    date: new Date('2024-01-12'),
    note: "Movie tickets"
  },
  {
    amount: 120.00,
    category: "Bills & Utilities",
    date: new Date('2024-01-11'),
    note: "Monthly internet bill"
  },
  {
    amount: 35.20,
    category: "Healthcare",
    date: new Date('2024-01-10'),
    note: "Pharmacy prescription"
  },
  {
    amount: 200.00,
    category: "Travel",
    date: new Date('2024-01-09'),
    note: "Hotel booking"
  },
  {
    amount: 45.00,
    category: "Education",
    date: new Date('2024-01-08'),
    note: "Online course subscription"
  },
  {
    amount: 67.89,
    category: "Groceries",
    date: new Date('2024-01-07'),
    note: "Weekly grocery shopping"
  },
  {
    amount: 12.50,
    category: "Other",
    date: new Date('2024-01-06'),
    note: "Coffee with friends"
  }
];

export const seedFirestore = async (userId: string): Promise<void> => {
  if (!userId) {
    console.error("User ID is required to seed Firestore");
    return;
  }

  try {
    console.log("Seeding Firestore with sample expenses...");
    
    for (const expense of sampleExpenses) {
      await addDoc(collection(db, 'users', userId, 'expenses'), {
        ...expense,
        date: Timestamp.fromDate(expense.date),
        createdAt: Timestamp.now()
      });
    }
    
    console.log("Successfully seeded Firestore with sample data!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
};

// Helper function to clear all expenses (for testing)
export const clearUserExpenses = async (userId: string): Promise<void> => {
  if (!userId) {
    console.error("User ID is required to clear expenses");
    return;
  }

  try {
    const expensesRef = collection(db, 'users', userId, 'expenses');
    // Note: In a real app, you'd want to batch delete these
    console.log("This function would clear all user expenses");
  } catch (error) {
    console.error("Error clearing expenses:", error);
  }
}; 