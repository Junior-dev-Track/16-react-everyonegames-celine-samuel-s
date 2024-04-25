import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <div className="container">
            <Link to='/'>
                <img src="./src/images/logo.png" alt="home" className="logo"/>
            </Link>
            </div>
            <h1>Game Library</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
    )
}