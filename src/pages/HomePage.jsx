import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PopularGames from '../components/PopularGames';
import NewGames from '../components/NewGames';
import AllGames from '../components/AllGames';

function HomePage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGames(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <>
        <Header />
        <main>
            <section className="container">
                <h1>Everyone Games</h1>
                <PopularGames />
                <NewGames />
                <AllGames />
                {/* {games.map(game => (
                    <div key={game.id}>
                    <h2>{game.name}</h2>
                    <img src={game.background_image} alt={game.name} />
                    </div>
                ))} */}
            </section>
        </main>
        <Footer />
        </>
    );
}

export default HomePage;