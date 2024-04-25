import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';

function AllGamesPage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGames(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <>
            <Header />
            <main>
                <section>
                    <h1>All Games</h1>
                    <div className="container container-all-games-page">
                        {games.map(game => (
                            <GameCard game={game} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default AllGamesPage;