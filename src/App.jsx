// src/App.jsx (UPDATED)

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ScoreProvider } from './context/ScoreContext'; 
import Home from './pages/Home';
import Hangman from './pages/Hangman';
import MemoryMatch from './pages/MemoryMatch';
import ScoreBoard from './Components/ScoreBoard'; 
import GameRoutesWrapper from './components/GameRoutesWrapper'; 
// ➡️ IMPORT NEW COMPONENT
import WordSearch from './pages/WordSearch'; 


function App() {
    return (
        <ScoreProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/scores" element={<div className="min-h-screen bg-slate-950 p-8"><ScoreBoard showClear={true} /></div>} />
                    
                    <Route path="/tic-tac-toe/*" element={<GameRoutesWrapper />} />
                    
                    <Route path="/hangman" element={<Hangman />} />
                    <Route path="/memory-match" element={<MemoryMatch />} />
                    
                    {/* ➡️ NEW ROUTE FOR WORD SEARCH */}
                    <Route path="/word-search" element={<WordSearch />} />

                    <Route path="*" element={<div className="min-h-screen bg-slate-950 text-white text-4xl flex items-center justify-center">404 - Page Not Found</div>} />
                </Routes>
            </Router>
        </ScoreProvider>
    );
}

export default App;