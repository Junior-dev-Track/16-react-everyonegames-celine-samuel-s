import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Screenshots from '../components/info_game/Screenshots';
import Trailer from '../components/info_game/Trailer';

function GamePage() {
    const { id } = useParams();
    const [gameInfo, setGameInfo] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameInfo(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    // TODO trailer : games / {id} / movies

    return (
        <>
        <Header />
        <main>
            <section className="container">
                <h1>{gameInfo.name}</h1>
                <div className="game-images">
                    <Screenshots id={id} />
                    <Trailer id={id} />
                    
                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}

export default GamePage;