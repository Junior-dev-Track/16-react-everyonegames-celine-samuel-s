import React, { useEffect, useState } from 'react';

export default function Screenshots({ id }) {
    const [gameScreenshot, setGameScreenshot] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameScreenshot(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, [id]); // Ajout de l'ID comme dépendance

    return (
        <div className="game-screenshots">
            {gameScreenshot.map(screenshot => (
                <img key={screenshot.id} src={screenshot.image} alt={screenshot.id} />
            ))}
        </div>
    );
}
