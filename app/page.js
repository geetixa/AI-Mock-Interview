"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard when the page loads
    router.push('/dashboard');
  }, [router]);

  return null;  // Return nothing as the page will redirect immediately
}
