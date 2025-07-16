'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/app/firebase/config';
import { db } from '@/app/firebase/config';

import UserHeader from '@/app/components/profile/UserHeader';
import SectionList from '@/app/components/profile/SectionList';
import Navbar from '@/app/components/Navbar';

export default function ProfilePage() {
  const { uid } = useParams();
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.uid === uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());

          const sectionRef = collection(db, 'users', uid, 'profileSections');
          const sectionSnap = await getDocs(sectionRef);

          const sectionData = await Promise.all(
            sectionSnap.docs.map(async (sectionDoc) => {
              const entriesRef = collection(db, 'users', uid, 'profileSections', sectionDoc.id, 'entries');
              const entriesSnap = await getDocs(entriesRef);
              return {
                id: sectionDoc.id,
                title: sectionDoc.data().title,
                entries: entriesSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
              };
            })
          );

          setSections(sectionData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchData();
  }, [uid]);

  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      
    </div>
  );
}

  if (!userData) return <div className="p-6 text-red-500">User not found.</div>;

  return (
   <main className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
   <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-8 space-y-8">

        <UserHeader user={userData} isOwner={isOwner} />
        <SectionList uid={uid} isOwner={isOwner} sections={sections} />
      </div>
    </main>
  );
}
