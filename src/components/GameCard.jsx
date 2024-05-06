import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Platform from "./info_game/Platform";

export default function GameCard({ game }) {
    const [videoUrl, setVideoUrl] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=b6bee7856c404feaad9b535d9e489152`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    setVideoUrl(data.results[0].data.max);
                }
            } catch (error) {
                console.error('Error fetching game video:', error);
            }
        };

        if (isHovering && !videoUrl) {
            fetchVideo();
        }
    }, [game.id, isHovering, videoUrl]);

    const handleVideoLoadedMetadata = (event) => {
        setVideoWidth(event.target.videoWidth);
        setVideoHeight(event.target.videoHeight);
    };

    return (
        <>

      <Link to={`/game/${game.id}`}>
            <article
                className="game-card"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="game-img">
                    {isHovering && videoUrl ? (
                        <video
                            src={videoUrl}
                            autoPlay
                            loop
                            muted
                            width={videoWidth}
                            height={videoHeight}
                            onLoadedMetadata={handleVideoLoadedMetadata}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={game.background_image} alt={game.name} />
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
        </>
    );
}
