// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home.jsx';
import Room from './Room.jsx';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDirections = () => setIsOpen(false);
  const openDirections = () => setIsOpen(true);
  return (
    <>
      {isOpen && <dialog className="result-modal" open>
        <h2>You</h2>
        <p>The target time was <strong>seconds.</strong></p>
        <p>You stopped the timer with <strong>X seconds left</strong></p>
        <form method="dialog"><button>Close</button></form>
      </dialog>}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
