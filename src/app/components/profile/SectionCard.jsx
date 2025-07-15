// components/profile/SectionCard.jsx

'use client';

import { useState, useRef } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AddEntryDialog from '@/app/components/profile/Dialogs/AddEntryDialog';
import EditSectionDialog from '@/app/components/profile/Dialogs/EditSectionDialog';
import EntryCard from '@/app/components/profile/EntryCard';

export default function SectionCard({ uid, section, isOwner, refetchSections }) {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const longPressTimer = useRef(null);

  const handleDeleteSection = async () => {
    if (!confirm('Delete this section?')) return;
    await deleteDoc(doc(db, 'users', uid, 'profileSections', section.id));
    refetchSections?.();
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => setShowMobileActions(true), 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  return (
    <div
      className="relative group border border-gray-200 bg-white rounded-lg p-4 shadow hover:shadow-md transition"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>

        {isOwner && (
          <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEditSection(true)}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-black"
              title="Edit Section"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDeleteSection}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-red-600"
              title="Delete Section"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setShowAddEntry(true)}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-black"
              title="Add Entry"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Entries */}
      <ul className="space-y-3">
        {section.entries.length > 0 ? (
          section.entries.map((entry) => (
            <EntryCard
              key={entry.id}
              uid={uid}
              sectionId={section.id}
              entry={entry}
              isOwner={isOwner}
              refetchSections={refetchSections}
            />
          ))
        ) : (
          <li className="text-gray-500 italic">No entries added yet.</li>
        )}
      </ul>

      {showAddEntry && (
        <AddEntryDialog
          uid={uid}
          sectionId={section.id}
          onClose={() => {
            setShowAddEntry(false);
            refetchSections?.();
          }}
        />
      )}

      {showEditSection && (
        <EditSectionDialog
          uid={uid}
          sectionId={section.id}
          currentTitle={section.title}
          onClose={() => {
            setShowEditSection(false);
            refetchSections?.();
          }}
        />
      )}

      {isOwner && showMobileActions && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 md:hidden">
          <div className="bg-white w-full max-w-xs rounded-lg p-4 space-y-3">
            <button
              onClick={() => {
                setShowEditSection(true);
                setShowMobileActions(false);
              }}
              className="w-full text-sm px-4 py-2 rounded bg-gray-100 text-black hover:bg-gray-200"
            >
              ✏️ Edit Section
            </button>
            <button
              onClick={() => {
                setShowAddEntry(true);
                setShowMobileActions(false);
              }}
              className="w-full text-sm px-4 py-2 rounded bg-gray-100 text-black hover:bg-gray-200"
            >
              ➕ Add Entry
            </button>
            <button
              onClick={() => {
                handleDeleteSection();
                setShowMobileActions(false);
              }}
              className="w-full text-sm px-4 py-2 rounded bg-gray-100 text-red-600 hover:bg-red-200"
            >
              🗑️ Delete Section
            </button>
            <button
              onClick={() => setShowMobileActions(false)}
              className="w-full text-sm px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
