// components/profile/SectionList.jsx

'use client';

import { Plus, Trash2, Pencil } from 'lucide-react';
import React from 'react';

export default function SectionList({ uid, isOwner, sections }) {
  return (
    <div className="mt-8 space-y-8">
      {sections.map((section) => (
        <div
          key={section.id}
          className="relative group border border-gray-200 bg-white rounded-lg p-4 shadow hover:shadow-md transition"
        >
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {section.title}
            </h3>
            {isOwner && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded bg-gray-100 hover:bg-gray-200" title="Edit Section">
                  <Pencil size={16} />
                </button>
                <button className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-red-600" title="Delete Section">
                  <Trash2 size={16} />
                </button>
                <button className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-green-600" title="Add Entry">
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Entries */}
          <ul className="space-y-3">
            {section.entries.length > 0 ? (
              section.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex justify-between items-center border border-gray-100 rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{entry.title}</p>
                    {entry.subtitle && (
                      <p className="text-sm text-gray-600">{entry.subtitle}</p>
                    )}
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        title="Edit Entry"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-gray-200 text-red-600"
                        title="Delete Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No entries added yet.</li>
            )}
          </ul>
        </div>
      ))}

      {/* Add Section Button */}
      {isOwner && (
        <div className="text-center pt-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <Plus size={16} /> Add Section
          </button>
        </div>
      )}
    </div>
  );
}
