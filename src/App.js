import React from 'react'
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Components
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTop from './components/ScrollToTop';
import Login from "./components/Login";
import Pokemon from "./components/Pokemon";
import Gcc from "./components/Gcc";
import Pokedex from "./components/Pokedex";
import SingleCard from "./components/SingleCard";
import SingleSet from "./components/SingleSet";

function App() {
  return (
    <div className="app">
      <ScrollToTopButton />
        {/* tutte le varie 'rotte', quindi le varie pagine dell'app */}
        <Router>
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Pokemon" element={<Pokemon />} />
              <Route path="/Gcc" element={<Gcc />} />
              <Route path="/Pokedex" element={<Pokedex />} />
              <Route path="/SingleCard" element={<SingleCard />} />
              <Route path="/SingleSet" element={<SingleSet />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;