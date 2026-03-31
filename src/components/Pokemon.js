import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import Loading from './Loading';
import Search from './SearchInput';
import CardPoke from "./CardPoke";
import CookiePopup from "./CookiePopup";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from 'firebase/database';
import { Container, Row, Col } from 'react-bootstrap';

const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [switchSave, setSwitchSave] = useState(false);
  const [sortByNumber, setSortByNumber] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const navigate = useNavigate();

  const updatePokemonData = (newData) => {
    setPokemonData(newData);
    setSwitchSave(!switchSave)
  };

  useEffect(() => {
    // Cookie
    const hasSeenCookiePopup = localStorage.getItem('hasSeenCookiePopup');
    if (!hasSeenCookiePopup) {
      setShowCookiePopup(true);
      localStorage.setItem('hasSeenCookiePopup', 'true');
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        const databaseRef = ref(db);
        onValue(databaseRef, (snapshot) => {
          const dataFromFirebase = snapshot.val();
          
          const pokemonData = [];
          for (let i = 0; i < dataFromFirebase.Pokemon.length; i++) {   // estrapola tutti i pokemon dai vari set e li unisce in un unico array
            const pokemon = dataFromFirebase.Pokemon[i];
            if (pokemon.figurine && Array.isArray(pokemon.figurine)) {
              pokemonData.push(...pokemon.figurine);
            }
          }
  
          setPokemonData(pokemonData);
          setLoading(false);
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const ToogleSwitch = () => {
    const toggle = document.getElementById("toggle");
    toggle.classList.toggle("active");  // aggiunge o rimuove la classe CSS "active" dall'elemento toggle
    setSortByNumber(!sortByNumber);
    if (sortByNumber == false){
      setSwitchSave(true)
    } else{
      setSwitchSave(false)
    }
  };  
  
  return (
    <div className="backColor">
      {showCookiePopup && <CookiePopup onClose={() => setShowCookiePopup(false)} />}
      <Container>
        <Row className="justify-content-center align-items-center w-100">
        {!loading && (
          <Col xs={12} sm={12} md={12} lg={12} className="m-5">
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="titolo d-flex align-items-center justify-content-center justify-content-sm-start text-center mb-4">TUTTI I POKéMON ESISTENTI</Col>
              <Col xs={12} sm={12} md={12} lg={12} className=" d-flex align-items-center justify-content-center justify-content-sm-end">
                <div className="mr-2 scrittaToogle">Riordina Pokemon</div>
                <div id="toggle" onClick={ToogleSwitch}>
                  <div className="switch"></div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className=" d-flex align-items-center justify-content-center mt-4">
                <Search dataProp={pokemonData} updatePokemonData={updatePokemonData} />
              </Col>
            </Row>
          </Col>
          )}
          {loading ? (
            <Loading />          
          ) : (
            pokemonData
              .slice() // copia dell'array pokemonData (non intacca l'array originale)
              .sort((a, b) => (sortByNumber ? a.numero - b.numero : 0))
              .map((pokemon, index) => {
                return (
                  <Col xs={12} sm={6} md={4} key={index} className="mb-4">
                    <CardPoke dataProp={pokemon} flag={false} loadSave={switchSave}/>
                  </Col>
                );
              }) 
          )}
        </Row>
      </Container>
      <Navbar />
    </div>
  );  
};

export default Pokemon;