'use client';

import dynamic from 'next/dynamic';

// Import the enhanced analytics component with no SSR
const EnhancedAnalytics = dynamic(() => import('@/components/EnhancedAnalytics'), {
  ssr: false,
});

export default function AnalyticsPage() {
  return <EnhancedAnalytics />;
} 