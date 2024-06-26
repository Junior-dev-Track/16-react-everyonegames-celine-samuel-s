import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Platform from '../components/info_game/Platform';

function GamePage() {
  const { id } = useParams();
  const [gameInfo, setGameInfo] = useState({});
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Récupérer les informations du jeu
    fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setGameInfo(data);
        console.log('Game info:', data); // Vérifiez ici si `background_image` existe
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching game data:', error);
        setLoading(false);
      });

    // Récupérer les captures d'écran et une seule vidéo (le trailer)
    Promise.all([
      fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then((response) => response.json())
        .then((data) => data.results || []),
      fetch(`https://api.rawg.io/api/games/${id}/movies?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}`)
        .then((response) => response.json())
        .then((data) => data.results[0] || null)
    ]).then(([screenshots, trailer]) => {
      // Organiser les éléments dans le carrousel
      const initialCarouselItems = [];
      if (gameInfo.background_image) {
        initialCarouselItems.push({ type: 'image', url: gameInfo.background_image });
      } else {
        console.log('Background image is missing'); // Indiquez si le champ est manquant
      }

      screenshots.forEach((screenshot) => initialCarouselItems.push({ type: 'image', url: screenshot.image }));
      if (trailer) {
        initialCarouselItems.push({ type: 'video', url: trailer.data.max });
      }

      setCarouselItems(initialCarouselItems);
    }).catch((error) => console.error('Error fetching screenshots and video:', error));
  }, [id]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  if (loading) {
    return (
      <section className="section">
        <h4>Loading...</h4>
      </section>
    );
  }

  // Assurez-vous que l'élément actuel est bien récupéré
  const currentItem = carouselItems[currentIndex] || {};

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
              <button className="carousel-button previous" onClick={handlePrevious}>◀</button>
              {currentItem.type === 'image' ? (
                <img src={currentItem.url} alt={`Carousel item ${currentIndex + 1}`} />
              ) : (
                <video key={currentItem.url} controls>
                  <source src={currentItem.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <button className="carousel-button next" onClick={handleNext}>▶</button>
            </div>
          </div>

          <div className="game-info-important">
            <div className="game-info-important-content">
              <h5>Available on:</h5>
              <div className="list-container information-content">
                {gameInfo.stores && gameInfo.stores.length > 0 && (
                  <ul className="game-stores">
                    {gameInfo.stores.map((store) => (
                      <li key={store.store.id}>
                        <a href={`http://${store.store.domain}`} className="aButton">{store.store.name}</a>
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="game-platform information-content">
                  {gameInfo.parent_platforms && gameInfo.parent_platforms.map((platform) => (
                    <Platform platform={platform} key={platform.id} />
                  ))}
                </ul>
              </div>
            </div>

            <div className="game-info-important-content small-infos">
              <h5>Genres:</h5>
              <div className="list-container information-content">
                <ul className="game-genres">
                  {gameInfo.genres && gameInfo.genres.map((genre) => (
                    <li key={genre.id}>
                      <p className="game-genres-item">{genre.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {gameInfo.esrb_rating && (
              <div className="game-info-important-content small-infos">
                <h5>ESRB Rating:</h5>
                <div className="information-content">
                  <p>{gameInfo.esrb_rating.name}</p>
                </div>
              </div>
            )}

            <div className="game-info-important-content small-infos">
              <h5>Rating:</h5>
              <div className="information-content">
                <p>{gameInfo.rating || 'N/A'}</p>
              </div>
            </div>

            {gameInfo.metacritic_platforms && gameInfo.metacritic_platforms.length > 0 && (
              <div className="game-info-important-content">
                <h5>Metacritics:</h5>
                <ul className="game-metacritics information-content">
                  {gameInfo.metacritic_platforms.map((meta) => (
                    <li key={meta.id} className="game-metacritics-info">
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
                <p>{gameInfo.released || 'Undefined'}</p>
              </div>
            </div>

            <div className="game-info-important-content small-infos">
              <h5>Publisher:</h5>
              <div className="information-content">
                {gameInfo.publishers && gameInfo.publishers.map((publisher) => (
                  <p key={publisher.id}>{publisher.name}</p>
                ))}
              </div>
            </div>

            {gameInfo.website && (
              <div className="game-info-important-content small-infos">
                <h5>Official Website:</h5>
                <div className="information-content">
                  <a href={gameInfo.website} className="a-website">{gameInfo.website}</a>
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
              {gameInfo.tags && gameInfo.tags.map((tag) => (
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
