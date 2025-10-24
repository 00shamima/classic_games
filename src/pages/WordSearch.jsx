// src/pages/WordSearch.jsx (NEW FILE)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScores, GAME_CONFIG } from '../context/ScoreContext';

// --- Word List (Example, expand this in a separate file later) ---
const WORD_LIST = [
    "REACT", "NODE", "JAVASCRIPT", "HTML", "CSS", "CONTEXT", "STATE", 
    "PROPS", "COMPONENT", "HOOKS", "TAILWIND", "ROUTER"
];

// --- Helper: Generate and Place Words (Simplified for brevity) ---
function generateWordSearch(difficulty) {
    const config = GAME_CONFIG[difficulty] || GAME_CONFIG['ws-easy'];
    const { size, wordCount } = config;
    const grid = Array(size).fill(0).map(() => Array(size).fill(null));
    
    // Select unique words
    const selectedWords = WORD_LIST.slice(0, wordCount).map(w => w.toUpperCase());
    
    // Placeholder logic: place words randomly, then fill remaining with random letters
    const placedWords = [];

    // Simple horizontal placement placeholder (Needs complex logic for real placement)
    selectedWords.forEach((word, wordIndex) => {
        let placed = false;
        // Try to place horizontally at row 'wordIndex'
        if (word.length <= size && wordIndex < size) {
            let startCol = Math.floor((size - word.length) / 2);
            for (let i = 0; i < word.length; i++) {
                grid[wordIndex][startCol + i] = word[i];
            }
            placedWords.push({ word, found: false });
            placed = true;
        }
    });

    // Fill empty cells with random uppercase letters
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === null) {
                grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
            }
        }
    }

    return { grid, words: placedWords };
}


function WordSearch() {
    const { updateScore } = useScores();
    const [difficulty, setDifficulty] = useState('ws-easy');
    const [gameState, setGameState] = useState(null); // { grid: [...], words: [...] }
    const [selectedCells, setSelectedCells] = useState([]); // [{r, c}, ...]
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [message, setMessage] = useState("Select a difficulty to start.");

    const config = GAME_CONFIG[difficulty];

    const initializeGame = useCallback(() => {
        const newGame = generateWordSearch(difficulty);
        setGameState(newGame);
        setSelectedCells([]);
        setIsGameRunning(true);
        setMessage("Find the words!");
    }, [difficulty]);

    useEffect(() => {
        if (!gameState && isGameRunning) {
            initializeGame();
        }
    }, [gameState, isGameRunning, initializeGame]);

    // --- SELECTION LOGIC ---
    const handleCellClick = (r, c) => {
        if (!isGameRunning || gameState.words.every(w => w.found)) return;

        const cell = { r, c };
        setSelectedCells(prev => {
            if (prev.length === 0) {
                // Start new selection
                return [cell];
            } else if (prev.length === 1 && prev[0].r === r && prev[0].c === c) {
                // Deselect the starting cell
                return [];
            } else if (prev.length === 1) {
                // Second cell selected: determine selection path
                const [start] = prev;
                // Simple Check: must be a straight line (horizontal, vertical, or diagonal)
                const isHorizontal = start.r === r;
                const isVertical = start.c === c;
                const isDiagonal = Math.abs(start.r - r) === Math.abs(start.c - c);

                if (isHorizontal || isVertical || isDiagonal) {
                    // Collect all cells in the path
                    const newSelection = getCellsInPath(start, cell, gameState.grid.length);
                    return newSelection;
                }
                // Invalid selection, start over
                return [cell]; 
            } else {
                // Selection already active (length > 1), clicking resets
                return [cell];
            }
        });
    };

    // Helper to get all cells between two points (r1, c1) and (r2, c2) in a straight line
    const getCellsInPath = (start, end, size) => {
        const path = [];
        const dr = Math.sign(end.r - start.r);
        const dc = Math.sign(end.c - start.c);
        let r = start.r;
        let c = start.c;

        while (r !== end.r + dr || c !== end.c + dc) {
            path.push({ r, c });
            r += dr;
            c += dc;
            // Safety break
            if (path.length > size * 2) break; 
        }
        return path;
    };

    // --- CHECK WORD ---
    useEffect(() => {
        if (selectedCells.length < 2 || !gameState) return;

        const selectedWord = selectedCells
            .map(({ r, c }) => gameState.grid[r][c])
            .join('');

        let foundWordIndex = -1;
        
        // Check if selectedWord (or its reverse) matches an unfound word
        gameState.words.forEach((item, index) => {
            if (item.found) return;

            if (item.word === selectedWord || item.word === selectedWord.split('').reverse().join('')) {
                foundWordIndex = index;
            }
        });

        if (foundWordIndex !== -1) {
            setGameState(prev => {
                const newWords = [...prev.words];
                newWords[foundWordIndex] = { ...newWords[foundWordIndex], found: true, cells: selectedCells };
                return { ...prev, words: newWords };
            });
            setSelectedCells([]);
            setMessage("Word found! Keep going.");

            // Check for Win
            if (gameState.words.filter((_, i) => i !== foundWordIndex).every(w => w.found)) {
                setMessage("Congratulations! You found all the words!");
                setIsGameRunning(false);
                updateScore('word-search', 'Win');
            }
        } else {
            // Wait briefly, then clear selection for wrong guess
            const timeout = setTimeout(() => {
                setSelectedCells([]);
                setMessage("Not a match. Try again.");
            }, 500);
            return () => clearTimeout(timeout);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCells, gameState, updateScore]);


    // --- RENDER FUNCTIONS ---
    const getCellClass = (r, c) => {
        const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
        const foundWord = gameState.words.find(w => w.cells && w.cells.some(cell => cell.r === r && cell.c === c));

        let className = "flex items-center justify-center aspect-square text-lg font-bold border border-gray-200 transition-colors duration-100";
        
        if (foundWord) {
            className += " bg-green-400 text-white";
        } else if (isSelected) {
            className += " bg-blue-200 text-blue-800";
        } else {
            className += " bg-white hover:bg-gray-50 text-gray-800";
        }
        return className;
    };
    
    const getWordListClass = (found) => {
        return found 
            ? "text-xl font-semibold text-green-600 line-through transition-all duration-300"
            : "text-xl font-semibold text-gray-700 transition-all duration-300";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center py-10">
            <div className="w-full max-w-4xl mx-5 bg-white p-8 rounded-2xl shadow-2xl text-center">
                
                <h1 className="text-4xl font-extrabold text-purple-700 mb-6">Word Search</h1>

                {/* Difficulty Selection */}
                <div className="flex justify-center space-x-4 mb-8">
                    {['ws-easy', 'ws-medium', 'ws-hard'].map(key => (
                        <button
                            key={key}
                            onClick={() => { setDifficulty(key); setGameState(null); setIsGameRunning(false); setMessage("Select a difficulty to start."); }}
                            className={`py-2 px-4 rounded-xl font-bold transition-all border-2 ${
                                difficulty === key
                                    ? 'bg-purple-500 text-white border-purple-700'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            {GAME_CONFIG[key].desc}
                        </button>
                    ))}
                </div>

                {/* Start/Reset Button */}
                <button
                    onClick={initializeGame}
                    className="py-3 px-8 mb-6 rounded-xl text-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg"
                >
                    {gameState ? "Start New Game" : "Generate Game"}
                </button>

                <p className={`text-2xl font-semibold mb-6 ${isGameRunning ? 'text-blue-700' : 'text-gray-700'}`}>
                    {message}
                </p>


                {gameState && (
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        
                        {/* Word List */}
                        <div className="md:w-1/3 p-4 bg-gray-50 rounded-xl shadow-inner text-left">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">Words ({gameState.words.filter(w => w.found).length}/{gameState.words.length}):</h3>
                            <ul className="space-y-2">
                                {gameState.words.map((item, index) => (
                                    <li key={index} className={getWordListClass(item.found)}>
                                        {item.word}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Grid */}
                        <div 
                            className="md:w-2/3 grid gap-0.5 p-2 bg-gray-200 rounded-xl shadow-md"
                            style={{
                                gridTemplateColumns: `repeat(${config.size}, 1fr)`,
                            }}
                        >
                            {gameState.grid.flat().map((letter, index) => {
                                const r = Math.floor(index / config.size);
                                const c = index % config.size;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleCellClick(r, c)}
                                        className={getCellClass(r, c)}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                    <Link
                        to="/"
                        className="text-lg text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WordSearch;