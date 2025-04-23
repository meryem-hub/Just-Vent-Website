import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMessageSquare, FiShare2, FiEye } from 'react-icons/fi';

const moodColors = {
  happy: 'bg-gradient-to-br from-yellow-400 to-amber-400',
  sad: 'bg-gradient-to-br from-blue-400 to-indigo-400',
  angry: 'bg-gradient-to-br from-red-400 to-rose-500',
  neutral: 'bg-gradient-to-br from-gray-400 to-gray-500',
  anxious: 'bg-gradient-to-br from-purple-400 to-fuchsia-500',
};

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  anxious: '😰',
};

export default function VentDashboard({ vents, onReact, onComment, onShare, onView }) {
  const [commentTexts, setCommentTexts] = useState({});
  const [expandedVent, setExpandedVent] = useState(null);

  useEffect(() => {
    // Initialize comment texts state
    const initialCommentTexts = {};
    vents.forEach(vent => {
      initialCommentTexts[vent.id] = '';
    });
    setCommentTexts(initialCommentTexts);
  }, [vents]);

  const handleCommentChange = (ventId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [ventId]: text
    }));
  };

  const submitComment = (ventId) => {
    onComment(ventId, commentTexts[ventId]);
    setCommentTexts(prev => ({
      ...prev,
      [ventId]: ''
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpandVent = (ventId) => {
    if (expandedVent === ventId) {
      setExpandedVent(null);
    } else {
      setExpandedVent(ventId);
      onView(ventId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Community Vents</h1>
        <Link 
          to="/" 
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Create New Vent
        </Link>
      </div>

      {vents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No vents yet. Be the first to share!
          </div>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Create Your First Vent
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {vents.map(vent => (
            <div 
              key={vent.id} 
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                expandedVent === vent.id ? 'ring-2 ring-indigo-400' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${moodColors[vent.mood]} flex items-center justify-center text-white text-xl`}>
                    {moodEmojis[vent.mood]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Anonymous User</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(vent.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                      {vent.text}
                    </p>
                  </div>
                </div>

                {vent.images?.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {vent.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                          alt={`Vent image ${index}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => toggleExpandVent(vent.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => onReact(vent.id, '❤️')}
                      className={`flex items-center space-x-1 transition-colors ${
                        vent.reactions.includes('❤️') ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <FiHeart className="w-5 h-5" />
                      <span>{vent.reactions.length}</span>
                    </button>
                    <button 
                      onClick={() => toggleExpandVent(vent.id)}
                      className="flex items-center space-x-1 hover:text-indigo-500"
                    >
                      <FiMessageSquare className="w-5 h-5" />
                      <span>{vent.comments.length}</span>
                    </button>
                    <button 
                      onClick={() => onShare(vent.id)}
                      className="flex items-center space-x-1 hover:text-green-500"
                    >
                      <FiShare2 className="w-5 h-5" />
                      <span>{vent.shares}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm">{vent.views}</span>
                  </div>
                </div>

                {expandedVent === vent.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Comments ({vent.comments.length})</h4>
                    
                    {vent.comments.length > 0 ? (
                      <div className="space-y-4 mb-6">
                        {vent.comments.map((comment, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              A
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatDate(comment.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">No comments yet. Be the first to respond!</p>
                    )}

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        A
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentTexts[vent.id] || ''}
                          onChange={(e) => handleCommentChange(vent.id, e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onKeyPress={(e) => e.key === 'Enter' && submitComment(vent.id)}
                        />
                        <button
                          onClick={() => submitComment(vent.id)}
                          disabled={!commentTexts[vent.id]?.trim()}
                          className={`px-4 py-2 rounded-full transition-colors ${
                            commentTexts[vent.id]?.trim()
                              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}