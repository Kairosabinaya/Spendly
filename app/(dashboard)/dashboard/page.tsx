'use client';

import dynamic from 'next/dynamic';

// Import the enhanced dashboard with no SSR to avoid hydration issues
const EnhancedDashboard = dynamic(() => import('@/components/EnhancedDashboard'), {
  ssr: false,
});

export default function DashboardPage() {
  return <EnhancedDashboard />;
}