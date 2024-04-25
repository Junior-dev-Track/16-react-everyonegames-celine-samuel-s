import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AllGamesPage() {
    return (
        <>
            <Header />
            <main>
                <section>
                    <div className="container">
                        <h1>All Games</h1>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default AllGamesPage;