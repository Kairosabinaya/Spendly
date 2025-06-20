'use client';

import dynamic from 'next/dynamic';

const EnhancedLogin = dynamic(() => import('@/components/EnhancedLogin'), {
  ssr: false,
});

export default function LoginPage() {
  return <EnhancedLogin />;
} 