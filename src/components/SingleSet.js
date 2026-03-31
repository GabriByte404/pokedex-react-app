import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
// components
import Navbar from './Navbar';
import Loading from './Loading';
import CardPoke from "../components/CardPoke";

export default function SingleSet() {
    const navigate = useNavigate(); //naviga
    const [loading, setLoading] = useState(true); //carica
    const location = useLocation(); //dati da SetPoke
    const { dataProp } = location.state;

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
              setLoading(false);

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
                    <Col xs={12} sm={12} md={12} lg={12} className="titolo d-flex align-items-center justify-content-center justify-content-sm-start mb-4">{dataProp.nomeSet}</Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="infoSet d-flex align-items-center justify-content-center justify-content-sm-end">Numero Set: {dataProp.numeroSet}</Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="infoSet d-flex align-items-center justify-content-center justify-content-sm-end">Anno di Uscita: {dataProp.annoUscita}</Col>
                </Row>
            </Col>
          )}
          {loading ? (
            <Loading />          
          ) : (
            dataProp.figurine.map((pokemon, index) => (
              <Col xs={12} sm={6} md={4} key={index} className="mb-4">
               <CardPoke dataProp={pokemon} flag={true}/>
              </Col>
            ))
          )}
        </Row>
      </Container>
      <Navbar />
    </div>
    );
}
