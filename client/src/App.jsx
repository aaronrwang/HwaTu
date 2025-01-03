// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home.jsx';
import Room from './Room.jsx';

const App = () => {

  return (
    <>
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
