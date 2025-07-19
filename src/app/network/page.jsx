// app/network/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import Navbar from '../components/Navbar';
import IncomingRequests from '../components/network/IncomingRequests';
import PendingRequests from './PendingRequests';
import { ArrowRight } from 'lucide-react';

export default function NetworkPage() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };

    fetchUser();
  }, [currentUser]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

  </div>;

  return (
    <>
      <Navbar user={userData} />
      <main
        className="min-h-screen px-4 py-6 space-y-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
            <h1 className="text-2xl font-bold">My Network</h1>
          <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
            <span>Your Connections</span>
            <a
              href="/connections"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-4 h-4" />
            </a>
          </h2>

          <div id="my-connections" className="space-y-4">
            {/* We'll populate this later */}
          </div>
        </section>


        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
          <PendingRequests />
        </section>
        {/* Section 1: Incoming Requests */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Connection Requests</h2>
          <IncomingRequests />
        </section>

        {/* Section 2: My Connections */}
      

        {/* Section 3: Similar Profiles (later) */}
      </main>
    </>
  );
}
