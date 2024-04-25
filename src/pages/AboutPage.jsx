import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AboutPage() {
    return (
        <>
        <Header />
        <main>
            <section>
                <div className="container">
                    <h1>About Us</h1>
                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}

export default AboutPage;