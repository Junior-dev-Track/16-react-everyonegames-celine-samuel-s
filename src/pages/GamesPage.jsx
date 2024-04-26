import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Screenshots from '../components/info_game/Screenshots';
import Trailer from '../components/info_game/Trailer';
import Platform from '../components/info_game/Platform';

function GamePage() {
    const { id } = useParams();
    const [gameInfo, setGameInfo] = useState([]);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => setGameInfo(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(gameInfo.metacritic_platforms);

    return (
        <>
        <Header />
        <main>
            <section className="container container-game-page">
                <h1>{gameInfo.name}</h1>
                <div className="game-images">
                    <Trailer id={id} />
                    <Screenshots id={id} />
                </div>

                <div className="game-info-important">
                    <ul className="game-platform">
                        {gameInfo.parent_platforms.map(platform => (
                            <Platform platform={platform} key={platform.id} />
                        ))}
                    </ul>

                    <ul className="game-stores">
                        {gameInfo.stores.map(store => (
                            <li key={store.store.id}>
                                <a href={`http://${store.store.domain}`}>{store.store.name}</a>
                            </li>
                        ))}
                    </ul>
                    
                    <ul className="game-genres">
                        {gameInfo.genres.map(genre => (
                            <li key={genre.id}>
                                <p className="game-genres-item">{genre.name}</p>
                            </li>
                        ))}
                    </ul>

                        {/* TODO : finish here (link + rating + name of website) */}
                    {/* <ul className="game-metacritics">
                        {gameInfo.metacritic_platforms.map(meta => (
                            <li key={meta.id}>
                                <a href={`http://${meta.platform.url}`}>{meta.platform.name}</a>
                            </li>
                        ))}
                    </ul> */}

                    <p>Rating: {gameInfo.rating}</p>

                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}

export default GamePage;