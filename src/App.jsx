import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VentForm from './assets/components/VentForm';
import Header from './assets/components/Header'
import VentDashboard from './assets/components/VentDashboard';
import VentPostPage from './assets/pages/VentPostPage';

function App() {
  const [vents, setVents] = useState([]);

  const handleVentSubmit = (ventText, mood, images) => {
    return new Promise((resolve) => {
      const newVent = {
        id: Date.now(),
        text: ventText,
        mood: mood,
        images: images,
        timestamp: new Date(),
        reactions: [],
        comments: [],
        views: 0,
        shares: 0,
      };
      setVents([newVent, ...vents]);
      resolve();
    });
  };

  const handleReact = (ventId, emoji) => {
    setVents((prevVents) =>
      prevVents.map((vent) => {
        if (vent.id === ventId) {
          const current = vent.reactions[0] === emoji ? [] : [emoji];
          return { ...vent, reactions: current };
        }
        return vent;
      })
    );
  };

  const handleComment = (ventId, commentText) => {
    if (!commentText.trim()) return;
    setVents((prevVents) =>
      prevVents.map((vent) =>
        vent.id === ventId
          ? { 
              ...vent, 
              comments: [...vent.comments, {
                id: Date.now(),
                text: commentText,
                timestamp: new Date()
              }] 
            }
          : vent
      )
    );
  };

  const handleShare = (ventId) => {
    setVents((prevVents) =>
      prevVents.map((vent) =>
        vent.id === ventId
          ? { ...vent, shares: vent.shares + 1 }
          : vent
      )
    );
  };

  const handleView = (ventId) => {
    setVents((prevVents) =>
      prevVents.map((vent) =>
        vent.id === ventId
          ? { ...vent, views: vent.views + 1 }
          : vent
      )
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header/>

        <Routes>
          <Route
            path="/"
            element={<VentForm onSubmit={handleVentSubmit} />}
          />
                <Route path="/post" element={<VentPostPage />} />

        
          <Route
            path="/dashboard"
            element={
              <VentDashboard 
                vents={vents} 
                onReact={handleReact} 
                onComment={handleComment}
                onShare={handleShare}
                onView={handleView}
              />
            }
            
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;