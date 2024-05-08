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
    const [zoomedImage, setZoomedImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false); // State to check if image is zoomed
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setGameInfo(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    // TODO : temp solution to avoid API calls
    // useEffect(() => {
    //     fetch('/gameInfo.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         setGameInfo(data);
    //         console.log(data);
    //     })
    //     .catch(error => console.error('Error fetching data:', error));
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch('/gameInfo.json');
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error status: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             setGameInfo(data);
    //             console.log('coucou' + data);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
            
    //         setLoading(false);
    //     };
    //     fetchData();
    // }, []);

    console.log(gameInfo.website);

    const handleZoom = (e) => {
        setZoomedImage(e);
        setIsZoomed(true); // Set zoomed state to true
    };

    const resetZoom = () => {
        setZoomedImage(null);
        setIsZoomed(false); // Reset zoomed state
    };

    if(loading) {
        return (
          <section className="section">
            <h4>Loading...</h4>
          </section>
        )
      }
    return (
        <>
        <Header />
        <main>
            <section className="container container-title">
                <h1>{gameInfo.name}</h1>
            </section>

            <section className="container container-game-page">
                <div className="game-images">
                    <div className="main-img">
                        <img src={gameInfo.background_image} alt={gameInfo.name} />
                    </div>
                    <div className="other-images">
                    <div className="flex-container">
                        <Trailer 
                            id={id}
                            handleZoom={handleZoom}
                            resetZoom={resetZoom}
                            zoomedImage={zoomedImage}
                            setZoomedImage={setZoomedImage}
                            isZoomed={isZoomed}
                            setIsZoomed={setIsZoomed}
                        />
                        <Screenshots
                            id={id}
                            handleZoom={handleZoom}
                            resetZoom={resetZoom}
                            zoomedImage={zoomedImage}
                            setZoomedImage={setZoomedImage}
                            isZoomed={isZoomed}
                            setIsZoomed={setIsZoomed}
                        />
                    </div>
                    </div>
                </div>

                <div className="game-info-important">
                    <div className="game-info-important-content">
                        <h5>Available on:</h5>
                        <div className="list-container information-content">
                            {gameInfo.stores && gameInfo.stores.length > 0 && (
                                <ul className="game-stores">
                                    {gameInfo.stores && gameInfo.stores.map(store => (
                                        <li key={store.store.id}>
                                            <a href={`http://${store.store.domain}`} className="aButton">{store.store.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <ul className="game-platform information-content">
                                {gameInfo.parent_platforms && gameInfo.parent_platforms.map(platform => (
                                    <Platform platform={platform} key={platform.id} />
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="game-info-important-content small-infos">
                        <h5>Genres:</h5>
                        <div className="list-container information-content">
                            <ul className="game-genres">
                                {gameInfo.genres && gameInfo.genres.map(genre => (
                                    <li key={genre.id}>
                                        <p className="game-genres-item">{genre.name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {gameInfo.esrb_rating && gameInfo.esrb_rating.length > 0 && (
                        <div className="game-info-important-content small-infos">
                            <h5>ESRB Rating:</h5>
                            <div className="information-content">
                                <p>{gameInfo.esrb_rating && gameInfo.esrb_rating.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="game-info-important-content small-infos">
                        <h5>Rating: </h5>
                        <div className="information-content">
                            <p>{gameInfo.rating}</p>
                        </div>
                    </div>

                    {gameInfo.metacritic_platforms && gameInfo.metacritic_platforms.length > 0 && (
                        <div className="game-info-important-content">
                            <h5>Metacritics:</h5>
                            <ul className="game-metacritics information-content">
                                {gameInfo.metacritic_platforms && gameInfo.metacritic_platforms.map(meta => (
                                    <li key={meta.id} className='game-metacritics-info'>
                                        <p>{meta.metascore}%</p>
                                        <a href={`${meta.url}`} className="aButton">{meta.platform.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="game-info-important-content small-infos">
                        <h5>Released:</h5>
                        <div className="information-content">
                            {gameInfo.released != null && (
                                <p>{gameInfo.released}</p>
                            )}
                            {gameInfo.released == null && (
                                <p>Undefined</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="game-info-important-content small-infos">
                        <h5>Publisher:</h5>
                        <div className="information-content">
                            {gameInfo.publishers && gameInfo.publishers.map(publisher => (
                                    <p key={publisher.id}>{publisher.name}</p>
                            ))}
                        </div>
                    </div>

                    {gameInfo.website != '' && (
                        <div className="game-info-important-content small-infos">
                            <h5>Official website:</h5>
                            <div className="information-content">
                                <a href={gameInfo.website} className='a-website'>{gameInfo.website}</a>
                            </div>
                        </div>
                    )}
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
                        {gameInfo.tags && gameInfo.tags.map(tag => (
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