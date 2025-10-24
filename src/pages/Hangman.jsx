import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScores } from '../context/ScoreContext.jsx'; 
import GameOverModal from '../Components/GameOverModal.jsx'; 

// --- CONFIGURATION ---
const WORD_LIST = [
    "REACT", "JAVASCRIPT", "COMPONENT", "PROGRAMMING", 
    "WEBDEV", "FRONTEND", "BACKEND", "DATABASE",
    "VARIABLE", "FUNCTION", "ALGORITHM", "FRAMEWORK"
];

const MAX_GUESSES = 6;

// --- HELPER FUNCTIONS ---

const getRandomWord = () => {
    const index = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[index];
};

function Hangman() {
    // Hooks and Navigation
    const { updateScore } = useScores();
    const gameName = 'hangman';
    const navigate = useNavigate();

    // --- STATE ---
    const [word, setWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing'); 

    // --- GAME INITIALIZATION ---

    const startNewGame = useCallback(() => {
        setWord(getRandomWord());
        setGuessedLetters([]);
        setIncorrectGuesses(0);
        setGameStatus('playing');
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    // --- GAME LOGIC ---

    // Creates the hidden word display (e.g., J _ V A S C R I P T)
    const displayWord = word.split('').map(letter => {
        return guessedLetters.includes(letter) ? letter : '_';
    }).join(' ');

    // Check Win/Loss Condition
    useEffect(() => {
        if (word && gameStatus === 'playing') {
            const isWordGuessed = word.split('').every(letter => guessedLetters.includes(letter));
            if (isWordGuessed) {
                setGameStatus('won');
                updateScore(gameName, 'Win');
                return;
            }

            if (incorrectGuesses >= MAX_GUESSES) {
                setGameStatus('lost');
                updateScore(gameName, 'Loss');
            }
        }
    }, [word, guessedLetters, incorrectGuesses, gameStatus, updateScore, gameName]);

    // Handler for a letter guess
    const handleGuess = (letter) => {
        if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
            return;
        }

        setGuessedLetters(prev => [...prev, letter]);

        if (!word.includes(letter)) {
            setIncorrectGuesses(prev => prev + 1);
        }
    };

    // --- RENDER HELPERS (Light Theme) ---

    const renderKeyboard = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        return (
            <div className="grid grid-cols-7 gap-2">
                {letters.map(letter => {
                    const isGuessed = guessedLetters.includes(letter);
                    const isCorrect = isGuessed && word.includes(letter);
                    const isIncorrect = isGuessed && !word.includes(letter);

                    let btnClass = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
                    if (isCorrect) {
                        btnClass = 'bg-green-500 text-white pointer-events-none';
                    } else if (isIncorrect) {
                        btnClass = 'bg-red-500 text-white pointer-events-none';
                    } else if (gameStatus !== 'playing') {
                        btnClass = 'bg-gray-400 text-gray-600 pointer-events-none'; 
                    }

                    return (
                        <button
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            disabled={isGuessed || gameStatus !== 'playing'}
                            className={`p-3 rounded-lg font-bold transition-all shadow-md ${btnClass}`}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderHangmanVisual = () => {
        const stages = [
            `
 +---+
 |   |
     |
     |
     |
     =`, 
            `
 +---+
 |   |
 O   |
     |
     |
     =`, 
            `
 +---+
 |   |
 O   |
 |   |
     |
     =`, 
            `
 +---+
 |   |
 O   |
/|   |
     |
     =`, 
            `
 +---+
 |   |
 O   |
/|\\  |
     |
     =`, 
            `
 +---+
 |   |
 O   |
/|\\  |
/    |
     =`, 
            `
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
     =`, 
        ];
        
        const currentStageIndex = Math.min(incorrectGuesses, MAX_GUESSES);
        const currentStage = stages[currentStageIndex];

        return (
            <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-200 text-center font-mono whitespace-pre leading-none text-xl md:text-2xl h-64 flex flex-col justify-end items-center text-gray-800">
                <pre className="text-blue-600 font-extrabold text-left leading-none" style={{ lineHeight: '1em' }}>
                    {currentStage}
                </pre>
                <div className="mt-auto text-lg text-gray-500">
                    Guesses Left: {MAX_GUESSES - incorrectGuesses}
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-lg">
                
                <h1 className="text-5xl font-extrabold mb-8 text-center text-indigo-700">Hangman</h1>

                {/* Hangman Visual */}
                {renderHangmanVisual()}

                {/* Word Display */}
                <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-xl border-2 border-indigo-400">
                    <p className="text-5xl sm:text-6xl font-extrabold tracking-widest text-indigo-900">
                        {displayWord}
                    </p>
                </div>
                
                {/* Keyboard */}
                {renderKeyboard()}
                
                {/* Secondary 'Start New Game' button */}
                {gameStatus === 'playing' && word.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={startNewGame}
                            className="py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                        >
                            Start New Game
                        </button>
                    </div>
                )}
            </div>

            {/* ➡️ WIN MODAL (FIXED PROP) */}
            {gameStatus === 'won' && (
                <GameOverModal
                    title="YOU WIN!"
                    message={`Congratulations! The word was "${word}".`}
                    onPlayAgain={startNewGame}
                    // ✅ FIXED: Using onBackToHome to match GameOverModal.jsx
                    onBackToHome={() => navigate('/')} 
                    // secondaryActionLabel is no longer needed
                />
            )}

            {/* ➡️ LOSS MODAL (FIXED PROP) */}
            {gameStatus === 'lost' && (
                <GameOverModal
                    title="GAME OVER!"
                    message={`You ran out of guesses! The word was "${word}".`}
                    onPlayAgain={startNewGame}
                    // ✅ FIXED: Using onBackToHome to match GameOverModal.jsx
                    onBackToHome={() => navigate('/')} 
                    // secondaryActionLabel is no longer needed
                />
            )}
        </div>
    );
}

export default Hangman;