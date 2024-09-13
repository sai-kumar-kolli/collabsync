import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/footer'


const MainSection = () => {

    return (
        <>
            <main>
                <section className="hero">
                    <h1>Collaborate in Real-Time</h1>
                    <p>Share code instantly with others for collaborative editing.</p>
                    <Link to="/editor" className="cta">
                        Start Sharing
                    </Link>
                </section>

                <section className="how-it-works">
                    <div className="step">
                        <h2>Step 1</h2>
                        <p>Start a session</p>
                    </div>
                    <div className="step">
                        <h2>Step 2</h2>
                        <p>Invite others</p>
                    </div>
                    <div className="step">
                        <h2>Step 3</h2>
                        <p>Collaborate in real time</p>
                    </div>
                </section>
            </main>
            <Footer />

        </>
    )
}

export default MainSection