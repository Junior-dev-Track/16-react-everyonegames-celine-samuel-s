import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function BrowseGameCard({ game }) {
    return (
            <Link to={`/game/${game.id}`} >
                <article className="browse-game-card">
                    <div className="browse-game-info">
                        <h4>{game.name}</h4>
                    </div>
                    <div className="browse-game-img">
                        <img src={game.background_image} alt={game.name} />
                    </div>
                </article>
            </Link>
    );
}