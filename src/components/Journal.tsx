import React, { useState } from 'react';
import { BookOpen, Save } from 'lucide-react';
import type { JournalEntry } from '../types';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (content: string) => void;
}

export default function Journal({ entries, onAddEntry }: JournalProps) {
  const [newEntry, setNewEntry] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-sky-500" />
          <h2 className="text-xl font-semibold text-gray-800">Journal Entry</h2>
        </div>
        
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          placeholder="Write your thoughts..."
        />
        
        <button
          onClick={() => {
            if (newEntry.trim()) {
              onAddEntry(newEntry);
              setNewEntry('');
            }
          }}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Entry</span>
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}