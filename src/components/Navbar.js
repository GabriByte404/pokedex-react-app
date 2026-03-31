import React from 'react';
import './style/Navbar.css';
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            navigate("/");  // porta alla schermata di login (una volta fatto il logout)
            localStorage.removeItem('hasSeenCookiePopup');
          })
          .catch((err) => {
            alert(err.message);
          });
    };

    return (
        <div className='row justify-content-center align-items-center'>
            <nav className='fixed-bottom d-flex justify-content-center align-items-center'>
                <ul className="menu-bar">
                    <li onClick={() => navigate("/Pokemon")}>
                        <span className="menu-icon"><img src="../../../img/pika.png" className="icon" alt="icon" /></span>
                        <span className="menu-text">Pokemon</span>
                    </li>
                    <li onClick={() => navigate("/Gcc")}>
                        <span className="menu-icon"><img src="../../../img/pokeball.png" className="icon" alt="icon" /></span>
                        <span className="menu-text">GCC</span>
                    </li>
                    <li onClick={() => navigate("/Pokedex")}>
                        <span className="menu-icon2"><img src="../../../img/pokedex.png" className="iconMore" alt="icon" /></span>
                        <span className="menu-text">Pokedex</span>
                    </li>
                    <li onClick={handleSignOut}>
                        <span className="menu-icon"><i className="fas fa-sign-out-alt"></i></span>
                        <span className="menu-text">Logout</span>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;