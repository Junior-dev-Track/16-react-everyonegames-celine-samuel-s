import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllGamesPage from './pages/AllGamesPage';
import GamesPage from './pages/GamesPage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/allgames" element={<AllGamesPage />} />
                <Route path="/game/:id" element={<GamesPage />} /> {/* Corrected route */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;