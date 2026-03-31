import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import Loading from './Loading';
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from 'firebase/database';
import CardPoke from "../components/CardPoke";
import { Container, Row, Col } from 'react-bootstrap';

const Pokedex = () => {
  const [pokemonSave, setPokemonSave] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMissingCards, setShowMissingCards] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const databaseRef = ref(db);
        onValue(databaseRef, (snapshot) => {
          const dataFromFirebase = snapshot.val();
          const pokemonData = [];
          for (let i = 0; i < dataFromFirebase.Pokemon.length; i++) {
            const pokemon = dataFromFirebase.Pokemon[i];
            if (pokemon.figurine && Array.isArray(pokemon.figurine)) {
              pokemonData.push(...pokemon.figurine);
            }
          }
  
          setPokemonData(pokemonData);
        });

        const userID = auth.currentUser.uid;
        const pokedexRef = ref(db, `PokedexPersonal/${userID}`);
        onValue(pokedexRef, (snapshot) => {
          const dataFromFirebase = snapshot.val();
          if (dataFromFirebase) {
            const cards = Object.values(dataFromFirebase);
            setPokemonSave(cards);
          }
          setLoading(false);
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const ToogleSwitch = ()=>{
    const toggle = document.getElementById("toggle");
    toggle.classList.toggle("active");
    setShowMissingCards(!showMissingCards)
  }

  return (
    <div className="backColor">
      <Container>
        <Row className="my-4 rigaPoke d-flex justify-content-center align-items-center">
          {!loading && (
            <Col xs={12} sm={12} md={12} lg={12} className="m-5">
              {pokemonSave.length > 0 ? (
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} className="titolo d-flex align-items-center justify-content-center justify-content-sm-start text-center mb-4">POKéMON CATTURATI</Col>
                  <Col xs={12} sm={12} md={12} lg={12} className=" d-flex align-items-center justify-content-center justify-content-sm-end">
                    <div className="mr-2 scrittaToogle">Pokemon Mancanti</div>
                    <div id="toggle" onClick={ToogleSwitch}>
                      <div className="switch"></div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="sad">
                  <div className="text-center NoPoke" >Nessun Pokemon Catturato</div>
                  <div>
                    <img className="sadPika" src="../../../img/sadPika.png"/>
                  </div>
                </div>
              )}
            </Col>
          )}
          {loading ? (
            <Loading />       
          ) : (
            pokemonData.map((card, index) => {
              const isCardSaved = pokemonSave.some(savedCard => savedCard.pokemonSave === card.nome && savedCard.pokemonProg === card.progressivo);
              const shouldShowCard = showMissingCards || isCardSaved;

              return (
                shouldShowCard && (
                  <Col xs={12} sm={6} md={4} key={index} className={`mb-4 ${isCardSaved ? '' : 'missing-card'}`}>
                   <CardPoke dataProp={card} flag={false}/>
                  </Col>
                )
              );
            })
          )}
        </Row>
      </Container>
      <Navbar />
    </div>
  );
};

export default Pokedex;