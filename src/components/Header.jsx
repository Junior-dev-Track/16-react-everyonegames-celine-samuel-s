import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <div className="container">
                <Link to='/'>
                    <img src="./src/images/logo.png" alt="home" className="logo"/>
                </Link>
                <div className="search-bar">
                    <input type="text" placeholder="Search for a game" />
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to='/allgames'>Browse games</Link>
                            <Link to='/about'>About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}