"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPageComponent from '@/components/LoginPage';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <LoginPageComponent onLoginSuccess={handleLoginSuccess} />
  );
}
