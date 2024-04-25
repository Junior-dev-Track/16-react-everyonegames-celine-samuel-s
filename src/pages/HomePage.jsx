import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGames(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <Link to='/about'>Go to About Page</Link>
            {games.map(game => (
                <div key={game.id}>
                    <h2>{game.name}</h2>
                    <img src={game.background_image} alt={game.name} />
                </div>
            ))}
        </div>
    );
}

export default HomePage;