import React, { useEffect, useState } from 'react';

export default function FutureGames() {
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}&dates=2024-01-01,2024-12-31&ordering=-released`)
        .then(response => response.json())
        .then(data => {
            // Filtrer pour obtenir seulement les jeux de l'année 2024 et limiter à 5 jeux
            const futureGames = data.results.filter(game => game.released && game.released.substring(0, 4) === '2024').slice(0, 5);
            setGames(futureGames);
            if (futureGames.length > 0) {
                setCurrentIndex(0); // Commencer par le premier jeu
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const nextGame = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % games.length); // Passer au jeu suivant en mode cyclique
    };

    const prevGame = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + games.length) % games.length); // Revenir au jeu précédent en mode cyclique
    };

    return (
        <div className="container">
            <h2 className='popular'>Upcoming 2024 Releases</h2>
            <hr />
            {games.length > 0 && games[currentIndex] && (
                <div className='game_popular'>
                    <h2>{games[currentIndex].name}</h2>
                    <img src={games[currentIndex].background_image} alt={games[currentIndex].name}/>
                    {games[currentIndex].metacritic && (
                        <div className="metacritic-score">
                            Metacritic Score: {games[currentIndex].metacritic}
                        </div>
                    )}
                    <div className="navigation-buttons">
                        <button onClick={prevGame}>&lt;</button> {/* Flèche gauche */}
                        <button onClick={nextGame}>&gt;</button> {/* Flèche droite */}
                    </div>
                </div>
            )}
        </div>
    );
}
