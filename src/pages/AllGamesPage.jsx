import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";

// Plateformes spécifiques à afficher
const availablePlatforms = [
  { id: "3", name: "PC" },
  { id: "18", name: "PlayStation 4" },
  { id: "14", name: "Xbox One" },
  { id: "15", name: "Xbox 360" },
];

function AllGamesPage() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentLetter, setCurrentLetter] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // Empty by default for "Default"
  const gameIds = useRef(new Set());

  // Load games per page
  const loadGames = async () => {
    const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
    if (!apiKey) {
      console.error("RAWG API key is not set.");
      return;
    }

    if (loading || !hasMore) return;

    setLoading(true);

    // Construct the URL with the sorting option if specified
    let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`;
    if (sortOrder) {
      url += `&ordering=-${sortOrder}`;
    }
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
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data.results);

      const uniqueGames = data.results.filter((game) => {
        const isUnique = !gameIds.current.has(game.id);
        const hasValidProperties =
          game.name && game.background_image && game.parent_platforms;
        const startsWithCurrentLetter = currentLetter
          ? game.name.toUpperCase().startsWith(currentLetter)
          : true;
        const esrbRating = game.esrb_rating?.slug || "";
        const isNotAdult = !["adult-only", "mature"].includes(esrbRating);
        const tags = game.tags?.map((tag) => tag.slug) || [];
        const isNotNSFW = !tags.includes("nsfw");

        return (
          isUnique &&
          hasValidProperties &&
          startsWithCurrentLetter &&
          isNotAdult &&
          isNotNSFW
        );
      });

      uniqueGames.forEach((game) => gameIds.current.add(game.id));
      setGames((prev) => [...prev, ...uniqueGames]);

      setHasMore(!!data.next);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error retrieving games:", error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load games when changing letter, genre, platform, or sort order
  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
    gameIds.current.clear();
    loadGames();
  }, [currentLetter, selectedGenre, selectedPlatform, sortOrder]);

  // Load available genres
  useEffect(() => {
    const loadGenres = async () => {
      const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
      const url = `https://api.rawg.io/api/genres?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setGenres(data.results);
      } catch (error) {
        console.error("Error retrieving genres:", error.message);
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
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
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
          {/* Centered title */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "Gill Sans, sans-serif",
            }}
          >
            <h1>All Games</h1>
          </div>

          {/* Horizontally spaced filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <div className="select-container">
              <label htmlFor="letter">Filter by Letter: </label>
              <select
                onChange={handleLetterChange}
                value={currentLetter}
                aria-label="Filter by Letter"
              >
                <option value="">All</option>
                {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-container">
              <label htmlFor="genre">Filter by Genre: </label>
              <select
                onChange={handleGenreChange}
                value={selectedGenre}
                aria-label="Filter by Genre"
              >
                <option value="">All</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-container">
              <label htmlFor="platform">Filter by Platform: </label>
              <select
                onChange={handlePlatformChange}
                value={selectedPlatform}
                aria-label="Filter by Platform"
              >
                <option value="">All</option>
                {availablePlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-container">
              <label htmlFor="sortOrder">Sort by: </label>
              <select
                onChange={handleSortOrderChange}
                value={sortOrder}
                aria-label="Sort by"
              >
                <option value="">Default</option>
                <option value="rating">Rating</option>
                <option value="released">Release Date</option>
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
