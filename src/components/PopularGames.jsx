import React, { useEffect, useState } from 'react';

export default function PopularGames() {
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setGames(data.results); // Stocker tous les jeux
            setCurrentIndex(0); // Commencer par le premier jeu
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const nextGame = () => {
        setCurrentIndex((currentIndex + 1) % games.length); // Passer au jeu suivant
    };

    const prevGame = () => {
        setCurrentIndex((currentIndex - 1 + games.length) % games.length); // Revenir au jeu précédent
    };

    return (
        <div className="container">
            <h2 className='popular'>Popular Games</h2>
            <hr />
            {games.length > 0 && games[currentIndex] && (
                <div className='game_popular'>
                    <h2>{games[currentIndex].name}</h2>
                    <img src={games[currentIndex].background_image} alt={games[currentIndex].name}/>
                    {games[currentIndex].genres && (
                        <div className="genres">
                            {games[currentIndex].genres.map(genre => (
                                <span key={genre.id} className="genre">{genre.name}</span>
                            ))}
                        </div>
                    )}
                    <button>Price: XX.XX €</button>
                    <div>
                        <button onClick={prevGame}>&lt;</button> {/* Flèche gauche */}
                        <button onClick={nextGame}>&gt;</button> {/* Flèche droite */}
                    </div>
                </div>
            )}
        </div>
    );
}
