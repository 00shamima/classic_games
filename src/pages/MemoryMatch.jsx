import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScores } from '../context/ScoreContext.jsx'; // Make sure this path is correct
import GameOverModal from '../components/GameOverModal.jsx'; 

// --- CONFIGURATION ---
const CARD_ICONS = [
    '⭐', '🚀', '💡', '💎', '🎨', '🧩', '🎸', '👑',
    '🌈', '🍕', '⚽', '🤖', '🦄', '🐳', '🍀', '🍎'
];

const DIFFICULTIES = {
    EASY: { size: 4, pairs: 8, cols: 4, rows: 4, label: 'Easy (4x4)' },
    MEDIUM: { size: 12, pairs: 12, cols: 6, rows: 4, label: 'Medium (4x6)' },
    HARD: { size: 16, pairs: 18, cols: 6, rows: 6, label: 'Hard (6x6)' },
};

// --- HELPER FUNCTION: SHUFFLE AND INITIALIZE CARDS ---
const initializeCards = (pairsCount) => {
    const emojiSet = CARD_ICONS.slice(0, pairsCount); 
    let deck = [...emojiSet, ...emojiSet];
    
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck.map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
    }));
};

function MemoryMatch() {
    // 💡 IMPORTANT: Ensure useScores is imported correctly if you use it for updateScore
    const { updateScore } = useScores(); 
    const gameName = 'memory-match';
    const navigate = useNavigate();

    // --- STATE ---
    const [difficulty, setDifficulty] = useState(DIFFICULTIES.EASY);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [matchesFound, setMatchesFound] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing'); 
    const [moves, setMoves] = useState(0); 
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // --- GAME LOGIC ---

    const startNewGame = useCallback((newDifficulty = difficulty) => {
        setIsRunning(false);
        setTime(0);

        setDifficulty(newDifficulty);
        setCards(initializeCards(newDifficulty.pairs));
        setFlippedCards([]);
        setMatchesFound(0);
        setMoves(0);
        setGameStatus('playing');
        setIsChecking(false);
        setIsRunning(true);
    }, [difficulty]); 

    useEffect(() => {
        startNewGame(DIFFICULTIES.EASY);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Timer Effect
    useEffect(() => {
        let interval;
        if (isRunning && gameStatus === 'playing') {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, gameStatus]);


    // 🛑 WIN CONDITION EFFECT: Check the console for this message when you win!
    useEffect(() => {
        if (cards.length > 0 && matchesFound === difficulty.pairs && gameStatus !== 'won') {
            
            // 🛑 CRITICAL DEBUG LINE: Check your console for this!
            console.log(`✅ WIN DETECTED! Found ${matchesFound} matches (required ${difficulty.pairs}).`);

            setGameStatus('won');
            setIsRunning(false); 
            updateScore(gameName, 'Win'); 
        }
    }, [matchesFound, cards.length, gameStatus, updateScore, gameName, difficulty.pairs]);

    // Card Matching Logic Effect
    useEffect(() => {
        if (flippedCards.length === 2) {
            setIsChecking(true);
            const [id1, id2] = flippedCards;
            const card1 = cards.find(c => c.id === id1);
            const card2 = cards.find(c => c.id === id2);

            if (card1.value === card2.value) {
                setMatchesFound(prev => prev + 1);
                setCards(prevCards => 
                    prevCards.map(c => 
                        c.id === id1 || c.id === id2 ? { ...c, isMatched: true, isFlipped: true } : c
                    )
                );
                setFlippedCards([]);
                setIsChecking(false);
            } else {
                const timeoutId = setTimeout(() => {
                    setCards(prevCards => 
                        prevCards.map(c => 
                            c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
                        )
                    );
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);

                return () => clearTimeout(timeoutId); 
            }
        }
    }, [flippedCards, cards]);

    const handleCardClick = (id) => {
        if (isChecking || gameStatus !== 'playing') return;

        const card = cards.find(c => c.id === id);
        
        if (card.isFlipped || card.isMatched || flippedCards.includes(id)) return;
        
        setMoves(prev => prev + 1);

        if (flippedCards.length < 2) {
            setCards(prevCards => 
                prevCards.map(c => 
                    c.id === id ? { ...c, isFlipped: true } : c
                )
            );
            setFlippedCards(prev => [...prev, id]);
        }
    };
    
    const handleDifficultyChange = (newDifficulty) => {
        if (newDifficulty.pairs !== difficulty.pairs) {
            startNewGame(newDifficulty);
        }
    }

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // --- RENDER FUNCTIONS (Simplified for brevity) ---
    const renderCard = (card) => {
        const isVisible = card.isFlipped || card.isMatched;
        const backClass = 'bg-white shadow-lg rounded-xl flex items-center justify-center';
        const frontClass = 'bg-pink-100 border-2 border-pink-300 shadow-inner rounded-xl flex items-center justify-center';

        return (
            <div 
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                    w-full aspect-square p-1 cursor-pointer 
                    ${card.isMatched ? 'opacity-50 pointer-events-none' : ''}
                    ${isChecking ? 'pointer-events-none' : ''}
                `}
            >
                <div 
                    className={`
                        w-full h-full rounded-xl transition-all duration-300 ease-in-out
                        ${isVisible ? backClass : frontClass + ' hover:bg-pink-200'}
                    `}
                >
                    {isVisible 
                        ? <span className="text-3xl sm:text-4xl">{card.value}</span> 
                        : <span className="text-xl text-pink-400 font-bold">?</span>
                    }
                </div>
            </div>
        );
    };

    const renderDifficultyButton = (diff, index) => {
        const isActive = diff.pairs === difficulty.pairs;
        const colorClass = index === 0 ? 'text-gray-600' : index === 1 ? 'text-black' : 'text-gray-600';
        const activeClass = isActive ? 'bg-pink-400 font-bold shadow-inner' : 'bg-transparent text-gray-500 hover:bg-pink-100';

        return (
            <button
                key={diff.label}
                onClick={() => handleDifficultyChange(diff)}
                className={`
                    py-2 px-4 rounded-xl text-sm transition-colors duration-150 border-2 border-transparent
                    ${isActive ? 'border-pink-500' : ''}
                    ${activeClass}
                    ${colorClass}
                `}
            >
                {diff.label}
            </button>
        );
    };


    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-pink-50 text-gray-800 p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                
                {/* Header (Memory Match) */}
                <h1 className="text-5xl font-extrabold mb-4 text-center text-purple-600">Memory Match</h1>

                {/* Difficulty Select */}
                <div className="flex justify-center space-x-2 mb-6 bg-white p-2 rounded-xl shadow-md border border-gray-100">
                    {Object.values(DIFFICULTIES).map(renderDifficultyButton)}
                </div>

                {/* Stats Bar and New Game Button */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => startNewGame(difficulty)}
                        className="py-2 px-4 text-lg font-semibold text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                        <span className="text-xl mr-2">🔄</span> New Game
                    </button>

                    {/* Stats Display */}
                    <div className="flex items-center text-lg font-medium bg-white px-4 py-2 rounded-lg shadow-inner border border-gray-200">
                        <span className="mr-4">Moves: <span className="font-bold">{moves}</span></span>
                        <span className="mr-4">Time: <span className="font-bold">{formatTime(time)}</span></span>
                        <span>Pairs: <span className="font-bold text-pink-500">{matchesFound}/{difficulty.pairs}</span></span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-2xl border border-pink-200">
                    {/* Dynamic Grid Layout */}
                    <div 
                        className={`grid gap-3 md:gap-4`}
                        style={{
                            gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${difficulty.rows}, minmax(0, 1fr))`
                        }}
                    >
                        {cards.map(renderCard)}
                    </div>
                </div>

                {/* ➡️ WIN MODAL: Renders only when gameStatus is 'won' */}
                {gameStatus === 'won' && (
                    <GameOverModal
                        title="CONGRATULATIONS!"
                        message={`You matched all pairs in ${formatTime(time)} and ${moves} moves!`}
                        onPlayAgain={() => startNewGame(difficulty)}
                        onBackToHome={() => navigate('/')}
                    />
                )}


                {/* Back to Home Button: Renders only when gameStatus is NOT 'won' */}
                {gameStatus !== 'won' && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="py-3 px-6 text-lg font-semibold text-white bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors duration-200 shadow-lg flex items-center justify-center"
                        >
                            &larr; Back to Games Hub
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemoryMatch;