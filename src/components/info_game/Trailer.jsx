import React, { useEffect, useState } from 'react';

export default function Trailer({ id, autoplay, handleZoom, resetZoom, zoomedImage }) {
    const [gameMovies, setGameMovies] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameMovies(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, [id]); // Ajout de l'ID comme dépendance

    console.log(gameMovies)

    if (gameMovies.length > 0) {
        return (
            <div className="container-movies">
                <div className="game-movies">
                {gameMovies.map(movies => (
                    <video 
                        onClick={() => handleZoom(movies.data.max)} // Pass the entire movies object
                        key={movies.id} 
                        src={movies.data.max} 
                        controls 
                        autoPlay={autoplay} 
                        muted 
                        loop={autoplay} 
                        alt={movies.id} />
                ))}
                </div>
            </div>
        );
    } else return null;
}
