import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function GamePage() {
    const { id } = useParams();

    // TODO : fetch game data from API

    return (
        <>
        <Header />
        <main>
            <section>
                <div className="container">
                    <h1>Description game</h1>
                    <p>Game ID: {id}</p>
                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}

export default GamePage;