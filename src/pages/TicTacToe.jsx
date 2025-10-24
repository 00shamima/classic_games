// src/pages/TicTacToe.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'; 

import { 
    useScores, 
    getBoardSize, 
    getWinner, 
    findStrategicMove 
} from '../context/ScoreContext'; 


function TicTacToe() {
    const params = useParams();
    const { scores, updateScore } = useScores();
    const navigate = useNavigate();

    // Configuration derived from URL params
    const gameMode = params.mode || 'human'; 
    const difficulty = params.difficulty || 'easy';
    const playerPiece = params.playerPiece || 'X';
    
    const currentBoardSize = getBoardSize(difficulty);

    // CORE GAME STATE 
    const [board, setBoard] = useState(Array(currentBoardSize ** 2).fill(null));
    const [isXTurn, setIsXTurn] = useState(true); 
    const [gameResult, setGameResult] = useState(null); 
    const [winningCells, setWinningCells] = useState([]);
    const [scoreCommitted, setScoreCommitted] = useState(false); 
    const [showResultPopup, setShowResultPopup] = useState(false); 
    
    const isPlayerX = playerPiece === 'X';
    const aiPiece = isPlayerX ? 'O' : 'X';
    const isAiTurn = gameMode === 'ai' && ((isXTurn && !isPlayerX) || (!isXTurn && isPlayerX));

    // GAME RESET
    const resetGame = useCallback(() => {
        const size = getBoardSize(difficulty); 
        setBoard(Array(size * size).fill(null));
        setIsXTurn(true);
        setGameResult(null);
        setWinningCells([]);
        setScoreCommitted(false); 
        setShowResultPopup(false); 
    }, [difficulty]); 

    // Re-initialize game if configuration changes
    useEffect(() => {
        if (board.length !== currentBoardSize * currentBoardSize || gameResult) {
            resetGame();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBoardSize, difficulty, gameMode, playerPiece]); 
    
    // AI MOVE EXECUTION
    const aiMove = useCallback(() => {
        if (gameMode !== 'ai' || gameResult) return;

        const moveIndex = findStrategicMove(board, aiPiece, difficulty); 

        if (moveIndex !== null && moveIndex !== -1) {
            setTimeout(() => {
                setBoard(prevBoard => {
                    const newBoard = [...prevBoard];
                    newBoard[moveIndex] = aiPiece;
                    return newBoard;
                });
                setIsXTurn(prev => !prev);
            }, 600);
        }
    }, [board, difficulty, aiPiece, gameMode, gameResult]);

    // AI TRIGGER EFFECT
    useEffect(() => {
        if (gameMode === 'ai' && isAiTurn && !gameResult) {
            aiMove();
        }
    }, [isAiTurn, gameResult, aiMove, gameMode]);


    // WINNER CHECK & SCORE UPDATE
    useEffect(() => {
        const result = getWinner(board, difficulty); 
        const isBoardFull = board.every((square) => square !== null);

        if (scoreCommitted) return; 

        if (result) {
            setGameResult(result.player);
            setWinningCells(result.combination);
            updateScore('tic-tac-toe', result.player); 
            setScoreCommitted(true); 
            setTimeout(() => setShowResultPopup(true), 500);
        } else if (isBoardFull) {
            setGameResult('Draw');
            updateScore('tic-tac-toe', 'Draw'); 
            setScoreCommitted(true); 
            setTimeout(() => setShowResultPopup(true), 500);
        }
    }, [board, scoreCommitted, updateScore, difficulty]); 
    
    // PLAYER MOVE HANDLER
    function handleSquareClick(index) {
        if (board[index] || gameResult || (gameMode === 'ai' && isAiTurn)) return; 

        const pieceToPlace = isXTurn ? 'X' : 'O';
        const updatedBoard = [...board];
        updatedBoard[index] = pieceToPlace;
        setBoard(updatedBoard);
        setIsXTurn(!isXTurn);
    }

    function getStatusMessage() {
        if (gameResult === 'Draw') return "It's a Draw! 🤝";
        
        if (gameResult && gameResult !== 'Draw') {
            const winner = gameResult;
            if (gameMode === 'ai') {
                 const winnerText = winner === playerPiece ? "You" : `AI (${difficulty})`;
                 return `${winnerText} Wins! 🥳`;
            } else { 
                 return `Player ${winner} Wins! 🥳`;
            }
        }
        
        if (gameMode === 'ai') {
            const nextPlayerText = isXTurn === isPlayerX ? "Your" : `AI's (${difficulty})`;
            return `Next: ${nextPlayerText} Turn (${isXTurn ? "X" : "O"})`;
        } else {
            return `Next: Player ${isXTurn ? "X" : "O"}'s Turn`;
        }
    }

    const tttScores = scores['tic-tac-toe'] || { X: 0, O: 0, Draw: 0 };

    const renderResultPopup = () => {
        if (!showResultPopup) return null;

        let message, title, titleColor = "text-gray-300", panelBg = "bg-gradient-to-br from-gray-600 to-gray-800", buttonColor = "bg-blue-500 hover:bg-blue-600";
        
        if (gameResult === 'Draw') {
             message = `It was a tough match on the ${currentBoardSize}x${currentBoardSize} board. Try again!`;
             title = "GAME OVER!";
        } else if (gameMode === 'ai') {
              const isWin = gameResult === playerPiece;
              
              if (isWin) {
                 message = `You defeated the ${difficulty} AI!`;
                 title = "VICTORY!";
                 titleColor = "text-yellow-400";
                 panelBg = "bg-gradient-to-br from-yellow-500 to-orange-500";
                 buttonColor = "bg-green-500 hover:bg-green-600";
              } else {
                 message = `The ${difficulty} AI won this time.`;
                 title = "DEFEAT!";
                 titleColor = "text-red-400";
                 panelBg = "bg-gradient-to-br from-red-600 to-red-800";
                 buttonColor = "bg-red-500 hover:bg-red-600";
              }
        } else {
             message = `Player ${gameResult} won this round!`;
             title = "GAME OVER!";
             titleColor = "text-green-400";
             panelBg = "bg-gradient-to-br from-green-600 to-blue-600";
             buttonColor = "bg-green-500 hover:bg-green-600";
        }
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className={`relative p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full ${panelBg} transform scale-95 animate-popup-in border-4 ${titleColor.replace('text', 'border')}`}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                        {(gameResult === 'X' || gameResult === 'O') ? <span className="text-8xl">🏆</span> : <span className="text-7xl">💔</span>}
                    </div>

                    <h2 className={`text-5xl font-extrabold mb-4 mt-8 drop-shadow-lg ${titleColor} uppercase`}>
                        {title}
                    </h2>
                    <p className={`text-2xl font-semibold mb-6 text-white`}>
                        {message}
                    </p>

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={resetGame}
                            className={`w-full py-3 px-6 rounded-full text-xl font-bold text-white shadow-xl ${buttonColor} transform hover:scale-105 transition-all duration-200`}
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => navigate('/tic-tac-toe')} 
                            className="w-full py-3 px-6 rounded-full text-xl font-bold text-blue-800 bg-white shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            Change Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    // MAIN RENDER
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col items-center justify-center py-10 relative overflow-hidden">
            {renderResultPopup()}
            <div className="w-full max-w-lg mx-5">
                
                <h1 className="text-5xl font-extrabold text-blue-600 mb-6 text-center" style={{fontFamily: 'Pacifico, cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
                    {gameMode === 'ai' ? `Tic Tac Toe (${difficulty.toUpperCase()})` : `Tic Tac Toe (2 Player)`}
                </h1>

                {/* Score & Status */}
                <div className="flex justify-around items-center mb-6">
                    <div className={`flex flex-col items-center p-4 rounded-2xl shadow-md w-1/3 mx-2 border ${isXTurn ? 'bg-blue-100 border-blue-300' : 'bg-blue-50 border-blue-200'}`}>
                        <span className={`text-6xl font-extrabold mb-1 leading-none text-blue-600`}>X</span>
                        <span className="text-sm font-bold text-gray-700">{gameMode === 'ai' && isPlayerX ? "You" : "Player X"}</span>
                        <span className="text-xl font-bold text-gray-800">{tttScores.X}</span>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl shadow-md w-1/3 mx-2 border border-gray-200">
                        <span className="text-4xl text-gray-500 mb-2">⚖️</span>
                        <span className="text-sm font-bold text-gray-700">Draws</span>
                        <span className="text-xl font-bold text-gray-700">{tttScores.Draw}</span>
                    </div>

                    <div className={`flex flex-col items-center p-4 rounded-2xl shadow-md w-1/3 mx-2 border ${!isXTurn ? 'bg-fuchsia-100 border-fuchsia-300' : 'bg-fuchsia-50 border-fuchsia-200'}`}>
                        <span className={`text-6xl font-extrabold mb-1 leading-none text-fuchsia-600`}>O</span>
                        <span className="text-sm font-bold text-gray-700">{gameMode === 'ai' && !isPlayerX ? `AI (${difficulty.toUpperCase()})` : "Player O"}</span>
                        <span className="text-xl font-bold text-gray-800">{tttScores.O}</span>
                    </div>
                </div>
                
                {/* Status Message */}
                <div
                    className={`text-center text-2xl font-semibold mb-8 
                        ${isXTurn ? "text-blue-600" : "text-fuchsia-600"} 
                        ${isAiTurn && !gameResult ? 'text-opacity-50' : ''}
                        ${gameResult ? 'text-gray-700' : ''}
                    `}
                >
                    {getStatusMessage()}
                    {!gameResult && isAiTurn && (
                        <span className="transition-all duration-300"> •</span>
                    )}
                </div>

                {/* Game Board (Dynamic Grid) */}
                <div 
                    className="grid gap-1 p-2 bg-white rounded-xl shadow-2xl border-2 border-gray-100"
                    style={{
                        gridTemplateColumns: `repeat(${currentBoardSize}, 1fr)`,
                        maxWidth: currentBoardSize > 6 ? '700px' : '450px',
                        margin: '0 auto'
                    }}
                >
                    {board.map((square, index) => {
                        const sizeClass = 
                            currentBoardSize === 9 ? 'text-2xl' : 
                            currentBoardSize === 6 ? 'text-4xl' : 
                            'text-8xl'; 

                        return (
                            <button
                                key={index}
                                onClick={() => handleSquareClick(index)}
                                className={`flex items-center justify-center aspect-square bg-gray-50 rounded-lg 
                                            ${sizeClass}
                                            font-extrabold  
                                            transition-all duration-300 transform 
                                            ${
                                                square === "X" ? "text-blue-600" : 
                                                square === "O" ? "text-fuchsia-600" : ""
                                            }
                                            ${
                                                winningCells.includes(index) 
                                                    ? "bg-orange-300 transform scale-110 shadow-lg" 
                                                    : (!square && !gameResult && !isAiTurn ? "hover:bg-gray-100 hover:scale-105 active:scale-95" : "")
                                            }
                                            `}
                                disabled={!!gameResult || !!square || (gameMode === 'ai' && isAiTurn)}
                            >
                                {square}
                            </button>
                        );
                    })}
                </div>
                
                <div className="flex justify-center mt-8 space-x-4">
                    {!showResultPopup && (
                        <>
                            <button
                                onClick={resetGame} 
                                className="py-3 px-6 text-lg font-semibold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-md"
                            >
                                Start New Game
                            </button>
                            <Link
                                to="/tic-tac-toe" 
                                className="py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg flex items-center justify-center"
                            >
                                &larr; Change Mode
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TicTacToe;