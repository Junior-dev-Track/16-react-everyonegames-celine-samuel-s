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

    // Vérifier si l'objet `game` contient toutes les propriétés requises
    if (!game || !game.name || !game.background_image || !game.parent_platforms) {
        return <div className="game-card">Jeu non disponible</div>;
    }

    // Gestion de l'affichage lors du survol
    const handleMouseEnter = async () => {
        setIsHovering(true);
        try {
            // Charger les trailers
            const moviesResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`);
            const moviesData = await moviesResponse.json();
            setHasTrailer(moviesData.results && moviesData.results.length > 0);

            // Charger les captures d'écran
            const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`);
            const screenshotsData = await screenshotsResponse.json();
            setScreenshots(screenshotsData.results || []);
        } catch (error) {
            console.error('Erreur lors du chargement des médias :', error);
            setHasTrailer(false);
        }
    };

    // Réinitialisation lors de la sortie du survol
    const handleMouseLeave = () => {
        setIsHovering(false);
        setScreenshotIndex(0);
    };

    // Gestion des captures d'écran en diaporama
    useEffect(() => {
        let interval;
        if (isHovering && !hasTrailer && screenshots.length > 0) {
            interval = setInterval(() => {
                setScreenshotIndex(prevIndex => (prevIndex + 1) % screenshots.length);
            }, 2000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovering, hasTrailer, screenshots.length]);

    // Gestion de la lecture automatique de la vidéo
    const handleVideoPlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.error('Erreur lors de la lecture de la vidéo :', error));
        }
    };

    // Utilisation du titre complet du jeu
    const releaseDate = game.released ? game.released.substring(0, 4) : 'Date inconnue';

    return (
        <Link to={`/game/${game.id}`}>
            <article className="game-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="game-img">
                    {isHovering ? (
                        hasTrailer ? (
                            <Trailer id={game.id} autoplay={true} />
                        ) : (
                            screenshots.length > 0 && (
                                <img src={screenshots[screenshotIndex].image} alt={`Capture d'écran ${screenshotIndex}`} />
                            )
                        )
                    ) : (
                        <img src={game.background_image} alt={game.name} />
                    )}
                    {isHovering && hasTrailer && (
                        <button onClick={handleVideoPlay} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 1 }}>
                            {/* Bouton invisible pour déclencher la lecture de la vidéo */}
                        </button>
                    )}
                </div>
                <div className="game-info">
                    <h4>{game.name}</h4>  {/* Titre complet affiché */}
                    <div className="game-rating-released">
                        <p>Rating: {game.rating || 'Non évalué'}</p>
                        <p>Released: {releaseDate}</p>
                    </div>
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
