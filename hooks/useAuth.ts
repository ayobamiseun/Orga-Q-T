"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export const useAuth = (): boolean => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('organUserToken');
    if (token) {
      setAuthenticated(true);
    } else {
      router.push('/register');
    }
  }, [router]);

  return authenticated;
};