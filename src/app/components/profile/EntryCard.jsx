// components/profile/EntryCard.jsx

'use client';

import { Trash2, Pencil } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import EditEntryDialog from '@/app/components/profile/Dialogs/EditEntryDialog';
import { useState } from 'react';

export default function EntryCard({ uid, sectionId, entry, isOwner, refetchSections }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return;
    await deleteDoc(doc(db, 'users', uid, 'profileSections', sectionId, 'entries', entry.id));
      refetchSections?.();
};

  const isValidLink = entry.link && /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(entry.link);

  return (
    <li className="flex justify-between items-center border border-gray-100 rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100">
      <div>
        <p className="font-medium text-gray-800">{entry.title}</p>
        <p className="text-sm text-gray-600">{entry.subtitle}</p>
        {isValidLink && (
          <a
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black hover:underline mt-1 block"
          >
            View Link
          </a>
        )}
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <button className="p-1 rounded text-black hover:bg-gray-200 "title="Edit" onClick={() => setShowEdit(true)}>
            <Pencil size={14} />
          </button>
          <button className="p-1 rounded hover:bg-gray-200 text-red-600" title="Delete" onClick={handleDelete}>
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {showEdit && (
     <EditEntryDialog
  uid={uid}
  sectionId={sectionId}
  entry={entry}
  onClose={() => setShowEdit(false)}
  refetchSections={refetchSections}
/>

      )}
    </li>
  );
}
