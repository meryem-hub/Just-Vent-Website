// components/VentPostPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function VentPostPage() {
  const location = useLocation();
  const { state } = location;

  if (!state || !state.text) {
    return <div className="p-6 text-center">No vent to display.</div>;
  }

  const { text, mood, imagePreviews } = state;

  const moodData = {
    happy: { emoji: '😊', color: 'bg-gradient-to-br from-yellow-400 to-amber-400' },
    sad: { emoji: '😢', color: 'bg-gradient-to-br from-blue-400 to-indigo-400' },
    angry: { emoji: '😠', color: 'bg-gradient-to-br from-red-400 to-rose-500' },
    neutral: { emoji: '😐', color: 'bg-gradient-to-br from-gray-400 to-gray-500' },
    anxious: { emoji: '😰', color: 'bg-gradient-to-br from-purple-400 to-fuchsia-500' },
  };

  const currentMood = moodData[mood] || moodData.neutral;

  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mt-8 border border-white/20">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full ${currentMood.color} flex items-center justify-center text-white font-bold`}>
          {currentMood.emoji}
        </div>
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Anonymous Vent</h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{text}</p>
      {imagePreviews && imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {imagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Vent Image ${index}`}
              className="h-32 w-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-600 object-cover"
            />
          ))}
        </div>
      )}
      <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
        Go Back
      </button>
    </div>
  );
}

export default VentPostPage;