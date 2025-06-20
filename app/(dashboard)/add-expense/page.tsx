'use client';

import dynamic from 'next/dynamic';

// Import the enhanced add expense form with no SSR
const EnhancedAddExpense = dynamic(() => import('@/components/EnhancedAddExpense'), {
  ssr: false,
});

export default function AddExpensePage() {
  return <EnhancedAddExpense />;
} 