import "./App.css";
import Header from "./components/header/header";
import EditorLanding from "./features/editorpage/editorLanding";
import MainSection from "./features/landingpage/mainsection";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation(); // Get the current route

  const headerClass =
    location.pathname === "/editor" ? "App editor" : "App";
  return (
    <div className={headerClass}>
      <Header />
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="/editor" element={<EditorLanding />} />
      </Routes>
    </div>
  );
}

export default App;