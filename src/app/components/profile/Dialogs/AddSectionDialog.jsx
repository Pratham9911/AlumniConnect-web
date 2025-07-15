// components/profile/dialogs/AddSectionDialog.jsx

'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { v4 as uuidv4 } from 'uuid';

export default function AddSectionDialog({ uid, onClose }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSection = async () => {
    if (!title.trim()) return alert('Section title is required');

    try {
      setLoading(true);
      const sectionId = uuidv4();
      await setDoc(doc(db, 'users', uid, 'profileSections', sectionId), {
        title: title.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to add section', err);
      alert('Error adding section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 text-black bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add Section</h2>

        <input
          type="text"
          placeholder="e.g., Skills, Projects"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSection}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
