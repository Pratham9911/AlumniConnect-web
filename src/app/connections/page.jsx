'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/firebase/config';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import Link from 'next/link';
import { MessageCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ConnectionsPage() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const uids = userDoc.data()?.connections || [];

      const results = await Promise.all(
        uids.map(async (uid) => {
          const snap = await getDoc(doc(db, 'users', uid));
          return { uid, ...snap.data() };
        })
      );

      setConnections(results);
      setLoading(false);
    };

    fetchConnections();
  }, [currentUser]);

  const handleDelete = async (uidToRemove) => {
    if (!confirm('Are you sure you want to remove this connection?')) return;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        connections: arrayRemove(uidToRemove),
      });
      setConnections((prev) => prev.filter((c) => c.uid !== uidToRemove));
    } catch (err) {
      console.error('Failed to delete connection:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar user={currentUser} />
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Your Connections  {connections.length}</h1>
      {connections.length === 0 ? (
        <p className="text-sm text-gray-500">No connections yet.</p>
      ) : (
        connections.map((user) => (
          <div
            key={user.uid}
            className="flex items-center justify-between p-4 border rounded-md"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--sidebar-border)',
              color: 'var(--foreground)',
            }}
          >
            <Link
              href={`/profile/${user.uid}`}
              className="flex items-center gap-4 hover:underline flex-1"
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={user.name}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-sm">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-[var(--search-placeholder)]">
                  {user.role || 'No role set'}
                </span>
              </div>
            </Link>

            <div className="flex gap-2">
              <button className="text-blue-500 hover:text-blue-700">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(user.uid)}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
    
  );
}
