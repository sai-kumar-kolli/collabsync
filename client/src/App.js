import "./App.css";
import icon from "../src/assets/images/icon.jpeg";
function App() {
  return (
    <div className="App">
      <header className="c-header">
        <nav>
          <div class="logo">
            <img className="collab-icon" src={icon} alt="collabsync" />
            <div className="c-name">Collab Sync</div>
          </div>
          <ul class="nav-links">
            <li>
              <a href="#">Sign In</a>
            </li>
            <li>
              <a href="#">Start Sharing</a>
            </li>
          </ul>
        </nav>
      </header>
      <section class="hero">
        <h1>Collaborate in Real-Time</h1>
        <p>Share code instantly with others for collaborative editing.</p>
        <a href="#" class="cta">
          Start Sharing
        </a>

        <section class="how-it-works">
          <div class="step">
            <h2>Step 1</h2>
            <p>Start a session</p>
          </div>
          <div class="step">
            <h2>Step 2</h2>
            <p>Invite others</p>
          </div>
          <div class="step">
            <h2>Step 3</h2>
            <p>Collaborate in real time</p>
          </div>
        </section>

        <footer class="footer">
          <p>&copy; 2024 Your Company</p>
        </footer>
      </section>
    </div>
  );
}

export default App;
