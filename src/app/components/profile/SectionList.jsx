// components/profile/ProfileSections.jsx

'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import SectionCard from '@/app/components/profile/SectionCard';
import AddSectionDialog from '@/app/components/profile/Dialogs/AddSectionDialog';
import { Plus } from 'lucide-react';

export default function SectionList({ uid, isOwner }) {
  const [sections, setSections] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  
  useEffect(() => {
    const q = query(collection(db, 'users', uid, 'profileSections'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedSections = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const sectionId = docSnap.id;
          const sectionData = docSnap.data();
          const entriesSnap = await getDocs(collection(db, 'users', uid, 'profileSections', sectionId, 'entries'));
          const entries = entriesSnap.docs.map(entry => ({ id: entry.id, ...entry.data() }));

          return {
            id: sectionId,
            title: sectionData.title,
            entries,
          };
        })
      );
      setSections(fetchedSections);
    });

    return () => unsubscribe();
  }, [uid]);

  const fetchSections = async () => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'profileSections'));
  const data = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const entriesSnap = await getDocs(collection(docSnap.ref, 'entries'));
      return {
        id: docSnap.id,
        ...docSnap.data(),
        entries: entriesSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() })),
      };
    })
  );
  setSections(data);
};

  return (
    <div className="mt-10 space-y-8">
      {isOwner && (
        <div className="text-left mb-4">
          <button
            onClick={() => setShowAddDialog(true)}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-all"
          >
            <Plus size={16} /> Add Section
          </button>
        </div>
      )}

      {sections.map((section) => (
    <SectionCard
  key={section.id}
  uid={uid}
  isOwner={isOwner}
  section={section}
  refetchSections={fetchSections}
/>

      ))}

      {showAddDialog && (
        <AddSectionDialog uid={uid} onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
}
