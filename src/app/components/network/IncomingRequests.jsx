'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
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
  const receiverSnap = await getDoc(receiverRef);
  const receiverConnections = receiverSnap.data()?.connections || [];

  if (!receiverConnections.includes(senderUid)) {
    await updateDoc(receiverRef, {
      connections: [...receiverConnections, senderUid],
    });
  }

  // ✅ B can delete their own incoming request
  const reqRef = doc(
    db,
    'connectionRequests',
    receiverUid,
    'requests',
    `from_${senderUid}`
  );
  await deleteDoc(reqRef);

  // ✅ Let A detect the acceptance and update themselves
  setRequests((prev) => prev.filter((u) => u.uid !== senderUid));
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
          <Link href={`/profile/${user.uid}`} className="flex items-center gap-4 flex-1 hover:underline">
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
            <div className="flex flex-col">
              <span className="font-semibold">{user.name}</span>
              <span className="text-sm text-[var(--search-placeholder)]">{user.role || 'No role set'}</span>
            </div>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(user.uid)}
              className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(user.uid)}
              className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
