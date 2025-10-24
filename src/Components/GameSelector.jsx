// src/components/GameSelector.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function GameSelector() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-sm mx-5 bg-white p-8 rounded-2xl shadow-2xl text-center">
                
                <h1 className="text-5xl font-extrabold text-blue-600 mb-8" style={{fontFamily: 'Pacifico, cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
                    Tic-Tac-Toe
                </h1>

                <h2 className="text-3xl font-bold text-gray-700 mb-6">Select Game Mode</h2>
                
                <div className="flex flex-col space-y-5">
                    
                    {/* 1. 2 Players (Human vs. Human) - Fixed 3x3 game (uses 'easy') */}
                    <Link
                        to="/tic-tac-toe/game/human/easy/X" 
                        className="w-full py-4 px-6 rounded-xl text-2xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-lg transform hover:scale-[1.02]"
                    >
                        2 Players (Normal X O)
                    </Link>

                    {/* 2. 1 Player (vs. AI) - Links to the setup page */}
                    <Link
                        to="/tic-tac-toe/setup/ai"
                        className="w-full py-4 px-6 rounded-xl text-2xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-lg transform hover:scale-[1.02]"
                    >
                        1 Player (vs. AI Connect-X)
                    </Link>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <Link
                        to="/" // Back to main App Home
                        className="text-lg text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GameSelector;