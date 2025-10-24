import React from 'react';
import { useScores } from '../context/ScoreContext';
import { Link } from 'react-router-dom';

function ScoreBoard({ gameKey, showClear = true, className = "" }) {
    const { scores, clearScores } = useScores();
    const gameScores = scores[gameKey];

    const gameDisplayNames = {
        'tic-tac-toe': 'Tic Tac Toe',
        'hangman': 'Hangman',
        'memory-match': 'Memory Match'
    };

    if (gameKey && gameScores) {
        // ... (Keep the small scoreboard logic as is)
        return (
            <div className={`p-4 bg-white rounded-lg max-w-sm shadow-md ${className}`}>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">{gameDisplayNames[gameKey]} Scores</h3>
                <div className="flex justify-around">
                    {Object.entries(gameScores).map(([resultType, score]) => (
                        <div key={resultType} className="text-center">
                            <p className="text-base font-medium text-gray-600">{resultType}</p>
                            <p className="text-3xl font-bold mt-1 text-blue-600">{score}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Main 'All Game Scores' view - Light Theme with Button
    return (
        <div className={`max-w-3xl mx-auto p-4 ${className} min-h-screen bg-gray-50 text-gray-800`}>
            
            {/* Back to Home BUTTON - Updated Styling */}
            <div className="mb-8 flex justify-start">
                <Link 
                    to="/" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center"
                >
                    &larr; Back to Home
                </Link>
            </div>
            
            {/* Page Title */}
            <h1 className="text-5xl font-extrabold mb-10 text-center text-gray-800">All Game Scores 🏆</h1>

            {/* Scores Cards */}
            {Object.entries(scores).map(([key, gScores]) => (
                <div key={key} className="bg-white p-6 rounded-xl mb-6 shadow-lg border border-gray-200">
                    {/* Game Title */}
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">{gameDisplayNames[key] || key}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(gScores).map(([resultType, score]) => (
                            <div key={resultType} className="p-3 bg-gray-100 rounded-lg text-center border border-gray-300">
                                <p className="text-xl font-semibold text-gray-600">{resultType}</p>
                                <p className="text-4xl font-extrabold text-indigo-600 mt-1">{score}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Clear All Scores Button */}
            {showClear && (
                <div className="mt-10 text-center">
                    <button
                        onClick={clearScores}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-lg hover:bg-red-500 transition-colors duration-200 shadow-lg"
                    >
                        Clear All Scores 🗑️
                    </button>
                </div>
            )}
        </div>
    );
}

export default ScoreBoard;