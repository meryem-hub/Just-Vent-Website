import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import VentForm from './assets/components/VentForm';
import Header from './assets/components/Header';
import VentPostPage from './assets/pages/VentPostPage';

function App() {
  const [vents, setVents] = useState([]);

  const handleVentSubmit = (ventData) => {
    return new Promise((resolve) => {
      const newVent = {
        id: Date.now(),
        ...ventData,
        timestamp: new Date(),
        reactions: [],
        comments: [],
        views: 0,
        shares: 0,
      };
      setVents([newVent, ...vents]);
      resolve();
      // Navigate to community page after submission
      navigate('/community');
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <div className="p-5 text-center text-gray-500 text-sm">
  © {new Date().getFullYear()} Just Vent by <span className="text-amber-500 font-semibold">Meryem Ebrahim</span>. All rights reserved.
</div>

          } />
          
          <Route 
            path="/vent/new" 
            element={<VentForm onSubmit={handleVentSubmit} />} 
          />
          
          <Route 
            path="/post" 
            element={<VentPostPage/>} 
          />
          
          <Route 
            path="/vent/:id" 
            element={<VentPostPage vents={vents} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

function CommunityPage({ vents }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Community Vents</h1>
      
      {vents.map(vent => (
        <div 
          key={vent.id} 
          className="bg-white rounded-lg shadow p-6 mb-6 cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate(`/vent/${vent.id}`, { state: vent })}
        >
          <p>{vent.text}</p>
        </div>
      ))}
    </div>
  );
}


export default App;