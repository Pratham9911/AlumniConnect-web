'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q)
    );
    setFilteredUsers(filtered);
  }, [query, users]);

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* ✅ Sticky Header without border */}
      <div
        className="sticky top-0 z-50 px-4 py-3 flex items-center gap-2 sm:gap-3"
        style={{
          backgroundColor: 'var(--background)',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-[var(--search-bg)] transition flex-shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" />
        </button>

        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--search-placeholder)]" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-[var(--sidebar-border)] bg-[var(--search-bg)] text-[var(--search-text)] placeholder-[var(--search-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm sm:text-base"
          />
        </div>
      </div>

      {/* 🔽 Scrollable results */}
      <div className="space-y-3 px-4 py-4">
        {query && filteredUsers.length > 0 &&
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-4 w-full p-4 rounded-md border border-[var(--sidebar-border1)] hover:bg-[var(--primary)] hover:text-white transition"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                  style={{ borderColor: 'var(--sidebar-border1)' }}
                />
              ) : (
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-sm font-bold"
                  style={{
                    color: 'var(--search-text)',
                    backgroundColor: 'var(--search-bg)',
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}

              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold truncate">{user.name}</span>
                <span className="text-sm truncate text-[var(--search-placeholder)]">
                  {user.role || 'No role set'}
                </span>
              </div>
            </Link>
          ))}

        {query && filteredUsers.length === 0 && (
          <div className="text-sm text-[var(--search-placeholder)]">No users found.</div>
        )}
      </div>
    </main>
  );
}
