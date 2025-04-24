import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Post reactions (full set)
const POST_REACTIONS = {
  like: { emoji: '👍', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' }, 
  laugh: { emoji: '😂', label: 'Laugh' },
  wow: { emoji: '😮', label: 'Wow' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😠', label: 'Angry' }
};

// Comment reactions (limited set)
const COMMENT_REACTIONS = {
  like: { emoji: '😢', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' },
  laugh: { emoji: '😂', label: 'Laugh' }
};

const moodData = {
  happy: { emoji: '😊', color: 'bg-yellow-400' },
  sad: { emoji: '😢', color: 'bg-blue-400' },
  angry: { emoji: '😠', color: 'bg-red-500' },
  neutral: { emoji: '😐', color: 'bg-gray-400' },
  anxious: { emoji: '😰', color: 'bg-purple-400' }
};

const getRelativeTime = (timestamp) => dayjs(timestamp).fromNow();

function Comment({ 
  comment, 
  onReply, 
  onReaction,
  depth = 0 
}) {
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(true);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
      setExpandedReplies(true);
    }
  };

  return (
    <div className={`pt-4 ${depth > 0 ? 'pl-8 border-l-2 border-gray-100' : ''}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {comment.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-800">{comment.author}</span>
            <span className="text-xs text-gray-500">{getRelativeTime(comment.timestamp)}</span>
          </div>
          <p className="mt-1 text-gray-700">{comment.text}</p>
          
          {/* Comment Reactions */}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {Object.entries(COMMENT_REACTIONS).map(([type, { emoji }]) => (
                <button
                  key={type}
                  onClick={() => onReaction(comment.id, type)}
                  className={`p-1 rounded-full transition ${
                    comment.userReaction === type
                      ? 'bg-blue-50 text-blue-600 scale-110'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
            {Object.entries(comment.reactionCounts)
              .filter(([_, count]) => count > 0)
              .map(([type, count]) => (
                <span 
                  key={type} 
                  className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600"
                >
                  {COMMENT_REACTIONS[type].emoji} {count}
                </span>
              ))}
            
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reply
            </button>
            
            {comment.replies?.length > 0 && (
              <button 
                onClick={() => setExpandedReplies(!expandedReplies)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {expandedReplies ? 'Hide replies' : `Show replies (${comment.replies.length})`}
              </button>
            )}
          </div>
          
          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  !replyText.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Post
              </button>
            </div>
          )}
          
          {/* Nested Replies */}
          {expandedReplies && comment.replies?.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onReaction={onReaction}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VentPostPage() {
  const { state } = useLocation();
  const [viewCount, setViewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [imageModal, setImageModal] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  useEffect(() => {
    setViewCount((prev) => prev + 1);
  }, []);

  if (!state || !state.text) {
    return <div className="p-6 text-center text-gray-500">No vent to display.</div>;
  }

  const { text, mood, imagePreviews = [], tags = [] } = state;
  const currentMood = moodData[mood] || moodData.neutral;

  const handleReaction = (type) => {
    setShowReactionPicker(false);
    
    if (userReaction === type) {
      setUserReaction(null);
      setReactionCounts(prev => ({
        ...prev,
        [type]: Math.max((prev[type] || 0) - 1, 0)
      }));
    } else {
      const newCounts = {...reactionCounts};
      
      if (userReaction) {
        newCounts[userReaction] = Math.max((newCounts[userReaction] || 0) - 1, 0);
      }
      
      newCounts[type] = (newCounts[type] || 0) + 1;
      
      setUserReaction(type);
      setReactionCounts(newCounts);
    }
  };

  const handleBookmark = () => setIsBookmarked((prev) => !prev);
  const openImageModal = (src) => setImageModal(src);
  const closeImageModal = () => setImageModal(null);

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date(),
        author: `User${Math.floor(Math.random() * 1000)}`,
        userReaction: null,
        reactionCounts: {},
        replies: []
      };
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    }
  };

  const addReply = (parentId, replyText) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now(),
      text: replyText,
      timestamp: new Date(),
      author: `User${Math.floor(Math.random() * 1000)}`,
      userReaction: null,
      reactionCounts: {},
      replies: []
    };
    
    const addReplyToComment = (comments) => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        }
        
        if (comment.replies?.length > 0) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies)
          };
        }
        
        return comment;
      });
    };
    
    setComments(addReplyToComment(comments));
  };

  const handleCommentReaction = (commentId, type) => {
    const updateReactions = (comments) => {
      return comments.map(comment => {
        if (comment.id !== commentId && (!comment.replies || comment.replies.length === 0)) {
          return comment;
        }
        
        if (comment.id === commentId) {
          const currentReaction = comment.userReaction;
          const newCounts = {...comment.reactionCounts};
          
          // Remove previous reaction if exists
          if (currentReaction) {
            newCounts[currentReaction] = Math.max((newCounts[currentReaction] || 0) - 1, 0);
          }
          
          // Toggle reaction if clicking same type
          if (currentReaction === type) {
            return {
              ...comment,
              userReaction: null,
              reactionCounts: newCounts
            };
          }
          
          // Add new reaction
          newCounts[type] = (newCounts[type] || 0) + 1;
          
          return {
            ...comment,
            userReaction: type,
            reactionCounts: newCounts
          };
        }
        
        // If not the target comment but has replies, process them
        return {
          ...comment,
          replies: updateReactions(comment.replies)
        };
      });
    };
    
    setComments(updateReactions(comments));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {imageModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={closeImageModal}>
          <img src={imageModal} className="max-w-full max-h-[90vh] rounded-lg" alt="Full" />
        </div>
      )}

      {/* Post Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-lg ${currentMood.color}`}>
            {currentMood.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Anonymous Vent</h3>
            <p className="text-sm text-gray-500">{viewCount} views • just now</p>
          </div>
         
        </div>

        <div className="p-4 space-y-4">
          <p className="text-gray-800 text-lg leading-relaxed">{text}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div className={`grid gap-2 ${imagePreviews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {imagePreviews.map((img, i) => (
                <div 
                  key={i} 
                  className="relative cursor-pointer overflow-hidden rounded-xl aspect-square group"
                  onClick={() => openImageModal(img)}
                >
                  <img 
                    src={img} 
                    alt={`Preview ${i}`} 
                    className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                    Click to view
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Reactions */}
        <div className="border-t px-4 py-3 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {Object.entries(reactionCounts)
              .filter(([_, count]) => count > 0)
              .map(([type, count]) => (
                <span 
                  key={type} 
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    userReaction === type 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {POST_REACTIONS[type].emoji} {count}
                </span>
              ))}
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button 
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                  userReaction 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {userReaction ? POST_REACTIONS[userReaction].emoji : '👍'}
                <span>React</span>
              </button>
              
              {showReactionPicker && (
                <div className="absolute bottom-10 right-0 bg-white shadow-lg rounded-xl p-2 flex gap-1 z-10 border border-gray-200">
                  {Object.entries(POST_REACTIONS).map(([type, { emoji, label }]) => (
                    <button
                      key={type}
                      onClick={() => handleReaction(type)}
                      className={`p-2 rounded-full hover:bg-gray-100 transition ${
                        userReaction === type ? 'bg-blue-50' : ''
                      }`}
                      title={label}
                    >
                      <span className="text-xl">{emoji}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
            >
              💬 Comment
              {comments.length > 0 && (
                <span className="text-xs bg-gray-300 rounded-full px-1.5 py-0.5">
                  {comments.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 bg-white rounded-xl shadow p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
          
          {/* Comment Input */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-full transition ${
                !newComment.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={addReply}
                  onReaction={handleCommentReaction}
                />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VentPostPage;