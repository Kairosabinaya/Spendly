'use client';

import dynamic from 'next/dynamic';

const EnhancedRegister = dynamic(() => import('@/components/EnhancedRegister'), {
  ssr: false,
});

export default function RegisterPage() {
  return <EnhancedRegister />;
} 