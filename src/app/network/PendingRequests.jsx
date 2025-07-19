'use client';

import { useEffect, useState } from 'react';
import {
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/firebase/config';
import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function PendingRequests() {
  const { currentUser } = useAuth();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const fetchPending = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const pendingConnections = userSnap.data()?.pendingConnections || [];

        const result = [];

    for (const receiverUid of pendingConnections) {
  const receiverRef = doc(db, 'users', receiverUid);
  const receiverSnap = await getDoc(receiverRef);

  if (!receiverSnap.exists()) continue;

  const receiverData = receiverSnap.data();
  const receiverConnections = receiverData.connections || [];

  if (receiverConnections.includes(currentUser.uid)) {
    // ✅ They've accepted → mutual connection

    const latestUserSnap = await getDoc(userRef);  // ✅ fresh snapshot
    const myConnections = latestUserSnap.data()?.connections || [];

    if (!myConnections.includes(receiverUid)) {
      await updateDoc(userRef, {
        connections: [...myConnections, receiverUid],
      });
    }

    // ✅ Remove request from their side
    await deleteDoc(
      doc(
        db,
        'connectionRequests',
        receiverUid,
        'requests',
        `from_${currentUser.uid}`
      )
    );

    // ✅ Remove from my pendingConnections
    await updateDoc(userRef, {
      pendingConnections: arrayRemove(receiverUid),
    });

    continue; // Don’t show this user in pending list
  }

  result.push({
    uid: receiverUid,
    ...receiverData,
  });
}



        setPendingList(result);
      } catch (err) {
        console.error('Error fetching pending requests:', err);
      }

      setLoading(false);
    };

    fetchPending();
  }, [currentUser]);

  const handleCancel = async (receiverUid) => {
    try {
      // Remove the request from their side
      await deleteDoc(
        doc(
          db,
          'connectionRequests',
          receiverUid,
          'requests',
          `from_${currentUser.uid}`
        )
      );

      // Remove from my pendingConnections
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        pendingConnections: arrayRemove(receiverUid),
      });

      setPendingList((prev) => prev.filter((user) => user.uid !== receiverUid));
    } catch (err) {
      console.error('Error cancelling request:', err);
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
  <div className="space-y-4">
    {pendingList.length > 0 ? (
      pendingList.map((user) => (
        <div
          key={user.uid}
          className="p-4 border rounded-md flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--sidebar-border)',
            color: 'var(--foreground)',
          }}
        >
          <Link
            href={`/profile/${user.uid}`}
            className="flex items-center gap-4 flex-1 no-underline hover:no-underline"
          >
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-sm font-bold">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">{user.name}</span>
              <span className="text-sm truncate text-[var(--search-placeholder)] max-w-[120px] sm:max-w-none">
                {user.role || 'No role set'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Clock icon always, Pending text only on sm+ */}
            <span className="text-yellow-600 font-medium text-sm flex items-center">
              <Clock className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Pending</span>
            </span>

            {/* ❌ on mobile, "Cancel" text on desktop */}
           <button
  onClick={() => handleCancel(user.uid)}
  className="text-sm px-2 sm:px-3 py-1 rounded-md bg-transparent sm:bg-red-500 text-white sm:hover:bg-red-600"
  aria-label="Cancel Request"
  title="Cancel"
>
  <span className="sm:hidden">❌</span>
  <span className="hidden sm:inline">Cancel</span>
</button>

          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No pending requests.</p>
    )}
  </div>
);


}
