'use client';

import dynamic from 'next/dynamic';

// Import the category management component with no SSR
const CategoryManagement = dynamic(() => import('@/components/CategoryManagement'), {
  ssr: false,
});

export default function CategoriesPage() {
  return <CategoryManagement />;
} 