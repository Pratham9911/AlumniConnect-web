'use client';

import { Trash2, Pencil } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import EditEntryDialog from '@/app/components/profile/Dialogs/EditEntryDialog';
import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

export default function EntryCard({ uid, sectionId, entry, isOwner, refetchSections }) {
  const [showEdit, setShowEdit] = useState(false);
  const { theme } = useTheme();

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return;
    await deleteDoc(doc(db, 'users', uid, 'profileSections', sectionId, 'entries', entry.id));
    refetchSections?.();
  };

  const isValidLink = entry.link && /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(entry.link);

  return (
    <li
      className="flex justify-between items-center rounded-md px-4 py-2 transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--background)' : '#f9fafb', // gray-50
        border: `1px solid ${theme === 'dark' ? 'var(--sidebar-border)' : '#f3f4f6'}`,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme === 'dark' ? '#ff7300' : '#d1d5db';
        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1c1c1c' : '#f3f4f6'; // darker on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme === 'dark' ? 'var(--sidebar-border)' : '#f3f4f6';
        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'var(--background)' : '#f9fafb';
      }}
    >
      <div>
        <p
          className="font-medium"
          style={{ color: theme === 'dark' ? 'var(--foreground)' : '#1f2937' }} // text-gray-800
        >
          {entry.title}
        </p>
        <p
          className="text-sm"
          style={{ color: theme === 'dark' ? 'var(--foreground)' : '#4b5563' }} // text-gray-600
        >
          {entry.subtitle}
        </p>

        {isValidLink && (
          <a
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f3f4f6',
              color: theme === 'dark' ? '#ff7300' : '#1f2937',
              border: theme === 'dark' ? '1px solid #ff7300' : '1px solid #d1d5db',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e5e7eb';
              e.currentTarget.style.color = theme === 'dark' ? '#ffa64d' : '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f1f1f' : '#f3f4f6';
              e.currentTarget.style.color = theme === 'dark' ? '#ff7300' : '#1f2937';
            }}
          >
            🔗 View Link
          </a>
        )}
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <button
            className="p-1 rounded transition hover:bg-gray-200"
            style={{ color: theme === 'dark' ? 'var(--foreground)' : '#000000' }}
            title="Edit"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={14} />
          </button>
          <button
            className="p-1 rounded transition hover:bg-red-200"
            style={{ color: theme === 'dark' ? '#ff4d4d' : '#dc2626' }}
            title="Delete"
            onClick={handleDelete}
          >
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
