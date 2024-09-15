import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { v4 as uuidv4 } from 'uuid';  // Import uuid for generating unique IDs
import Footer from '../../../components/footer/footer';

const MainSection = () => {
  const navigate = useNavigate();  // Use navigate for programmatic routing

  const handleStartSession = () => {
    const newSessionId = uuidv4();  // Generate a unique session ID
    navigate(`/editor/${newSessionId}`);  // Redirect to the editor with the generated session ID
  };

  return (
    <>
      <main>
        <section className="hero">
          <h1>Collaborate in Real-Time</h1>
          <p>Share code instantly with others for collaborative editing.</p>
          {/* Use button to trigger session creation */}
          <button className="cta" onClick={handleStartSession}>
            Start Sharing
          </button>
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
  );
};

export default MainSection;
