import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add floating dots animation to background
document.body.innerHTML += `
  <style>
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .bg-dot {
      position: fixed;
      background: rgba(74, 222, 128, 0.15);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      z-index: -1;
    }
  </style>
`;

// Generate random dots
for (let i = 0; i < 15; i++) {
  const dot = document.createElement('div');
  dot.className = 'bg-dot';
  dot.style.width = `${Math.random() * 20 + 10}px`;
  dot.style.height = dot.style.width;
  dot.style.left = `${Math.random() * 100}vw`;
  dot.style.top = `${Math.random() * 100}vh`;
  dot.style.animationDelay = `${Math.random() * 5}s`;
  document.body.appendChild(dot);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)