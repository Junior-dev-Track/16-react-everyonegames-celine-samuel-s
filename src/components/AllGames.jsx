import { useState } from "react";
import { Link } from 'react-router-dom';

export default function AllGames() {
    return (
        <section>
            <div className="container">
                <h2>All Games</h2>
                <button><Link to='/allgames'>Browse all games</Link></button>
            </div>
        </section>
    )
}