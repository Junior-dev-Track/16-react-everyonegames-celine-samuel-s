import React, { useEffect, useState } from 'react';

export default function Trailer({ id, autoplay, handleZoom, resetZoom, zoomedImage, setZoomedImage, isZoomed, setIsZoomed }) {
    const [gameMovies, setGameMovies] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameMovies(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, [id]); // Ajout de l'ID comme dépendance

    // Reset zoomed image state when resetZoom is called
    useEffect(() => {
        if (!zoomedImage) {
            setZoomedImage(null);
            setIsZoomed(false); // Also reset the zoomed state
        }
    }, [zoomedImage]);

    if (gameMovies.length > 0) {
        return (
            <div className="game-movies">
                {gameMovies.map(movies => (
                        <video 
                            onClick={() => handleZoom(movies.data)} // Pass the entire movies object>
                            key={movies.id} 
                            src={movies.data.max} 
                            controls 
                            autoPlay={autoplay} 
                            muted 
                            loop={autoplay} 
                            alt={movies.id} />
                ))}
            </div>
        );
    } else return null;
}
