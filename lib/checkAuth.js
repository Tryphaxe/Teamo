"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSessionCheck() {
  const [expired, setExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.status === 401) {
          setExpired(true);
        }
      } catch (error) {
        console.error(error);
      }
    }, 60_000); // Vérifie toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Redirection après fermeture du modal
  useEffect(() => {
    if (expired) {
      setTimeout(() => {
        router.replace('/auth/login');
      }, 3000);
    }
  }, [expired, router]);

  return { expired, setExpired };
}
