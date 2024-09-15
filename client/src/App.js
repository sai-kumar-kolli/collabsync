import "./App.css";
import Header from "./components/header/header";
import EditorLanding from "./features/Pages/editorpage/editorLanding";
import { Route, Routes, useLocation } from "react-router-dom";
import MainSection from "./features/Pages/landingpage/mainsection";

function App() {
  const location = useLocation(); // Get the current route

  const headerClass = location.pathname.includes("/editor")
    ? "App editor"
    : "App";
  return (
    <div className={headerClass}>
      <Header />
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="/editor/:sessionId" element={<EditorLanding />} />
      </Routes>
    </div>
  );
}

export default App;
