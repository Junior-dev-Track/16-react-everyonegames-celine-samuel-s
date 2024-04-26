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

    // useEffect(() => {
    //     fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
    //     .then(response => response.json())
    //     .then(data => setGameInfo(data))
    //     .catch(error => console.error('Error fetching data:', error));
    // }, []);

    // TODO : temp solution to avoid API calls
    useEffect(() => {
        fetch('/gameInfo.json')
        .then(response => response.json())
        .then(data => {
            setGameInfo(data);
            // console.log(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(gameInfo)

    return (
        <>
        <Header />
        <main>
            <h1>{gameInfo.name}</h1>
            <section className="container container-game-page">
                <div className="game-images">
                    <img src={gameInfo.background_image} alt={gameInfo.name} />
                    {/* <Trailer id={id} />
                    <Screenshots id={id} /> */}
                </div>

                <div className="game-info-important">
                    <ul className="game-platform">
                        {gameInfo.parent_platforms.map(platform => (
                            <Platform platform={platform} key={platform.id} />
                        ))}
                    </ul>
                    
                    <h2>Available on:</h2>
                    <ul className="game-stores">
                        {gameInfo.stores.map(store => (
                            <li key={store.store.id}>
                                <a href={`http://${store.store.domain}`}>{store.store.name}</a>
                            </li>
                        ))}
                    </ul>
                    
                    <h2>Genres</h2>
                    <ul className="game-genres">
                        {gameInfo.genres.map(genre => (
                            <li key={genre.id}>
                                <p className="game-genres-item">{genre.name}</p>
                            </li>
                        ))}
                    </ul>

                    <h2>ESRB Rating</h2>
                    <p>{gameInfo.esrb_rating.name}</p>
                    {/* TODO: component with the different id ? */}

                    <h2>Rating: </h2>
                    <p>{gameInfo.rating}</p>

                    <h2>Metacritics</h2>
                    <ul className="game-metacritics">
                        {gameInfo.metacritic_platforms.map(meta => (
                            <li key={meta.id} className='game-metacritics-info'>
                                <p>{meta.metascore}</p>
                                <a href={`${meta.url}`}>{meta.platform.name}</a>
                            </li>
                        ))}
                    </ul>

                    <h2>Released</h2>
                    {gameInfo.released}

                    <h2>Publisher (also possible to get developpers)</h2>
                    {gameInfo.publishers.map(publisher => (
                        <p key={publisher.id}>{publisher.name}</p>
                    ))}

                    <h2>Official website</h2>
                    <a href={gameInfo.website}>{gameInfo.website}</a>
                </div>
            </section>

            <section className="container container-game-page-description">
                <div className="game-description">
                    <h2>Description</h2>
                    <p>{gameInfo.description_raw}</p>
                </div>
                <div className="game-info-others">
                    <h2>Tags</h2>
                    <ul className="game-tags">
                        {gameInfo.tags.map(tag => (
                            <li key={tag.id}>
                                <p>{tag.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}

export default GamePage;