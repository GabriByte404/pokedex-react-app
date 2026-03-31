import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import Loading from './Loading';
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from 'firebase/database';
import SetPoke from "../components/SetPoke";
import { Container, Row, Col } from 'react-bootstrap';

const Gcc = () => {
  const [pokemonSet, setPokemonSet] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const databaseRef = ref(db);
        onValue(databaseRef, (snapshot) => {
          const dataFromFirebase = snapshot.val();
          setPokemonSet(dataFromFirebase.Pokemon);
          setLoading(false);
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="backColor">
      <Container>
        <Row className="my-4 d-flex justify-content-center align-items-center">
        {!loading && (
          <Col xs={12} sm={12} md={12} lg={12} className="m-5">
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="titolo d-flex align-items-center justify-content-center justify-content-sm-start text-center mb-4">TUTTI I SET DEL MONDO POKéMON</Col>
              <Col xs={12} sm={12} md={12} lg={12} className="infoSet d-flex align-items-center justify-content-center">Scopri i Pokemon appartenenti ai vari Set</Col>
            </Row>
          </Col>
          )}
          {loading ? (
            <Loading />          
          ) : (
            pokemonSet.map((set, index) => (
              <Col xs={12} sm={12} md={6} key={index} className="mb-4">
                <SetPoke dataProp={set} />
              </Col>
            ))
          )}
        </Row>
      </Container>
      <Navbar />
    </div>
  )
}

export default Gcc