import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Roulette from './Roulette';
import UpdatePage from './UpdatePage';
import ChartBar from './components/ChartBar';
import LocationComponent from './locationWheel';
import LocationComponentRandom from './locationRandom';
import './App.css';

function RouletteWheel() {
  return (
    <div className="roulette-wheel-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/roulette/:id" element={<Roulette />} />
        <Route path="/update/:id" element={<UpdatePage />} />
        <Route path="/chartbar/:id" element={<ChartBar />} />
        <Route path="/map" element={<LocationComponent />} />
        <Route path="/random" element={<LocationComponentRandom />} />
      </Routes>
    </div>
  );
}

export default RouletteWheel;
