'use client';

import dynamic from 'next/dynamic';

// Import the enhanced settings component with no SSR
const EnhancedSettings = dynamic(() => import('@/components/EnhancedSettings'), {
  ssr: false,
});

export default function SettingsPage() {
  return <EnhancedSettings />;
} 