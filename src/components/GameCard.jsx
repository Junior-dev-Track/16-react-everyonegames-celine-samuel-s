import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Platform from "../components/info_game/Platform";
import Screenshots from '../components/info_game/Screenshots';
import Trailer from '../components/info_game/Trailer';

export default function GameCard({ game }) {
    const [isHovering, setIsHovering] = useState(false);
    const [hasTrailer, setHasTrailer] = useState(false);
    const [screenshots, setScreenshots] = useState([]);
    const [screenshotIndex, setScreenshotIndex] = useState(0);
    const videoRef = useRef(null);

    const handleMouseEnter = async () => {
        setIsHovering(true);
        try {
            const moviesResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`);
            const moviesData = await moviesResponse.json();
            setHasTrailer(moviesData.results && moviesData.results.length > 0);

            const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`);
            const screenshotsData = await screenshotsResponse.json();
            setScreenshots(screenshotsData.results || []);
        } catch (error) {
            console.error('Error fetching media:', error);
            setHasTrailer(false);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setScreenshotIndex(0); // Reset the index when mouse leaves
    };

    useEffect(() => {
        let interval;
        if (isHovering && !hasTrailer && screenshots.length > 0) {
            interval = setInterval(() => {
                setScreenshotIndex(prevIndex => (prevIndex + 1) % screenshots.length);
            }, 2000); // Change every 2 seconds
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovering, hasTrailer, screenshots.length]);

    const handleVideoPlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.error('Error playing the video:', error));
        }
    };

    return (
        <Link to={`/game/${game.id}`}>
            <article className="game-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="game-img">
                    {isHovering ? (
                        hasTrailer ? (
                            <Trailer id={game.id} autoplay={true} />
                        ) : (
                            screenshots.length > 0 && (
                                <img src={screenshots[screenshotIndex].image} alt={`Screenshot ${screenshotIndex}`} />
                            )
                        )
                    ) : (
                        <img src={game.background_image} alt={game.name} />
                    )}
                    {isHovering && hasTrailer && (
                        <button onClick={handleVideoPlay} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 1 }}>
                            {/* Invisible button to trigger video play */}
                        </button>
                    )}
                </div>
                <div className="game-info">
                    <h2>{game.name}</h2>
                    <p>Rating: {game.rating}</p>
                    <p>Released: {game.released.substring(0, 4)}</p>
                    <ul className="game-platform">
                        {game.parent_platforms.map(platform => (
                            <Platform platform={platform} key={platform.id} />
                        ))}
                    </ul>
                </div>
            </article>
        </Link>
    );
}
