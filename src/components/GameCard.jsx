import { useState } from "react";
import { Link } from 'react-router-dom';
import Platform from "./Platform";

export default function GameCard({ game }) {
    return (
        <>
        <article key={game.id} className="game-card">
            <div className="game-img">
                <img src={game.background_image} alt={game.name} />
            </div>
            <div className="game-info">
                <h2>{game.name}</h2>
                <p>Released: {game.released}</p>

                <ul className="game-platform">
                    {game.parent_platforms.map(platform => (
                        <Platform platform={platform} />
                    ))}
                </ul>
            </div>
        </article>
        </>
    )
}
