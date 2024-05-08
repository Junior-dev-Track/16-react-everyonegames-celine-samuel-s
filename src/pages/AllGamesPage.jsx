import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";

function AllGamesPage() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentLetter, setCurrentLetter] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const gameIds = useRef(new Set()); // Ensemble pour suivre les identifiants uniques

  // Charger les jeux par page
  const loadGames = async () => {
    const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
    if (!apiKey) {
      console.error("La clé d'API RAWG n'est pas définie.");
      return;
    }

    if (loading || !hasMore) return; // Empêcher plusieurs appels simultanés

    setLoading(true);

    // Construire l'URL de la requête avec les paramètres nécessaires
    let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&ordering=-rating`;
    if (currentLetter) {
      url += `&search=${currentLetter}`;
    }
    if (selectedGenre) {
      url += `&genres=${selectedGenre}`;
    }
    if (selectedPlatform) {
      url += `&platforms=${selectedPlatform}`;
    }

    console.log("Fetching URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data.results);

      // Filtrer les jeux en s'assurant qu'ils sont uniques, valides et commencent par la lettre choisie
      const uniqueGames = data.results.filter((game) => {
        // Vérifiez que l'ID n'est pas déjà dans `gameIds`
        const isUnique = !gameIds.current.has(game.id);

        // Vérifiez que les propriétés essentielles existent
        const hasValidProperties =
          game.name && game.background_image && game.parent_platforms;

        // Filtrer par lettre initiale
        const startsWithCurrentLetter = currentLetter
          ? game.name.toUpperCase().startsWith(currentLetter)
          : true;

        // Ajoutez le jeu uniquement s'il est unique, valide et commence par la lettre choisie
        return isUnique && hasValidProperties && startsWithCurrentLetter;
      });

      // Ajouter les identifiants uniques au `Set`
      uniqueGames.forEach((game) => gameIds.current.add(game.id));

      // Ajouter les jeux uniques au tableau
      setGames((prev) => [...prev, ...uniqueGames]);

      // Vérifier s'il reste d'autres pages à charger
      setHasMore(!!data.next);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Charger les jeux lors du changement de lettre, de genre ou de plateforme
  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
    gameIds.current.clear(); // Réinitialiser le suivi des identifiants uniques
    loadGames(); // Charger la première page
  }, [currentLetter, selectedGenre, selectedPlatform]);

  // Charger les genres disponibles
  useEffect(() => {
    const loadGenres = async () => {
      const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
      const url = `https://api.rawg.io/api/genres?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        setGenres(data.results);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des genres :",
          error.message
        );
      }
    };

    loadGenres();
  }, []);

  // Gestionnaire d'événement pour la sélection de la lettre
  const handleLetterChange = (event) => {
    setCurrentLetter(event.target.value);
  };

  // Gestionnaire d'événement pour la sélection du genre
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  // Gestionnaire d'événement pour la sélection de la plateforme
  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  // Gestionnaire d'événement pour charger la page suivante lors du défilement
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
        loadGames();
      }
    };
    
  return (
    <>
      <Header />
      <main>
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Tous les Jeux</h1>
            <div className="select-container">
              <label htmlFor="letter">Filtrer par Lettre : </label>
              <select
                onChange={handleLetterChange}
                value={currentLetter}
                aria-label="Filtrer par Lettre"
              >
                <option value="">Tous</option>
                {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="genre">Filtrer par Genre : </label>
              <select
                onChange={handleGenreChange}
                value={selectedGenre}
                aria-label="Filtrer par Genre"
              >
                <option value="">Tous</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="platform">Filtrer par Plateforme : </label>
              <select
                onChange={handlePlatformChange}
                value={selectedPlatform}
                aria-label="Filtrer par Plateforme"
              >
                <option value="">Toutes</option>
                {/* Remplacez les options ci-dessous par les plateformes que vous souhaitez afficher */}
                <option value="1">PlayStation</option>
                <option value="2">Xbox</option>
                <option value="3">PC</option>
                <option value="18">PlayStation 4</option>
                <option value="14">Xbox One</option>
                <option value="15">Xbox 360</option>
              </select>
            </div>
          </div>
          <div className="container container-all-games-page">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AllGamesPage;
