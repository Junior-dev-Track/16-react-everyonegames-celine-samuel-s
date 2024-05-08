import React, { useEffect, useState } from 'react';

export default function Screenshots({ id, handleZoom, resetZoom, zoomedImage, setZoomedImage, isZoomed, setIsZoomed }) {
    const [gameScreenshot, setGameScreenshot] = useState([]);

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
            setIsZoomed(false); // Also reset the zoomed state
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
            {isZoomed && (
                <div 
                onClick={resetZoom}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                    zIndex: 9999, // Ensure it's above other content
                }}>
                    <img 
                        src={zoomedImage.image} 
                        alt={zoomedImage.id} 
                        style={{
                            display: 'block',
                            position: 'fixed',
                            top: '45%',
                            left: '50%',
                            transform: 'scale(6)',
                            transition: 'transform 0.3s ease-in-out',
                            textAlign: 'center',
                            zIndex: 10000, // Ensure it's above the background
                        }}
                    />
                </div>
            )}
        </div>
    );
}
