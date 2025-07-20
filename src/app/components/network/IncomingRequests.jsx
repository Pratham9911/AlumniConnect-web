'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/firebase/config';
import Link from 'next/link';

export default function IncomingRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;

     const reqSnap = await getDocs(
  collection(db, 'connectionRequests', currentUser.uid, 'requests')
);


      const requestPromises = reqSnap.docs.map(async (docSnap) => {
        const senderUid = docSnap.data()?.senderUid;
        const senderDoc = await getDoc(doc(db, 'users', senderUid));
        return {
          uid: senderUid,
          ...senderDoc.data(),
        };
      });

      const results = await Promise.all(requestPromises);
      setRequests(results);
      setLoading(false);
    };

    fetchRequests();
  }, [currentUser]);

const handleAccept = async (senderUid) => {
  const receiverUid = currentUser.uid;

  const receiverRef = doc(db, 'users', receiverUid);
  const senderRef = doc(db, 'users', senderUid);

  const [receiverSnap, senderSnap] = await Promise.all([
    getDoc(receiverRef),
    getDoc(senderRef),
  ]);

  const receiverConnections = receiverSnap.data()?.connections || [];
  const senderConnections = senderSnap.data()?.connections || [];

  // Add A → B if not already
  if (!receiverConnections.includes(senderUid)) {
    await updateDoc(receiverRef, {
      connections: [...receiverConnections, senderUid],
    });
  }

  // Add B → A if not already
  if (!senderConnections.includes(receiverUid)) {
    await updateDoc(senderRef, {
      connections: [...senderConnections, receiverUid],
    });
  }

  // Delete request (from A → B)
  const reqRef = doc(
    db,
    'connectionRequests',
    receiverUid,
    'requests',
    `from_${senderUid}`
  );
  await deleteDoc(reqRef);

  // Optionally remove B from A's pendingConnections
  await updateDoc(senderRef, {
    pendingConnections: arrayRemove(receiverUid),
  });

  setRequests((prev) => prev.filter((u) => u.uid !== senderUid));
};

const handleDecline = async (senderUid) => {
  const receiverUid = currentUser.uid;

  try {
    // Only B deletes the request they received from A
    const reqRef = doc(
      db,
      'connectionRequests',
      receiverUid,
      'requests',
      `from_${senderUid}`
    );
    await deleteDoc(reqRef);

    // Remove it from UI
    setRequests((prev) => prev.filter((u) => u.uid !== senderUid));
  } catch (err) {
    console.error('Failed to decline request:', err);
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return <p className="text-sm text-gray-500">No incoming requests</p>;
  }

  return (
  <div className="space-y-4">
    {requests.map((user) => (
      <div
        key={user.uid}
        className="flex items-center justify-between gap-4 p-4 border rounded-md"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--sidebar-border)',
          color: 'var(--foreground)',
        }}
      >
        <Link
          href={`/profile/${user.uid}`}
          className="flex items-center gap-4 flex-1"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border"
              style={{ borderColor: 'var(--sidebar-border1)' }}
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-sm font-bold">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold truncate">{user.name}</span>
            <span className="text-sm text-[var(--search-placeholder)] truncate max-w-[120px] sm:max-w-none">
              {user.role || 'No role set'}
            </span>
          </div>
        </Link>

       <div className="flex gap-2 items-center">
  <button
  onClick={() => handleAccept(user.uid)}
  className="w-9 h-9 flex items-center justify-center rounded-full border border-green-500 text-green-500 hover:text-white hover:bg-green-500 transition"
  aria-label="Accept"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</button>


 <button
  onClick={() => handleDecline(user.uid)}
  className="w-9 h-9 flex items-center justify-center rounded-full border border-red-400 text-red-500 hover:bg-red-400 transition group"
  aria-label="Decline"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 stroke-current text-red-500 group-hover:text-white transition"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>


</div>

      </div>
    ))}
  </div>
);

}
