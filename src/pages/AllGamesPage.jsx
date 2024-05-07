import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';

function AllGamesPage() {
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ordering, setOrdering] = useState('');
    const gameIds = useRef(new Set()); // Suivi des identifiants uniques

    // Charger les jeux en fonction de la page et du critère de filtrage
    const loadGames = async () => {
        const apiKey = import.meta.env.VITE_REACT_APP_RAWG_API_KEY;
        if (!apiKey) {
            console.error('La clé d\'API RAWG n\'est pas définie.');
            return;
        }

        // Construire l'URL de la requête avec les paramètres nécessaires
        let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`;
        if (ordering) {
            url += `&ordering=${ordering}`;
        }

        console.log("Fetching URL:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched data:", data.results);

            // Utiliser une expression régulière pour n'autoriser que les caractères latins
            const latinAlphabetRegex = /^[a-zA-Z0-9\s.,'’!"#$%&()*+/:;<=>?@\[\]^_`{|}~-]+$/;
            const filteredGames = data.results.filter(game => {
                const isLatin = latinAlphabetRegex.test(game.name);
                console.log(`Checking game: ${game.name}, isLatin: ${isLatin}`);
                return isLatin && !gameIds.current.has(game.id);
            });

            // Ajouter les jeux filtrés à la liste existante
            setGames(prevGames => [...prevGames, ...filteredGames]);

            // Mettre à jour les identifiants uniques déjà chargés
            filteredGames.forEach(game => gameIds.current.add(game.id));

            // Vérifier s'il reste d'autres pages à charger
            setHasMore(!!data.next);
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux :', error.message);
        }
    };

    // Charger les jeux lors du chargement initial et sur modification du tri
    useEffect(() => {
        loadGames();
    }, [page, ordering]);

    // Gestionnaire d'événement pour la sélection du filtre
    const handleOrderingChange = (event) => {
        setGames([]);
        setPage(1);
        setHasMore(true);
        gameIds.current.clear(); // Réinitialiser les identifiants uniques
        setOrdering(event.target.value);
    };

    // Gestionnaire d'événement de défilement pour charger plus de jeux
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100 && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <>
            <Header />
            <main>
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1>Tous les Jeux</h1>
                        <select onChange={handleOrderingChange} value={ordering} aria-label="Filtrer par">
                            <option value="">Par défaut</option>
                            <option value="name">Nom (A-Z)</option>
                            <option value="-name">Nom (Z-A)</option>
                        </select>
                    </div>
                    <div className="container container-all-games-page">
                        {games.map(game => (
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
