import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrowseGameCard from '../components/BrowseGameCard';

export default function AllGames({ }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setGames(data.results.slice(0, 5));         // take only 5 games
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(games)

    return (
        <>
        <section className="container container-article">
                <h2>All Games</h2>
                <div className="browse-container">
                        {games.map(game => (
                            <BrowseGameCard key={game.id} game={game} />
                        ))}
                    <button><Link to='/allgames'>Browse all games</Link></button>
                </div>
        </section>
        </>
    )
}