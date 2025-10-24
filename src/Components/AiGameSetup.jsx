// src/components/AiGameSetup.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAME_CONFIG } from '../context/ScoreContext'; // Import config

function AiGameSetup() {
    // State for difficulty ('easy', 'medium', 'advanced') and player piece
    const [difficulty, setDifficulty] = useState('easy'); 
    const [playerX, setPlayerX] = useState(true);

    const level = GAME_CONFIG[difficulty];
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-lg mx-5 bg-white p-8 rounded-2xl shadow-2xl text-center">
                
                <h1 className="text-4xl font-extrabold text-blue-600 mb-8">
                    Choose Grid & Role
                </h1>

                {/* Grid/Difficulty Selection (3x3, 6x6, 9x9) */}
                <div className="mb-8 p-4 border rounded-xl">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Grid:</h2>
                    <div className="flex justify-around space-x-2">
                        {/* Iterate through the three difficulty keys: 'easy', 'medium', 'advanced' */}
                        {['easy', 'medium', 'advanced'].map(levelKey => {
                            const currentLevel = GAME_CONFIG[levelKey];
                            return (
                                <button
                                    key={levelKey}
                                    // ➡️ FIX: Use levelKey to set the difficulty state
                                    onClick={() => setDifficulty(levelKey)}
                                    className={`flex-1 py-4 px-2 rounded-xl text-center font-bold transition-all border-4 ${
                                        difficulty === levelKey
                                            ? 'bg-blue-500 text-white border-blue-700 shadow-xl'
                                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="text-xl block">{currentLevel.size}x{currentLevel.size}</span>
                                    <span className="text-sm font-normal block">Win: {currentLevel.winCondition} in a row</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Player Role Selection */}
                <div className="mb-8 p-4 border rounded-xl">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">You Play As:</h2>
                    <div className="flex justify-center space-x-6">
                        <button
                            onClick={() => setPlayerX(true)}
                            className={`px-8 py-3 rounded-xl text-3xl font-extrabold transition-colors border-2 ${
                                playerX 
                                    ? 'bg-blue-500 text-white border-blue-700 shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                            }`}
                        >
                            X (Starts)
                        </button>
                        <button
                            onClick={() => setPlayerX(false)}
                            className={`px-8 py-3 rounded-xl text-3xl font-extrabold transition-colors border-2 ${
                                !playerX 
                                    ? 'bg-fuchsia-500 text-white border-fuchsia-700 shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                            }`}
                        >
                            O (Second)
                        </button>
                    </div>
                </div>

                {/* Start Game Button - Uses absolute path and current config */}
                <Link
                    to={`/tic-tac-toe/game/ai/${difficulty}/${playerX ? 'X' : 'O'}`} 
                    className="w-full py-4 px-6 rounded-xl text-2xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-lg flex items-center justify-center transform hover:scale-[1.01]"
                >
                    Start {level.size}x{level.size} Game
                </Link>

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <Link
                        to="/tic-tac-toe" // Back to GameSelector
                        className="text-lg text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        &larr; Back to Mode Selection
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AiGameSetup;