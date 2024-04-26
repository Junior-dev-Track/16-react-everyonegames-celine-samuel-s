import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!searchTerm) {
            setGames([]);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_REACT_APP_RAWG_API_KEY}&search=${searchTerm}`);
                const data = await response.json();
                setGames(data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Ici, vous pourriez définir un état d'erreur et l'afficher à l'utilisateur
            }
        };

        const timerId = setTimeout(() => {
            fetchData();
        }, 500); // Attendre 500 ms après la dernière frappe pour effectuer la recherche

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header>
            <div className="container">
                <Link to='/'>
                    <img src="../src/images/logo.png" alt="home" className="logo"/>
                </Link>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search for a game" 
                        value={searchTerm}
                        onChange={handleSearchChange} 
                    />
                    {searchTerm && (
                        <ul className="search-results">
                            {games.map(game => (
                                <li key={game.id} onClick={() => navigate(`/game/${game.slug}`)}>
                                    {game.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to='/allgames'>Browse games</Link>
                            <Link to='/about'>About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
