'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Par défaut, on redirige vers le portail Mairie
    router.push('/mairie');
  }, []);

  return null;
}
