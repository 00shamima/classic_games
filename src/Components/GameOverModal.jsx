import React from 'react';

function GameOverModal({ message, onPlayAgain, onBackToHome, title = "GAME OVER!" }) {
    return (
        // 1. Full-screen overlay to block interaction with the game board
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            
            {/* 2. Modal Container with Gradient Background */}
            <div className="p-1 rounded-2xl shadow-2xl w-full max-w-sm"
                 style={{ 
                     // Using CSS gradients for the border effect
                     background: 'linear-gradient(135deg, #10b981, #3b82f6)', // Tailwind green-500 to blue-500
                     transform: 'scale(1.05)', 
                 }}
            >
                <div className="bg-gray-900 p-8 rounded-xl text-center flex flex-col items-center">
                    
                    {/* Trophy Icon */}
                    <span className="text-5xl mb-4">🏆</span> 
                    
                    {/* Game Over Title */}
                    <h2 className="text-4xl font-extrabold text-white mb-2" 
                        style={{ 
                            // Using webkit properties for the gradient text
                            backgroundImage: 'linear-gradient(45deg, #10b981, #3b82f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                        {title}
                    </h2>
                    
                    {/* Custom Message */}
                    <p className="text-xl font-semibold text-white mb-8">{message}</p>

                    {/* Play Again Button (Bright Green) */}
                    <button
                        onClick={onPlayAgain}
                        className="w-full py-3 px-6 mb-4 text-xl font-bold text-white bg-green-500 rounded-xl shadow-lg transition-transform hover:scale-[1.03] hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Play Again
                    </button>
                    
                    {/* Back to Home Button (Blue Gradient) */}
                    <button
                        onClick={onBackToHome}
                        className="w-full py-3 px-6 text-xl font-bold text-white rounded-xl shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                        style={{ 
                            background: 'linear-gradient(90deg, #3b82f6, #6366f1)', // Blue to Indigo
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameOverModal;