// src/pages/Home.jsx (UPDATED)

import React from 'react';
import { Link } from 'react-router-dom';
// ➡️ IMPORT useScores hook
import { useScores } from '../context/ScoreContext'; 

// ➡️ UPDATED games array to include Word Search
const gameData = [
    { 
        id: 'tic-tac-toe', 
        name: 'Connect-X (Tic Tac Toe)', 
        path: '/tic-tac-toe', 
        description: '3-in-a-row (or more) vs. Human or AI on different size grids.', 
        cardColor: 'bg-purple-100', 
        buttonColor: 'bg-purple-600', 
        icon: '🔗' // Link/Grid icon
    },
    { 
        id: 'hangman', 
        name: 'Hangman', 
        path: '/hangman', 
        description: 'Guess the secret word before you run out of attempts.', 
        cardColor: 'bg-pink-100', 
        buttonColor: 'bg-pink-600', 
        icon: '✍️' 
    },
    { 
        id: 'memory-match', 
        name: 'Memory Match', 
        path: '/memory-match', 
        description: 'Find all the matching pairs quickly.', 
        cardColor: 'bg-green-100', 
        buttonColor: 'bg-green-600', 
        icon: '☘️' 
    },
    { 
        id: 'word-search', 
        name: 'Word Search', 
        path: '/word-search', 
        description: 'Find all the hidden words in the grid before time runs out (not timed in this version).', 
        cardColor: 'bg-blue-100', 
        buttonColor: 'bg-blue-600', 
        icon: '🔍' 
    },
];

function Home() {
    // ➡️ USE THE HOOK TO GET REAL SCORES
    const { scores } = useScores();

    // Helper function to get the best score display for each game
    const getBestScore = (gameId) => {
        const gameScores = scores[gameId];

        if (!gameScores) return 'N/A';

        if (gameId === 'tic-tac-toe') {
            return `X:${gameScores.X} O:${gameScores.O} D:${gameScores.Draw}`;
        }
        
        // For simple Win/Loss games, show the number of wins
        if (gameScores.hasOwnProperty('Win')) {
            return `Wins: ${gameScores.Win}`;
        }

        return 'N/A';
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* Header section with logo and view scores button */}
                <div className="flex justify-between items-center mb-12 border-b pb-4 border-gray-200">
                    <div className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5-8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        <h1 className="text-2xl font-bold text-gray-800">Classic Games</h1>
                    </div>
                    <Link to="/scores">
                        <button
                            className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <span>View Scores</span>
                            <span className="text-xl">🏆</span>
                        </button>
                    </Link>
                </div>

                {/* Main title */}
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">
                    <span className="text-blue-600">Choose</span> <span className="text-purple-600">Your</span> <span className="text-pink-600">Game</span>
                </h2>
                <p className="text-gray-600 mb-16 text-center text-lg">
                    Challenge yourself with these classic games and climb the leaderboard
                </p>

                {/* Game Cards Grid */}
                <div className="grid md:grid-cols-4 gap-8"> {/* ➡️ CHANGED TO grid-cols-4 for the new game */}
                    {gameData.map((game) => (
                        <div
                            key={game.id}
                            className={`p-8 rounded-2xl shadow-xl transition-transform duration-300 ${game.cardColor} hover:shadow-2xl hover:scale-[1.02] relative`}
                        >
                            {/* Icon at the top right of the card */}
                            <div className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md">
                                <span className="text-2xl" style={{color: game.buttonColor.replace('bg', 'text').replace(/-\d+/, '-500')}}>{game.icon}</span>
                            </div>
                            
                            <h3 className="text-3xl font-bold mb-2 mt-8 text-gray-800">{game.name}</h3>
                            <p className="text-gray-600 mb-6 text-base">{game.description}</p>
                            
                            {/* ➡️ DYNAMIC BEST SCORE SECTION */}
                            <div className="mb-6 p-3 bg-white rounded-lg shadow-inner">
                                <p className="text-sm font-semibold text-gray-500">BEST SCORES:</p>
                                <p className="text-xl font-bold text-gray-800">{getBestScore(game.id)}</p>
                            </div>
                            
                            <Link to={game.path}>
                                <button
                                    aria-label={`Play ${game.name}`}
                                    className={`w-full px-8 py-3 text-white font-bold text-lg rounded-full shadow-lg transition-transform transform ${game.buttonColor} hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                                    style={{ 
                                        '--tw-ring-color': game.buttonColor,
                                        '--tw-shadow-color': game.buttonColor.replace(/-\d+/, '-500'),
                                        boxShadow: `0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -2px var(--tw-shadow-color)`
                                    }}
                                >
                                    PLAY NOW
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;