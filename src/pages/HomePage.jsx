import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <Link to='/about'>Go to About Page</Link>
        </div>
    );
}

export default HomePage;