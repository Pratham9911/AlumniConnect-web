// components/profile/dialogs/EditEntryDialog.jsx

'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export default function EditEntryDialog({ uid, sectionId, entry, onClose, refetchSections }) {
  const [title, setTitle] = useState(entry.title);
  const [subtitle, setSubtitle] = useState(entry.subtitle);
  const [link, setLink] = useState(entry.link || '');
  const [loading, setLoading] = useState(false);

  const isValidLink = (url) => {
    if (!url) return true;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url);
  };

  const handleUpdateEntry = async () => {
    if (!title.trim() || !subtitle.trim()) {
      alert('Title and Subtitle are required');
      return;
    }

    if (link && !isValidLink(link)) {
      alert('Invalid link');
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', uid, 'profileSections', sectionId, 'entries', entry.id), {
        title: title.trim(),
        subtitle: subtitle.trim(),
        link: link ? (link.startsWith('http') ? link : 'https://' + link) : '',
      });
      onClose();
      refetchSections?.();
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Failed to update entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 text-black bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Entry</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="Optional Link"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateEntry}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
