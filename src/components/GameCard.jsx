import { useState } from "react";
import { Link } from 'react-router-dom';
import Platform from "./Platform";

export default function GameCard({ game }) {


    return (
        <>
        <Link to={`/game/${game.id}`}>
            <article key={game.id} className="game-card">
                <div className="game-img">
                    <img src={game.background_image} alt={game.name} />
                </div>
                <div className="game-info">
                    <h2>{game.name}</h2>
                    <p>Rating: {game.rating}</p>
                    <p>Released: {game.released.substring(0, 4)}</p>

                    <ul className="game-genres">
                        {game.genres.map(genre => (
                            <li key={genre.id}>{genre.name}</li>
                        ))}
                    </ul>

                    <ul className="game-platform">
                        {game.parent_platforms.map(platform => (
                            <Platform platform={platform} />
                        ))}
                    </ul>
                </div>
            </article>
        </Link>
        </>
    )
}
