import React, { useEffect, useState } from 'react';

export default function Screenshots({ id, handleZoom, resetZoom, zoomedImage, setZoomedImage }) {
    const [gameScreenshot, setGameScreenshot] = useState([]);
    // const [zoomedImage, setZoomedImage] = useState(null); // Use a different state variable for zoomed image

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
       .then(response => response.json())
       .then(data => setGameScreenshot(data.results))
       .catch(error => console.error('Error fetching data:', error));
    }, [id]);

    // Reset zoomed image state when resetZoom is called
    useEffect(() => {
        if (!zoomedImage) {
            setZoomedImage(null);
        }
    }, [zoomedImage]);

    return (
        <div className="game-screenshots">
            {gameScreenshot.map(screenshot => (
                <img 
                    onClick={() => handleZoom(screenshot)} 
                    key={screenshot.id} 
                    src={screenshot.image} 
                    alt={screenshot.id} 
                />
            ))}
            {zoomedImage && (
                <img 
                    onClick={resetZoom} 
                    src={zoomedImage.image} 
                    alt={zoomedImage.id} 
                    style={{
                        display: 'block',
                        position: 'fixed',
                        top: '45%',
                        left: '50%',
                        transform: 'scale(8)',
                        transition: 'transform 0.3s ease-in-out',
                        textAlign: 'center'
                    }} // Apply zoom effect
                />
            )}
        </div>
    );
}
