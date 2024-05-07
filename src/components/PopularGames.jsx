import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PopularGames() {
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Utilisez `ordering=-added` pour trier les jeux par popularité
        const url = `https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}&ordering=-added`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            setGames(data.results); // Stocker tous les jeux populaires
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
        <>
        <section className="container container-article">
        <h2 className='popular'>Popular Games</h2>
            <article>
                {/* <hr /> */}
                {games.length > 0 && games[currentIndex] && (
                    <div className='game_popular'>
                        <h3>{games[currentIndex].name}</h3>
                        <Link to={`/game/${games[currentIndex].id}`}>
                            <img src={games[currentIndex].background_image} alt={games[currentIndex].name}/>
                        </Link>
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
            </article>
        </section>
        </>
    );
}
