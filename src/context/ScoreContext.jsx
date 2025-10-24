// src/context/ScoreContext.jsx (FINAL CORRECTED VERSION)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- 1. CONFIGURATION (TIC TAC TOE & WORD SEARCH) ---
// ➡️ EXPORT GAME_CONFIG
export const GAME_CONFIG = {
    // Existing Tic Tac Toe Config
    'easy': { size: 3, winCondition: 3, desc: '3x3 (3 in a row)' },
    'medium': { size: 6, winCondition: 4, desc: '6x6 (4 in a row)' },
    'advanced': { size: 9, winCondition: 5, desc: '9x9 (5 in a row)' },

    // Word Search Configuration (as previously defined)
    'ws-easy': { size: 8, wordCount: 5, desc: '8x8 Grid, 5 Words' },
    'ws-medium': { size: 12, wordCount: 8, desc: '12x12 Grid, 8 Words' },
    'ws-hard': { size: 15, wordCount: 10, desc: '15x15 Grid, 10 Words' }
};

// ➡️ EXPORT getBoardSize
export function getBoardSize(difficulty) {
    return GAME_CONFIG[difficulty]?.size || 3;
}

// --- 2. CONTEXT (SCORE MANAGEMENT) ---
const ScoreContext = createContext();

const getInitialScores = () => {
    try {
        const storedScores = localStorage.getItem('gameScores');
        const initial = storedScores ? JSON.parse(storedScores) : {};

        // Ensure all required games are present with default scores
        return {
            'tic-tac-toe': initial['tic-tac-toe'] || { X: 0, O: 0, Draw: 0 },
            'hangman': initial['hangman'] || { Win: 0, Loss: 0 },
            'memory-match': initial['memory-match'] || { Win: 0, Loss: 0 },
            'word-search': initial['word-search'] || { Win: 0, Loss: 0 }
        };

    } catch (error) {
        console.error("Error reading scores from localStorage", error);
        return {
            'tic-tac-toe': { X: 0, O: 0, Draw: 0 },
            'hangman': { Win: 0, Loss: 0 },
            'memory-match': { Win: 0, Loss: 0 },
            'word-search': { Win: 0, Loss: 0 }
        };
    }
};

// ➡️ EXPORT ScoreProvider
export const ScoreProvider = ({ children }) => {
    const [scores, setScores] = useState(getInitialScores);

    useEffect(() => {
        try {
            localStorage.setItem('gameScores', JSON.stringify(scores));
        } catch (error) {
            console.error("Error writing scores to localStorage", error);
        }
    }, [scores]);

    const updateScore = useCallback((gameName, resultType, amount = 1) => {
        setScores(prevScores => {
            const newScores = { ...prevScores };
            if (newScores[gameName] && newScores[gameName].hasOwnProperty(resultType)) {
                newScores[gameName][resultType] = (newScores[gameName][resultType] || 0) + amount;
            } else {
                console.warn(`Attempted to update invalid score for game: ${gameName}, result: ${resultType}`);
            }
            return newScores;
        });
    }, []);

    const clearScores = useCallback(() => {
        if (window.confirm("Are you sure you want to clear all scores?")) {
            localStorage.removeItem('gameScores');
            setScores(getInitialScores()); 
            alert("Scores cleared successfully!");
        }
    }, []);

    return (
        <ScoreContext.Provider value={{ scores, updateScore, clearScores }}>
            {children}
        </ScoreContext.Provider>
    );
};

// ➡️ EXPORT useScores
export const useScores = () => {
    return useContext(ScoreContext);
};


// --- 3. HELPER FUNCTIONS (TIC TAC TOE LOGIC) ---

/**
 * Checks the board for a winner based on the game configuration (Connect-X logic).
 * ➡️ EXPORT getWinner
 */
export function getWinner(squares, difficulty) {
    const config = GAME_CONFIG[difficulty] || GAME_CONFIG.easy;
    const { size, winCondition } = config;
    const n = size;
    const line = winCondition;

    if (!squares || squares.length !== n * n) return null;

    const checkWin = (indices) => {
        let piece = null;
        let count = 0;
        
        for(let i = 0; i < indices.length; i++) {
            const index = indices[i];
            const currentPiece = squares[index];

            if (currentPiece && currentPiece === piece) {
                count++;
            } else if (currentPiece) {
                piece = currentPiece;
                count = 1;
            } else {
                piece = null;
                count = 0;
            }

            if (count >= line) {
                const winningCombination = [];
                for(let k = 0; k < line; k++) {
                    winningCombination.push(indices[i - k]);
                }
                return { player: piece, combination: winningCombination.reverse() };
            }
        }
        return null;
    };

    // 1. Check Horizontal Lines
    for (let r = 0; r < n; r++) {
        const rowIndices = Array.from({ length: n }, (_, c) => r * n + c);
        const result = checkWin(rowIndices);
        if (result) return result;
    }

    // 2. Check Vertical Lines
    for (let c = 0; c < n; c++) {
        const colIndices = Array.from({ length: n }, (_, r) => r * n + c);
        const result = checkWin(colIndices);
        if (result) return result;
    }

    // 3. Check Diagonal Lines (Top-Left to Bottom-Right)
    for (let r = 0; r <= n - line; r++) {
        for (let c = 0; c <= n - line; c++) {
            const indices = Array.from({ length: line }, (_, k) => (r + k) * n + (c + k));
            const result = checkWin(indices);
            if (result) return result;
        }
    }

    // 4. Check Anti-Diagonal Lines (Top-Right to Bottom-Left)
    for (let r = 0; r <= n - line; r++) {
        for (let c = line - 1; c < n; c++) {
            const indices = Array.from({ length: line }, (_, k) => (r + k) * n + (c - k));
            const result = checkWin(indices);
            if (result) return result;
        }
    }

    return null;
}

/**
 * Provides a simplified AI move (random available spot).
 * ➡️ EXPORT findStrategicMove
 */
export const findStrategicMove = (board, player, difficulty) => {
    const availableMoves = board
        .map((val, index) => (val === null ? index : null))
        .filter(index => index !== null);
    
    if (availableMoves.length === 0) return -1;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]; 
};