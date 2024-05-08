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
  const [sortOrder, setSortOrder] = useState("rating");
  const gameIds = useRef(new Set());

  // Charger les jeux par page
  const loadGames = async () => {
    const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
    if (!apiKey) {
      console.error("La clé d'API RAWG n'est pas définie.");
      return;
    }

    if (loading || !hasMore) return;

    setLoading(true);

    let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&ordering=-${sortOrder}`;
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

      const uniqueGames = data.results.filter((game) => {
        const isUnique = !gameIds.current.has(game.id);
        const hasValidProperties = game.name && game.background_image && game.parent_platforms;
        const startsWithCurrentLetter = currentLetter ? game.name.toUpperCase().startsWith(currentLetter) : true;
        const esrbRating = game.esrb_rating?.slug || "";
        const isNotAdult = !["adult-only", "mature"].includes(esrbRating);
        const tags = game.tags?.map((tag) => tag.slug) || [];
        const isNotNSFW = !tags.includes("nsfw");

        return isUnique && hasValidProperties && startsWithCurrentLetter && isNotAdult && isNotNSFW;
      });

      uniqueGames.forEach((game) => gameIds.current.add(game.id));
      setGames((prev) => [...prev, ...uniqueGames]);

      setHasMore(!!data.next);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Charger les jeux lors du changement de lettre, de genre, de plateforme ou de tri
  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
    gameIds.current.clear();
    loadGames();
  }, [currentLetter, selectedGenre, selectedPlatform, sortOrder]);

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
        console.error("Erreur lors de la récupération des genres :", error.message);
      }
    };

    loadGenres();
  }, []);

  const handleLetterChange = (event) => {
    setCurrentLetter(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100 && !loading && hasMore) {
        loadGames();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <>
      <Header />
      <main>
        <section>
          {/* Titre centré */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1>Tous les Jeux</h1>
          </div>
  
          {/* Filtres horizontaux espacés */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around", // Espacement uniforme entre les filtres
              flexWrap: "wrap", // Permet le passage sur plusieurs lignes si nécessaire
              marginBottom: "30px" // Espacement entre les filtres et le contenu
            }}
          >
            <div className="select-container">
              <label htmlFor="letter">Filtrer par Lettre : </label>
              <select onChange={handleLetterChange} value={currentLetter} aria-label="Filtrer par Lettre">
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
              <select onChange={handleGenreChange} value={selectedGenre} aria-label="Filtrer par Genre">
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
              <select onChange={handlePlatformChange} value={selectedPlatform} aria-label="Filtrer par Plateforme">
                <option value="">Toutes</option>
                <option value="1">PlayStation</option>
                <option value="2">Xbox</option>
                <option value="3">PC</option>
                <option value="18">PlayStation 4</option>
                <option value="14">Xbox One</option>
                <option value="15">Xbox 360</option>
              </select>
            </div>
  
            <div className="select-container">
              <label htmlFor="sortOrder">Trier par : </label>
              <select onChange={handleSortOrderChange} value={sortOrder} aria-label="Trier par">
                <option value="rating">Note</option>
                <option value="released">Date de sortie</option>
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
};

export default AllGamesPage;
