// src/components/GameRoutesWrapper.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import GameSelector from './GameSelector'; 
import AiGameSetup from './AiGameSetup';   
import TicTacToe from '../pages/TicTacToe'; 


function GameRoutesWrapper() {
    return (
        <Routes>
            {/* Matches: /tic-tac-toe/ */}
            <Route path="/" element={<GameSelector />} /> 

            {/* Setup Route 1: AI Setup (uses AiGameSetup) */}
            <Route path="/setup/ai" element={<AiGameSetup gameMode="ai" />} />

            {/* ➡️ NEW SETUP Route 2: Human Setup (uses AiGameSetup with different prop) */}
            <Route path="/setup/human" element={<AiGameSetup gameMode="human" />} />

            {/* Matches: /tic-tac-toe/game/:mode/:difficulty/:playerPiece */}
            <Route path="/game/:mode/:difficulty/:playerPiece" element={<TicTacToe />} />
            
            <Route path="*" element={<div className="min-h-screen bg-white text-gray-700 text-4xl flex items-center justify-center">Tic-Tac-Toe Path Not Found</div>} />
        </Routes>
    );
}

export default GameRoutesWrapper;