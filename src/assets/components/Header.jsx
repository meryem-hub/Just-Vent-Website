import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const globalEmojis = ['😊', '😢', '😠', '😍', '🤗', '😔', '❤️', '🌎', '🤝', '✊'];

export default function LandingHeader() {
  const navigate = useNavigate();
  const [activeEmojis, setActiveEmojis] = useState([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const spawnEmoji = (xPosition) => {
    const newEmoji = {
      id: Date.now(),
      emoji: globalEmojis[Math.floor(Math.random() * globalEmojis.length)],
      x: xPosition || Math.random() * 100,
      size: Math.random() * 24 + 16,
      duration: Math.random() * 4 + 3,
      rotation: Math.random() * 360,
      direction: Math.random() > 0.5 ? 1 : -1
    };
    setActiveEmojis(prev => [...prev.slice(-20), newEmoji]);
  };

  useEffect(() => {
    if (isInteractive) {
      const interval = setInterval(() => spawnEmoji(), 250);
      return () => clearInterval(interval);
    }
  }, [isInteractive]);

  const handleClick = (e) => {
    const xPercent = (e.clientX / window.innerWidth) * 100;
    spawnEmoji(xPercent);
  };

  const navigateTo = (path) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setIsTransitioning(false); 
    }, 800);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className="fixed inset-0 bg-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      <header 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 py-16 md:py-24 relative overflow-hidden min-h-[105vh] flex items-center"
        onMouseEnter={() => setIsInteractive(true)}
        onMouseLeave={() => setIsInteractive(false)}
        onClick={handleClick}
      >
        <div className="absolute inset-0 overflow-hidden ">
          {activeEmojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              className="absolute pointer-events-none select-none"
              initial={{ 
                y: -50, 
                x: `${emoji.x}%`, 
                opacity: 0,
                rotate: emoji.rotation
              }}
              animate={{ 
                y: [0, window.innerHeight * 0.8],
                opacity: [1, 0],
                rotate: emoji.rotation + (360 * emoji.direction)
              }}
              transition={{ 
                duration: emoji.duration,
                ease: "easeOut"
              }}
              style={{
                fontSize: `${emoji.size}px`,
                left: `${emoji.x}%`,
                top: 0
              }}
              onAnimationComplete={() => {
                setActiveEmojis(prev => prev.filter(e => e.id !== emoji.id));
              }}
            >
              {emoji.emoji}
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none ">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white bg-opacity-20 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: 0,
                scale: 0
              }}
              animate={{
                y: [0, -50 + Math.random() * 100],
                opacity: [0.3, 0],
                scale: [0, 1 + Math.random() * 3]
              }}
              transition={{
                duration: 15 + Math.random() * 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                width: `${50 + Math.random() * 150}px`,
                height: `${50 + Math.random() * 150}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="max-w-3xl mx-auto"
  >
    {/* Simplified headline with subtle animation */}
    <motion.h1 
      className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-gray-400">Share freely</span>
      <span className="text-amber-400">....</span>
    </motion.h1>

    {/* Cleaner subtitle */}
    <motion.p 
      className="text-lg md:text-xl text-gray-600 mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      A safe space to express yourself and find understanding.
    </motion.p>

    {/* Minimal buttons with subtle interactions */}
    <motion.div
      className="flex flex-col sm:flex-row justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <button
        className="px-8 py-3 bg-amber-400 text-white rounded-md font-medium hover:bg-amber-500 transition-colors"
        onClick={() => navigateTo('/vent/new')}
      >
        Start Sharing
      </button>
      
      <button
        className="px-8 py-3 bg-white  border border-gray-200 rounded-md font-medium hover:bg-gray-50 transition-colors"
        onClick={() => navigateTo('/community')}
      >
        Browse Stories
      </button>
    </motion.div>

    {/* Minimal trust indicators */}
    <motion.div 
      className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8 }}
    >
      <div className="p-3 rounded-lg bg-gray-50">
        <div className="font-medium mb-1 text-amber-500 ">10K+</div>
        <div >Supportive members</div>
      </div>
      <div className="p-3 rounded-lg bg-gray-50">
        <div className="font-medium mb-1 text-amber-500 " >100%</div>
        <div>Anonymous</div>
      </div>
      <div className="p-3 rounded-lg bg-gray-50">
        <div className="font-medium mb-1 text-amber-500 ">24/7</div>
        <div>Always available</div>
      </div>
    </motion.div>
  </motion.div>
</div>
        {/* Global connection visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-current text-indigo-200"
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-current text-purple-200"
            />
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-current text-pink-200"
            />
          </svg>
        </div>
      </header>
      <div className="py-16 bg-[url('https://images.unsplash.com/photo-1558470598-a5dda9640f68')] bg-cover bg-center bg-opacity-5 backdrop-brightness-105">  <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Just Vent Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MicIcon />}
              title="Express Freely"
              description="Share your thoughts anonymously without fear of judgment or consequences."
            />
            <FeatureCard 
              icon={<UsersIcon />}
              title="Find Support"
              description="Connect with others who understand what you're going through."
            />
            <FeatureCard 
              icon={<ShieldIcon />}
              title="Safe Space"
              description="Our community guidelines ensure a respectful environment for all."
            />
          </div>
        </div>
      </div>
      
    </div>
    
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
    >
      <div className="text-indigo-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

// Icon components
function GlobeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    
  );
}
