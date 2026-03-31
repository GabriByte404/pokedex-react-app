import React from 'react';
import "./style/CookiePopup.css"

function CookiePopup({ onClose }) {
  return (
    <div className='cookieBox'>
      <div className="cardCookie fixed-center">
          <img className='photoCookie' src='../../img/alert/cookie.png'></img>
          <p className="cookieHeading">Diritti riservati.</p>
          <p className="cookieDescription">Tutti i diritti, delle immagini e dei testi, sono proprietà intelletuale, appartengono, e sono riservati a Pokémon.<br/><a href="https://www.pokemon.com/it/informazioni-legali/" target="_blank">©2023 Pokémon Nintendo/Creatures</a>.</p>

          <div className="buttonContainer">
            <button onClick={onClose} className="acceptButton">Allow</button>
          <button className="declineButton">Decline</button>
          </div>
      </div>
    </div>
  );
}

export default CookiePopup;