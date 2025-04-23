import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function VentForm() {
  const MAX_CHARACTERS = 300;
  const [ventText, setVentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ventText.trim() || isSubmitting || ventText.length > MAX_CHARACTERS) return;

    setIsSubmitting(true);
    try {
      // Simulate API call or data handling
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

      // Navigate to the new post page and pass state
      navigate('/post', {
        state: {
          text: ventText,
          mood: mood,
          imagePreviews: imagePreviews, // Pass the actual preview URLs
        },
      });

      setVentText('');
      setMood('neutral');
      setImages([]);
      setImagePreviews([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const startPos = textareaRef.current.selectionStart;
    const endPos = textareaRef.current.selectionEnd;
    const textBefore = ventText.substring(0, startPos);
    const textAfter = ventText.substring(endPos, ventText.length);

    setVentText(textBefore + emoji + textAfter);
    setShowEmojiPicker(false);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = startPos + emoji.length;
    }, 0);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert('You can upload a maximum of 4 images');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const previews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const moods = [
    { value: 'happy', emoji: '😊', color: 'from-yellow-400 to-amber-400' },
    { value: 'sad', emoji: '😢', color: 'from-blue-400 to-indigo-400' },
    { value: 'angry', emoji: '😠', color: 'from-red-400 to-rose-500' },
    { value: 'neutral', emoji: '😐', color: 'from-gray-400 to-gray-500' },
    { value: 'anxious', emoji: '😰', color: 'from-purple-400 to-fuchsia-500' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mt-8 border border-white/20 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
          A
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-white">Anonymous User</h2>
          <p className="text-xs text-gray-500 dark:text-gray-300">Posting publicly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-gray-500/70 dark:placeholder-gray-400/70 border border-white/30 dark:border-gray-700 transition-all duration-200"
          rows={4}
          placeholder="What's weighing on your mind today?..."
          value={ventText}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARACTERS) {
              setVentText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          required
        />

        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs ${ventText.length > MAX_CHARACTERS ? 'text-red-500' : 'text-gray-500'}`}>
            {ventText.length}/{MAX_CHARACTERS}
          </span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all transform hover:scale-110"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Mood:</span>
            <div className="flex space-x-1">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`p-1.5 rounded-full transition-all ${mood === m.value ?
                    `bg-gradient-to-br ${m.color} text-white scale-110 shadow-md` :
                    'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'}`}
                  aria-label={m.value}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all transform hover:scale-110"
                onClick={() => fileInputRef.current.click()}
                title="Add image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                </svg>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </button>
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all transform hover:scale-110"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 z-10">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={350}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={!ventText.trim() || isSubmitting || ventText.length > MAX_CHARACTERS}
                className={`px-5 py-2 rounded-xl font-medium transition-all flex items-center space-x-1 ${
                  !ventText.trim() || isSubmitting || ventText.length > MAX_CHARACTERS
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>Release</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}