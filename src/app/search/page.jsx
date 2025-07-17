'use client';

import SearchUsers from '@/app/components/SearchUsers';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-6"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
    
      <SearchUsers />
    </main>
  );
}
