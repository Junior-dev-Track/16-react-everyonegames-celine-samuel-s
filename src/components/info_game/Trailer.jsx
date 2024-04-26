import React, { useEffect, useState } from 'react';

export default function Trailer ({ id }) {
    const [gameMovies, setGameMovies] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameMovies(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(gameMovies);
}
